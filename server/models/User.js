import express from "express";

const userSchema = new mongoose.Schems({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  enrollesCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
},{timeStamps: true});

const User = mongoose.model("User", userSchema);

export default User;
