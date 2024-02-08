const express = require('express');
const router = express.Router();
const helpers = require('../lib/helpers');
const pool = require('../database');

const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');

// SIGNUP

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

router.post('/actualizarcuenta', isLoggedIn, async (req, res, done) => {
  const {username, password, newpassword} = req.body;
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      const newpass = await helpers.encryptPassword(newpassword);
      const result = await pool.query('UPDATE users SET password = ? WHERE username = ? ', [newpass, username]);
      req.flash('success', 'Contraseña actualizada.');
      res.redirect('/configuracion')

    } else {
      req.flash('message', 'Contraseña incorrecta.');
      res.redirect('/configuracion')    }
  }

}
);

// SINGIN
router.get('/signin', (req, res) => {
  if (req.isAuthenticated()){
    res.redirect('/ordenes');
  } else {res.render('auth/signin');}
  
});


router.post('/signin', (req, res, next) => {
  req.check('username', 'El usuario es obligatorio.').notEmpty();
  req.check('password', 'La contraseña es obligatoria.').notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signin');
  }
  const handler = passport.authenticate('local.signin', {
    successRedirect: '/ordenes',
    failureRedirect: '/signin',
    failureFlash: true
  });
  handler(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});


module.exports = router;
