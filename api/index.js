const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const mime = require('mime-types');
const connectWithDB = require('./config/db.js');
require('dotenv').config();
const app = express();
const firebase = require('firebase/compat/app');
require('firebase/compat/storage');
const multer = require('multer');
const fs = require('fs');

// connect with database
connectWithDB();

//firebase

const firebaseConfig = {
  apiKey: "AIzaSyBmFYNgvZ1iz0xB64xX1vDL39hNrd8sqUw",
  authDomain: "homestay-8667c.firebaseapp.com",
  projectId: "homestay-8667c",
  storageBucket: "homestay-8667c.appspot.com",
  messagingSenderId: "381617764506",
  appId: "1:381617764506:web:a36d6df350b4d7c7520723",
  measurementId: "G-54P1SS335R"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

//test if connectio db is ok
app.get('/api/test', (req,res) => {
  res.json('test ok');
});

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;
const bucket = 'homestay-8667c.appspot.com';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(cors({
  credentials: true,
  origin: 'http://127.0.0.1:5173',
}));

async function uploadToS3(path, originalFilename, mimetype) {
  try {
      const parts = originalFilename.split('.');
      const ext = parts[parts.length - 1];
      const newFilename = Date.now() + '.' + ext;
      const ref = storage.ref().child(newFilename);
      const fileContent = fs.readFileSync(path);
      const uint8Array = new Uint8Array(fileContent.buffer);
      await ref.put(uint8Array, { contentType: mimetype });
      return await ref.getDownloadURL();
  } catch (error) {
      console.error('Error uploading file to Firebase Storage:', error);
      throw error;
  }
}


function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.post('/register', async (req,res) => {

  const {name,email,password} = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password:bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }

});

app.post('/login', async (req,res) => {

  const {email,password} = req.body;
  const userDoc = await User.findOne({email});
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email:userDoc.email,
        id:userDoc._id
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        //verify token and console log if it's valid or not
        jwt.verify(token, jwtSecret, {}, (err,userData) => {
          if (err) {
            console.log('invalid token');
          } else {
            console.log('valid login token',token);
          }
        }); 
        //set token in cookie
        res.cookie('token', token, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        }).json('ok');
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
});

app.get('/profile', (req,res) => {

  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name,email,_id} = await User.findById(userData.id);
      res.json({name,email,_id});
    });
  } else {
    res.json(null);
  }
});

app.post('/logout', (req,res) => {
  res.cookie('token', '').json(true);
});


app.post('/upload-by-link', async (req,res) => {
  const {link} = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    url: link,
    dest: '/tmp/' +newName,
  });
  const url = await uploadToS3('/tmp/' +newName, newName, mime.lookup('/tmp/' +newName));
  res.json(url);
});

const photosMiddleware = multer({dest:'/tmp'});
app.post('/upload', photosMiddleware.array('photos', 100), async (req,res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const {path,originalname,mimetype} = req.files[i];
    const url = await uploadToS3(path, originalname, mimetype);
    uploadedFiles.push(url);
  }
  res.json(uploadedFiles);
});

app.post('/places', (req,res) => {

  const {token} = req.cookies;
  const {
    title,address,addedPhotos,description,price,
    perks,extraInfo,checkIn,checkOut,maxGuests,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner:userData.id,price,
      title,address,photos:addedPhotos,description,
      perks,extraInfo,checkIn,checkOut,maxGuests,
    });
    res.json(placeDoc);
  });
});

app.get('/user-places', (req,res) => {

  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id} = userData;
    res.json( await Place.find({owner:id}) );
  });
});

app.get('/places/:id', async (req,res) => {

  const {id} = req.params;
  res.json(await Place.findById(id));
});

app.put('/places', async (req,res) => {

  const {token} = req.cookies;
  const {
    id, title,address,addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

app.get("/places", async (req, res) => {
  const searchQuery = req.query.search || "";
  const searchRegex = new RegExp(searchQuery, "i");

  const minPrice = req.query.minPrice ? parseInt(req.query.minPrice) : 0;
  const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice) : Infinity;

  try {
    const places = await Place.find({
      $or: [
        { address: { $regex: searchRegex } },
        { title: { $regex: searchRegex } },
      ],
      price: { $gte: minPrice, $lte: maxPrice },
    });

    res.json(places);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching places" });
  }
});


app.post('/bookings', async (req, res) => {

  const userData = await getUserDataFromReq(req);
  const {
    place,checkIn,checkOut,numberOfGuests,name,phone,price,
  } = req.body;
  Booking.create({
    place,checkIn,checkOut,numberOfGuests,name,phone,price,
    user:userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});
  

app.get('/bookings', async (req,res) => {

  const userData = await getUserDataFromReq(req);
  res.json( await Booking.find({user:userData.id}).populate('place') );
});

app.listen(4000);