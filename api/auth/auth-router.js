const router = require('express').Router()
const Users = require('../users/users-model.js')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secrets = require('../../config/secrets.js')


const checkForUser = async (req, res, next) => {
    try {
      let username = req.body.username;
      if (username) {
        const user = await Users.findBy(username);
        if (user) { req.userExists = true; req.user = user }
        else { req.userExists = false; }
        console.log("this is user: ", user)
        next();
      }
      else {
        res.status(400).json({message: "error: you must provide a username"})
      }
    }
    catch (error) {
      throw error;
    }
  }
  

router.post('/register', async (req, res) => {
    let { username, password, department } = req.body;

    if (!username && !password && !department) {
        res.status(401).json({ error: "Please fill out all required fields"});
      } else {
        try {
          const rounds = process.env.BCRYPT_ROUNDS;
          const hash = bcryptjs.hashSync(password, rounds)
          const saved = { username, password: hash, department }
          const addUser = await Users.add(saved)
          const name = await Users.findBy(username)
          const token = jwt.sign({ username }, process.env.JWT_SECRET, {expiresIn: '1d'})
          res.status(201).json({ Welcome: name, token: token })
        } catch (err) {
          console.log(err)
        }
      }
})

router.post('/login', checkForUser, async (req,res) => {
    let { username, password } = req.body

    try {
      if (req.userExists) {
        console.log("USER EXISTS:", req.userExists)
        const user = await Users.findBy(username)
        console.log("This is Log IN user: ", user)

        if (username && password) {
          if (bcryptjs.compareSync(password, req.user.password)) {
            const token = jwt.sign({ username: user.username}, process.env.JWT_SECRET, { expiresIn: '1d'})
            res.status(200).json({ message: `welcome, ${req.user.username}`, token })
          } else {
            res.status(401).json({ message: "invalid credentials" })
          }
        } else {
          res.status(400).json({ message: "username and password required"})
        }  
      }  else {
        res.status(400).json({message: "failed to log in: user does not exist"})
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'invalid credentials'})
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

// function generateToken(user) {
//     //
//     const payload =  {
//         subject: user.id,
//         username: user.username,
//         department: user.department
//     }

//     const options = {
//         expiresIn: "1d"
//     }
//     return jwt.sign(payload, secrets.jwtSecret, options)
// }
 






module.exports = router;