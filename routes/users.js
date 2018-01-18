var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var mysql = require('mysql');
var config = require('../config/config')
var connection = mysql.createConnection(config.db);


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/* REGISTER */
router.get('/register', (req, res, next) => {
    res.render('register', {
        title: 'City Runner',
    });
});

router.post('/registerProcess', (req, res, next) => {
    var name = req.body.name
    var username = req.body.username
    var email = req.body.email
    var password = req.body.password
    var selectQuery = 'SELECT * FROM users WHERE email = ?;';
    connection.query(selectQuery, [email], (error, results) => {
        console.log(results)
        if (results.length != 0) {
            res.redirect('/register')
        } else {
            var hash = bcrypt.hashSync(password)
            var insertQuery = 'INSERT INTO users (name,username,email,password) VALUES (?,?,?,?);';
            connection.query(insertQuery, [name, username, email, hash], (error) => {
                if (error) {
                    throw error
                }
                res.redirect('/')
            });
        };
    });
});

/* LOGIN */
router.get('/login', (req, res, next) => {
    res.render('login', {
        title: 'City Runner',
    });
});

router.post('/loginProcess', (req, res, next) => {
    var username = req.body.username
    var password = req.body.password
    var selectQuery = 'SELECT * FROM users WHERE username = ?;';
    connection.query(selectQuery, [username], (error, results) => {
        if (error) {
            throw error
        } else {
            if (results.length == 0) {
                res.redirect('/users/register')
            } else {
                var passwordMatch = bcrypt.compareSync(password, results[0].password)
                if (passwordMatch) {
                    var row = results[0];
                    req.session.name = row.name;
                    req.session.uid = row.id;
                    req.session.email = row.email;
                    res.redirect('/home?msg=loggedIn')
                } else {
                    res.redirect('/users/login?msg=passwordIncorrect');
                }
            }
        }
    })
})

/* PROFILE */
router.get('/profile', (req, res, next) => {
    res.render('profile');
});


module.exports = router;