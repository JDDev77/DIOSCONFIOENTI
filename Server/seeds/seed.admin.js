const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user'); 
const imagePath = "../public/img/user.png";

// Set mongoose's strictQuery option to prepare for Mongoose 7
mongoose.set('strictQuery', true);

mongoose.connect('mongodb://localhost:27017/mi_redsocial', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB Connected');
    ejecutar(imagePath);
})
.catch(err => console.log(err));

const ejecutar = async (imagePath) => {
    try {
        const hashedPassword = await bcrypt.hash("securePassword", 12); 

        const adminExists = await User.findOne({ email: "admin@example.com" });
        if (adminExists) {
            console.log('Admin user already exists');
            return;
        }

        await User.create({
            name: "Admin",
            surname: "User",
            bio: "Admin bio",
            nick: "AdminNick",
            email: "admin@example.com",
            password: hashedPassword,
            role: "role_admin",
            image: imagePath 
        });
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        // Ensure all pending operations are completed before disconnecting
        mongoose.disconnect().then(() => console.log('Disconnected from MongoDB'));
    }
};
