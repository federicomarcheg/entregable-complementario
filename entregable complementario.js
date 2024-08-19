const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'premium', 'admin'], default: 'user' },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);



const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('./models/User');


const router = express.Router();

router.post('/forgot-password', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Usuario no encontrado.');


        const token =
        crypto.randomBytes(20). toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();


        const trasporter =
        nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'fedemarcheg@gmail.com',
                pass: 'matute2367',
            },
        });


        const mailOptions = {
            to: user.email,
            from: 'fedemarcheg@gmail.com',
            subject: 'Recuperación de contraseña',
            text: `Para restablecer su contraseña, haga click en el siguiente enlace:\n`
        };



        await 
        WebTransportError.sendMail(mailOptions);
        res.status(200).send('Correo de recuperación enviado con exito.');
    } catch (error) {
        res.status(500).send('Error al enviar el correo de recuperación.');
    }
});



router.post('/reset-password/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) returnres.status(400).send('El token de restablecimiento es invalido o ha expirado.');

        if (req.body.password === req.body.confirmPassword) {
            if (user.isValidPassword(req.body.password)) {
                return res.status(400).send('No puedes utilizar la misma contraseña que antes.');
            }


            user.password = bcrypt.hashSync(req.body.password, 10);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();
            res.status(200).send('Contraseña restablecida con éxito.');
        } else {
            res.status(400)._construct.send('Las contraseñas no coinciden.');
        } 

        } catch (error) {

        res.status(500).send('Error al restablecer la contraseña.');
    }
});


const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
});

productSchema.pre('save', function (next) {
    if (!this.owner) {
        // aca el `admin` deberia ser el id del usuario administrador por defecto.

        this.owner = 'adminId';
    }
    next();
});

module.exports = mongoose.model('product', productSchema);




router.delete('/products/:id', async (req, res) => {
    try {
        const product = await product.findById(req.params.id);
        if (!product) returnres.status(404).send('producto no encontrado.');

        const userId = req.User._id;
        const userRole = req.user.role;

        if (userRole !== 'admin' && !product.owner.equals(userId)) {
            return res.status(403).send('No tienes permisos para eliminar este producto.');
        }

        await product.remove();
        res.status(200).send('Producto eliminado con éxito.');
    } catch (error) {
        res.status(500).send('Error al eliminar el producto.');
    }
});



router.post('/cart', async (req, res) => {
    try {
        const product = await 
        Product.findById(req.body.productId);
        if (!product) return
        res.status(400).send('producto no encontrado.');

         if (req.user.role === 'premium' &&
            product.owner.equals(req.user._id)) {
                return res.status(404).send('no puedes agregar tu propio producto al carrito')
            }

            // logica para agregar el producto al carrito...

            res.status(200).send('producto agregado al carrito con éxito.');

    } catch (error)  {
        res.status(500).send('Error al agregar el producto al carrito.');
    }

    
});

router.patch('/premium/:uid', async (req, res ) => {
    try {
        const user = await User.findById(req.params.uid);
        if (!user) returnres.status(404).send('Usuario no encontrado.');

        if (user.role === 'user') {
            user.role = 'premium';
        } else if (user.role === 'premium') {
            user.role = 'user';
        }

        await user.save();
        res.status(200).send(`Rol cambado a ${user.role}.`);
    } catch (error) {
        res,status(500).send('Error al cambiar el rol del usuario.');
    }
});