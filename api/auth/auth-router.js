const router = require('express').Router()
const users = require('../users/users-model.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secrets = require('../../config/secrets.js')

router.post('/register', async (req, res) => {
    let userData = req.body;

    const hash = bcrypt.hashSync(userData.password, 10)
    userData.password = hash;

    try {
        const saved = await users.add(userData);
        res.status(201).json(saved);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

})

router.post('/login', async (req,res) => {
    let { username, password } = req.body;
    
    try {
        const user = await users.findBy({username})
        console.log(user);
        if(user && bcrypt.compareSync(password, user[0].password)) {
            const token = generateToken(user)
            res.status(200).json({
                message: `Welcome ${username}`,
                token: token
            })
        } else {
            res.status(401).json({message: 'Invalid credentials!'})
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `There was an error with the database ${err}`})
    }
})

router.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy((err) => {
            if(err) {
                res.status(400).json({message: "Whoops! You seem... stuck.", error: err})
            } else {
                res.json({message: 'Logged out'})
            }
        })
    } else {
        res.end();
    }
})

function generateToken(user) {
    //
    const payload =  {
        subject: user.id,
        username: user.username,
        department: user.department
    }

    const options = {
        expiresIn: "1d"
    }

    console.log(secrets.jwtSecret)
    return jwt.sign(payload, secrets.jwtSecret, options)
}
 






module.exports = router;