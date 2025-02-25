const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://Adith:1234@cluster0.wmtyipi.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(function () {
    console.log("DB Connected");
  })
  .catch(function () {
    console.log("Failed to Connection");
  });

const credential = mongoose.model("credential", {}, "bulkmail");

//Install Nodemailer
const nodemailer = require("nodemailer");
// const { promises } = require("nodemailer/lib/xoauth2");" unwanted"

app.post("/sendemail", function (req, res) {
  var msg = req.body.msg;
  var emailList = req.body.emailList;

  credential
    .find()
    .then(function (data) {
      const transporter = nodemailer.createTransport({
        service: "gmail",

        auth: {
          user: data[0].toJSON().user,
          pass: data[0].toJSON().pass,
        },
      });

      new Promise(async function (resolve, reject) {
        try {
          for (var i = 0; i < emailList.length; i++) {
            await transporter.sendMail({
              from: "adithya649@gmail.com",
              to: emailList[i],
              subject: "A Message from BulMail App",
              text: msg,
            });
            console.log("Email sent to :" + emailList[i]);
          }
          resolve("Success");
        } catch (error) {
          reject("Failed");
        }
      })
        .then(function () {
          res.send(true);
        })
        .catch(function () {
          res.send(false);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.listen(5000, function () {
  console.log("Server Started.....");
});
