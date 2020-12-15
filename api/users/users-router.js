const router = require("express").Router();
const Users = require("./users-model.js");
const restrict = require("../auth/restricted-middleware.js")


router.get("/", restrict, (req, res) => {
      Users.find()
            .then(users => {
                  res.json(users);
            })
            .catch(err => res.send(err));
});

module.exports = router;