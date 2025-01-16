import mongoose, { Schema, Document } from "mongoose";

export interface IMeal extends Document {
  date: Date;
  type: string;
  recipe: string; // Reference to a Recipe ID or details
  createdBy: string; // User ID for authentication linkage
}

const MealSchema: Schema = new Schema({
  date: { type: Date, required: true },
  type: { type: String, required: true, enum: ["breakfast", "lunch", "dinner", "snack"] },
  recipe: { type: String, required: true },
  createdBy: { type: String, required: true },
});

export const Meal = mongoose.models.Meal || mongoose.model<IMeal>("Meal", MealSchema);
