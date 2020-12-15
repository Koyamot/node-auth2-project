
const jwt = require('jsonwebtoken');
const secrets = process.env.JWT_SECRET;




module.exports = (req, res, next) => {

    try {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';


    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                res.status(401).json({ message: 'dang...', err: err.message });
            } else {
                jwt.decode = decodedToken;
            
                next();
            }
        })
    } else {
        res.status(401).json({ message: 'not logged in' });
    }
    } catch (err) {
        console.log(err);
          res.status(500).json({message: 'There was an error fetching jokes'});
    
}
}
