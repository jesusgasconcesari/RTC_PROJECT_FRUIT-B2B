import jwt from 'jsonwebtoken';

export const isAuth = (req, res, next) => {

    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        const parsedToken = token.replace('Bearer ', '');

        const decoded = jwt.verify(parsedToken, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido', error });
    }
};


export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado' });
    }
    next();
};