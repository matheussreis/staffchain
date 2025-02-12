require('dotenv').config();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../api/models/user');

const seedAdmin = async () => {
  const password = process.env.ADMIN_PASSWORD || 'admin';
  const email = process.env.ADMIN_EMAIL;

  if (!email) {
    throw new Error('Missing variable: [ADMIN_EMAIL]');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log('Admin user already exists.');
    console.log('Skipping seeder script.');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    firstName: 'System',
    lastName: 'Administrator',
    birthdate: new Date(),
    email,
    password: hashedPassword,
    isAdmin: true,
  });

  await user.save();
  
  console.log('Admin user added successfully.');
};

(async () => {
  try {
    mongoose.set('strictQuery', false);

    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);

    await seedAdmin();

    process.exit();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();
