const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    if (req.isAuthenticated()){
        res.redirect('/ordenes');
      } else {res.redirect('./signin');}
});


module.exports = router;
