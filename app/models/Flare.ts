import mongoose, { Schema, Document } from "mongoose";

export interface IFlare extends Document {
  notes: string;
  date: Date;
  sovereignty: string;
}

const FlareSchema: Schema = new Schema({
  notes: { type: String },
  date: { type: Date, required: true },
  sovereignty: { type: String },
});

export const Flare = mongoose.models.Flare || mongoose.model<IFlare>("Flare", FlareSchema);
