const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

mongoose.connect('mongodb://localhost:27017/sampleapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit the process if MongoDB connection fails
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  skills: { type: [String], required: true }
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());
app.use(cors());

app.post('/users', async (req, res) => {
  try {
    const { name, skills } = req.body;
    console.log('Received user:', { name, skills }); // Log received data
    const user = new User({ name, skills });
    await user.save();
    console.log('User saved:', user);
    res.status(201).send(user);
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).send({ message: error.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    console.log('Users retrieved:', users);
    res.status(200).send(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).send({ message: error.message });
  }
});

app.get('/skills', async (req, res) => {
  try {
    const skills = await User.distinct('skills');
    console.log('Skills retrieved:', skills);
    res.status(200).send(skills);
  } catch (error) {
    console.error('Error retrieving skills:', error);
    res.status(500).send({ message: error.message });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
