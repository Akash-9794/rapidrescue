const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const hospitalSchema = new mongoose.Schema({
  name: String,
  phone: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number],
  },
});

hospitalSchema.index({ location: '2dsphere' });
const Hospital = mongoose.model('Hospital', hospitalSchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/find-hospitals', async (req, res) => {
  const { lat, lng } = req.query;
  try {
    const hospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 10000,
        },
      },
    }).limit(10);
    res.json({ hospitals });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hospitals' });
  }
});

app.post('/update-hospital', async (req, res) => {
  const { name, phone, lat, lng } = req.body;
  try {
    const newHospital = new Hospital({
      name,
      phone,
      location: {
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
    });
    await newHospital.save();
    res.status(201).json({ message: 'Hospital added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding hospital' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});