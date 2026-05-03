import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
  try {
    const { name, email, password, businessName, CIF, address, role} = req.body;

    //¿Existe el usuario?

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'EL usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        businessName,
        CIF,
        address,
        role
    });

    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        console.log("ERROR REGISTER:", error);
        res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role:user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const userWIthoutPassword = user.toObject();
        delete userWIthoutPassword.password;

        return res.json({ //MODIFICADO
            token,
            user: userWIthoutPassword   
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
};

export { register, login };

