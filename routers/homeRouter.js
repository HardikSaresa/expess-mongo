const express = require("express");
const Router = express.Router();
const homeSchema = require("../model/homeSchema");
Router.get("/", (err, res) => {
  res.render("register", { title: "" });
});
Router.get("/forgot", (err, res) => {
  res.render("forgot");
});

//signup
Router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await homeSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = new homeSchema({ name, email, password: hashedPassword });

    await userData.save();
    res.render("register", { title: "thank you!! please login to continue" });
  } catch (error) {
    console.log(error);
  }
});

//signin

Router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await homeSchema.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      console.log("Login successful");
      res.send("Login successful");
    } else {
      console.log("Invalid password");
      res.status(401).send("Invalid password");
    }
  } catch (error) {
    console.log("Error finding user:", error);
    res.status(500).send("Error finding user");
  }
});
//FOGOT
const bcrypt = require("bcrypt");
const saltRounds = 10;

Router.post("/hash", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await homeSchema.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update the user's password
    existingUser.password = hashedPassword;

    await existingUser.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = Router;
