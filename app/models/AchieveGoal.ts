import mongoose, { Schema, Document } from "mongoose";

export interface IAchieveGoal extends Document {
  title: string;
  description: string;
  dateAchieved: Date;
}

const AchieveGoalSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  dateAchieved: { type: Date, required: true },
});

export const AchieveGoal =
  mongoose.models.AchieveGoal ||
  mongoose.model<IAchieveGoal>("AchieveGoal", AchieveGoalSchema);
