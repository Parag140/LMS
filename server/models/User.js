import express from "express";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  enrollesCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
},{timeStamps: true});

const User = mongoose.model("User", userSchema);

export default User;
