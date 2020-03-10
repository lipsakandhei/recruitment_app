var Cryptr = require('cryptr');
var express=require("express");
var connection = require('./../config');
const php_password = require('node-php-password');
// cryptr = new Cryptr('myTotalySecretKey');

 
module.exports.register=async function(req,res){
    var today = new Date();
    var encryptedString = cryptr.encrypt(req.body.password);
    //validate if the email not is already there in the db.
   
    let isValidEmailSQL = await connection.query('SELECT email FROM recruitment_app.users WHERE email = ?;', req.body.email,function (error, results, fields) {
      if (error) {
        return res.status(500).json({
            status:'failure',
            message:'Something went wrong!'
        })
      } else {
          if(results.length) {
            return res.status(200).json({
              status : 'failure',
              message : 'Sorry, the email id already exists!'
            });
          }

           var users={
              "first_name":req.body.first_name,
              "last_name" : req.body.last_name,
              "email":req.body.email,
              "password":php_password.hash(req.body.password),
              "employee_or_employer" : (req.body.is_employee == true ? 1 : 2),
              "age" : req.body.age
          }
          connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
            if (error) {
              res.status(500).json({
                  status:'failure',
                  message:'Something went wrong!'
              })
            }else{
                res.status(200).json({
                  status:'success',
                  message:'user registered sucessfully'
              })
            }
          });
      }
    })


   
}
