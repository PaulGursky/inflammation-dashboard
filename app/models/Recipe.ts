import mongoose from "mongoose";
const ingredientSubSchema = new mongoose.Schema({
  quantity: {type: String},
  ingredient: {
    name: { type: String, required: true },
    category: { type: String, required: true },  
  }
});

const preparationStepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  points: [{ type: String }],
});

const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ingredients: [
      ingredientSubSchema
    ],
    createdBy: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    preparationSteps: [preparationStepSchema],
    price: { type: Number, required: true },
    image: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);

export default Recipe;