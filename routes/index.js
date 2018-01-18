var express = require('express');
var router = express.Router();
var config = require('../config/config');
var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var mysql = require('mysql');
var socketio = require('socket.io');
var app = require('../app');
var Timer = require('easytimer')

var connection = mysql.createConnection(config.db);

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {
        title: 'City Runner',
    });
});

router.get('/home', (req, res, next) => {
    res.render('home', {
        name: req.session.name,
        loggedIn: true,
    })
});

/* LOGOUT */
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/users/login');
})

/* ROUTES */
router.post('/routesProcess', (req, res, next) => {
    var currentLocation = req.body.currentLocation
    var distance = req.body.distance
    var userid = req.session.uid
    console.log(req.session.uid)
    console.log("hey chris")
    var insertQuery = 'INSERT INTO routes (currentLocation,distance,userid) VALUES (?,?,?);';
    connection.query(insertQuery, [currentLocation, distance, userid], (error) => {
        if (error) {
            throw error
        } else {
            console.log(distance)
            res.render('map', {
                address: currentLocation,
                distance: distance
            });
        }
    });
});

/* HISTORY */
router.get('/history', (req, res, next) => {
    var email = email;
    var historyQuery = "SELECT * FROM routes;"; // need to add in where clause to specify user
    connection.query(historyQuery, [email], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.render('history', { results })
        }
    })
})

router.get('/results',(req,res,next)=>{
    var uid = req.query.id

    console.log(req.query)
    var distance = decodeURI(req.query.distance);
    var address = decodeURI(req.query.address);
    var map = req.query.map;
    if(map == 1){
        var angle = 90;
    }else if(map == 2){
        var angle = 45;
    }else if(map == 3){
        var angle = 120;
    }else if(map == 4){
        var angle = 25;
    }
    var insertQuery = `INSERT INTO history (angle, address, distance) VALUES (?,?,?);`;
    connection.query(insertQuery,[angle, address,distance],(insertError, resultsError)=>{
        if(insertError){
            throw error;
        }
        var resultsQuery = 'SELECT startTime, endTime, ((endTime-startTime)/1000) as totalTime FROM results WHERE id = ?;';
        connection.query(resultsQuery,[uid],(error,results)=>{
            console.log(results)
            if(error){
                throw error
            }else{
                console.log(results)
                var timeResults = [];
                results.map((result)=>{
                    let timeDenom = {};
                    timeDenom.hours = Math.floor((result.totalTime / (60 * 60)) % 24);
                    timeDenom.minutes = Math.floor((result.totalTime / 60) % 60);
                    timeDenom.seconds = Math.floor(((result.totalTime) % 60));
                    timeResults.push(timeDenom)
                })
                
                console.log(timeResults);
                res.render('results',{
                    results: timeResults,
                    distance: distance,
                    address: address
                })
            }
        })
    })
})

router.post('/historyProcess', (req, res, next) => {
    var selectQuery = ' SELECT currentLocation,distance FROM routes;';
    connection.query(selectQuery, (error, results) => {
        if (error) {
            throw error
        } else {
            res.render('map', {
                address: currentLocation,
                distance: distance
            });
        }

    })
})

router.post('/start',(req,res,next)=>{
    console.log(req.body)
    var date = req.body.date
    var resultsUserId = req.session.uid
    if(resultsUserId === undefined){
        // res.redirect('/login');
        ///////////////////////////////////////////////
        ////////FOR DEVELOPMENT... AVOID ERROR/////////
        ///////////////////////////////////////////////
        resultsUserId = 2
    }
    var insertQuery = 'INSERT INTO results (startTime,resultsUserId) VALUES (?,?);';
    connection.query(insertQuery,[date,resultsUserId],(error,results)=>{
        var importantId = results.insertId
        console.log(importantId)
        console.log(results)
        if (error){
            throw error
        }else{
            res.json({
                msg:"start worked",
                insertId: results.insertId
            })
        }
    })
})

router.post('/stop',(req,res,next)=>{
    console.log(req.body)
    var date = req.body.date
    var timeId = req.body.timeId
    var updateQuery = 'UPDATE results SET endTime = ?,insertId = ? WHERE id = ?;';
    connection.query(updateQuery,[date,timeId,timeId],(error,results)=>{
        if(error){
            throw error
        }else{
            // res.redirect('/results?id='+results.insertId+'&address='+req.body.address+'&distance='+req.body.distance)
            res.json({
                msg:"stop worked",
                insertId: results.insertId
            })
        }
    })
})


// router.post('/mapsProcess/:currentLocation/:distance',(req,res,next)=>{
//     // var angle = req.body.angle
//     // var insertQuery = 
//     var currentLocation = req.params.currentLocation
//     var distance = req.params.distance
//     var userid = req.session.uid
//     var selectQuery = ' SELECT currentLocation,distance FROM routes WHERE userid = ?;';
//     connection.query(selectQuery, [userid], (error, results) => {
//         if(error){
//             throw error
//         }else{
//             res.render('onemap',{
//                 address: currentLocation,
//                 distance: distance
//             })
//     }
    
//     })
// })


module.exports = router;