const mongoose = require('mongoose');
const PlaceModel = require('./models/Place.js');
const faker = require('faker');
require('dotenv').config();


// Connect to the database
mongoose.connect(process.env.MONGO_URL);

const NUM_HOMES = 4;

for (let i = 0; i < NUM_HOMES; i++) {
  const place = new PlaceModel({
    owner: mongoose.Types.ObjectId(),
    title: faker.lorem.words(),
    address: faker.address.streetAddress(),
    photos: [
      'https://media.istockphoto.com/id/1211174464/photo/beautiful-residential-home-exterior-on-bright-sunny-day-with-green-grass-and-blue-sky.jpg?s=612x612&w=0&k=20&c=h0XtWGD8asz_hfDVus7SWwOrtAFlZYfr7wdStKCQv14%3D',
      'https://media.istockphoto.com/id/1211174464/photo/beautiful-residential-home-exterior-on-bright-sunny-day-with-green-grass-and-blue-sky.jpg?s=612x612&w=0&k=20&c=h0XtWGD8asz_hfDVus7SWwOrtAFlZYfr7wdStKCQv14%3D',
      'https://media.istockphoto.com/id/1211174464/photo/beautiful-residential-home-exterior-on-bright-sunny-day-with-green-grass-and-blue-sky.jpg?s=612x612&w=0&k=20&c=h0XtWGD8asz_hfDVus7SWwOrtAFlZYfr7wdStKCQv14%3D',
    ],
    description: faker.lorem.paragraph(),
    perks: [
      'Free Wi-Fi',
      'Free parking',
      'Kitchen',
      'Washer',
      'Dryer',
      'Air conditioning',
    ],
    extraInfo: faker.lorem.sentence(),
    checkIn: 3,
    checkOut: 11,
    maxGuests: 4,
    price: faker.datatype.number({ min: 50, max: 500 }),
  });

  place.save((err, place) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Saved place with ID: ${place._id}`);
    }
  });
}
