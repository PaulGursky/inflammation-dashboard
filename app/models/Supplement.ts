import mongoose, { Schema, Document } from "mongoose";

export interface ISupplement extends Document {
  title: string;
  image: string;
  link: string;
  subTitle: string;
  v: number;
}

const SupplementSchema: Schema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, required: true },
  subTitle: { type: String, required: true },
  __v: { type: Number, required: true },
});

export const Supplement =
  mongoose.models.Supplement || mongoose.model<ISupplement>("Supplement", SupplementSchema);
