const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const imagePath = "Ideas2\Client\src\assets\img\Icono_Eventos.png"; 
//TODO Revisar el tema de la foto
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

        const adminExists = await User.findOne({ email: "eventos@example.com" });
        if (adminExists) {
            console.log('Existe ya el usuario');
            return;
        }

        await User.create({
            name: "Eventos",
            surname: "Locales",
            bio: "Siguenos para saber todo lo que se cuece en la ciudad!! Nuestro grupo de telegram es: https://t.me/eventoslocales y nuestro telefóno es :111-111-111",
            nick: "EVENTOS",
            email: "eventos@example.com",
            password: hashedPassword,
            role: "role_user",
            image: imagePath 
            
        });
        console.log('Usuario Eventos Locales creado con éxito');
    } catch (error) {
        
    } finally {
        mongoose.disconnect();
    }
};

ejecutar()