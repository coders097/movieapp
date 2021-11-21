import express from "express";
const router = express.Router();
import User from "../models/User";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const saltRounds = 14;
const jwt_key = "dam0c2cab24w0x70hyhu29jeef5yzz";
import jwtVerify from "../middlewares/jwtAuthentication";

// configuring multer
import multer from "multer";
const multerStorage = multer.memoryStorage();
const upload = multer({
  storage: multerStorage,
});
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @type  POST
// @route /auth/login
// @desc  for login user
// @access PUBLIC
router.post("/login", async (req, res) => {
  const { password, email } = req.body;
  if (!email || !password) {
    res.status(401).json({ success: false, error: "Invalid Details" });
    return;
  }
  let userMatch = await User.findOne({ email: email });
  if (userMatch) {
    let submittedPass = password;
    let savedPass = userMatch.password;
    const comparePassword = bcrypt.compareSync(submittedPass, savedPass);
    if (comparePassword === true) {
      let timeInMinutes = 120;
      let expires = Math.floor(Date.now() / 1000) + 60 * timeInMinutes;
      let token = jwt.sign(
        {
          name: userMatch.name,
          _id: userMatch._id,
          exp: expires,
        },
        jwt_key
      );
      res.status(200).send({
        success: true,
        data: {
          _id: userMatch._id,
          name: userMatch.name,
          email: userMatch.email,
          pic: userMatch.pic,
          token: token,
        },
      });
    } else {
      res.status(401).send({
        success: false,
        error: "Invalid Password!",
      });
    }
  } else {
    res.status(401).send({
      success: false,
      error: "Invalid Credentials!",
    });
  }
});

// @type  POST
// @route /auth/signup
// @desc  for registering user
// @access PUBLIC
router.post("/signup", upload.any(), async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    res.status(401).json({ success: false, error: "Invalid Details" });
    return;
  }
  let userMatch = await User.findOne({ email: email });
  if (userMatch) {
    res.status(401).send({
      success: false,
      error: "Email present!",
    });
  } else {
    const temp_password = bcrypt.hashSync(password, saltRounds);
    let pic_name = `${name}_${Date.now()}.jpg`;
    let pic_present = false;
    if (req.files[0]) {
      fs.writeFileSync(
        path.join(__dirname, "../storage/", pic_name),
        req.files[0].buffer
      );
      pic_present = true;
    } else pic_name = "avatar.jpg";

    const new_user = new User({
      name: name,
      email: email,
      password: temp_password,
      pic: pic_name,
    });
    new_user.save((err, user) => {
      if (err) {
        console.log(err);
        if (pic_present) {
          try {
            fs.unlinkSync(path.join(__dirname, "../storage/", pic_name));
          } catch (e) {}
        }
        res.status(400).send({
          success: false,
          error: "Service Temporary Unavalable!",
        });
      } else {
        res.status(200).json({
          success: true,
        });
      }
    });
  }
});

// @type  GET
// @route /auth/accountPic
// @desc  for getting user's profile picture
// @access PUBLIC

router.get("/accountPic/:pic", (req, res) => {
  let stream = fs.createReadStream(
    path.join(__dirname, "../storage/", req.params.pic)
  );
  stream.on("error", () => {
    res.status(404).send();
  });
  stream.on("ready", () => {
    stream.pipe(res);
  });
});

// @type  POST
// @route /auth/checkValidity
// @desc  for checking user's validity
// @access PRIVATE
router.post("/checkValidity", jwtVerify, (req, res) => {
  res.status(200).json({
    success: true,
  });
});

// @type  POST
// @route /auth/editProfile
// @desc  for editing user's profile
// @access PRIVATE
router.post("/editProfile", upload.any(), async (req, res) => {
  jwtVerify(req, res, () => {
    console.log("Verified!");
    let { id, name, email, password } = req.body;
    User.findById(id)
      .then((user) => {
        let oldPic = user.pic;
        let newPic = oldPic;
        if (req.files.length != 0) {
          newPic = `${user.name}_${Date.now()}.jpg`;
          fs.writeFileSync(
            path.join(__dirname, "../storage/", newPic),
            req.files[0].buffer
          );
          user.pic = newPic;
        }
        if (name) {
          user.name = name;
        }
        if (email) {
          user.email = email;
        }
        if (password) {
          const temp_password = bcrypt.hashSync(password, saltRounds);
          user.password = temp_password;
        }
        user
          .save()
          .then(() => {
            res.status(200).json({
              success: true,
              data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
              },
            });
            if (oldPic !== newPic) {
              if (oldPic !== "avatar.jpg") {
                try {
                  fs.unlinkSync(path.join(__dirname, "../storage/", oldPic));
                } catch (E) {
                  console.log("ADMIN PROBLEM 4002:", oldPic);
                }
              }
            }
          })
          .catch(() => {
            res.status(401).json({
              success: false,
              error: "SERVER PROBLEM!",
            });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(401).json({
          success: false,
          error: "INVALID USER ID!",
        });
      });
  });
});

// @type  POST
// @route /auth/deleteProfile
// @desc  for deleting user's profile
// @access PRIVATE
router.post("/deleteProfile", jwtVerify, async (req, res) => {
  let { id } = req.body;
  User.findByIdAndDelete(id)
    .then((user) => {
      res.status(200).json({
        success: true,
      });
      try {
        if (user.pic !== "avatar.jpg")
          fs.unlinkSync(path.join(__dirname, "../storage/", user.pic));
      } catch (E) {
        console.log("ADMIN PROBLEM 4002:", oldPic);
      }
    })
    .catch((err) => {
      res.status(401).json({
        success: false,
        error: "SERVER PROBLEM!",
      });
    });
});

export default router;
