const jwt = require('jsonwebtoken');
const secrets = require('../../config/secrets.js')

module.exports = (req, res, next) => {
    try { 
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
        if (token) {
            jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
                console.log(secrets.jwtSecret)
                if (err) {
                    res.status(401).json({ message: 'dang...', err: err.message });
                } else {
                    req.decodedJwt = decodedToken;
                    next();
                }
            })
        } else {
            res.status(401).json({ message: 'not logged in' });
        }
    }  catch (err) {
        res.status(500).json({message: err.message});
    }
}