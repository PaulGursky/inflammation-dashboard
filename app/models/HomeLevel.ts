import { Schema, model } from "mongoose";

// Define the Level Schema
const LevelSchema = new Schema({
  current: { type: Number, default: 0 },
  next: { type: Number, default: 0 },
  needed: { type: Number, default: 0 },
});

// Define the Referrals Schema
const ReferralsSchema = new Schema({
  used: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
});

// Define the HomeLevel Schema
const HomeLevelSchema = new Schema({
  level: { type: LevelSchema, required: true },
  points: { type: String, default: "0" },
  goal: { type: String, default: "0" },
  meal: { type: String, default: "0" },
  referrals: { type: ReferralsSchema, required: false },
});

// Create and export the model
const HomeLevel = model("HomeLevel", HomeLevelSchema);
export default HomeLevel;
