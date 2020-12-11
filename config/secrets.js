require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET || "Hide and Seek!"
}