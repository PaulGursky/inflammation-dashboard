import { connectToDatabase } from '../utils/db.server'
import { json } from '@remix-run/node';
import Recipe from "./../models/Recipe";
import { corsHeaders, verifyToken } from '../utils/auth.server';

export const action = async ({ request }) => {
  await connectToDatabase();

  try {
    const authHeader = request.headers.get("Authorization");
    verifyToken(authHeader);

    if (request.method === "POST") {
      const formData = await request.json();
      const {
        name,
        ingredients,
        preparationSteps,
        createdBy,
        price,
        image,
      } = formData;

      // Validate the input data
      if (!name || !price || !image || !createdBy?.name || !createdBy?.email) {
        throw new Error("Missing required fields.");
      }

      // Create a new recipe
      const newRecipe = new Recipe({
        name,
        ingredients,
        preparationSteps,
        createdBy,
        price,
        image,
      });

      const recipe = await newRecipe.save();

      return json({ success: true, recipe, message: "Recipe created successfully." });
    }

  } catch (error) {
    console.error("Error:", error.message);
    return json(
      { success: false, message: error.message || "An error occurred." },
      { status: error.message === "Unauthorized access." ? 401 : 500, headers:corsHeaders }
    );
  }
};

export async function loader() {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Fetch recipes from the Recipe model
    const recipes = await Recipe.find();

    // Return success response with the recipes
    return json({ success: true, results: recipes });
  } catch (error) {
    console.error("Error in /api/recipes:", error);
    return json({ success: false, message: "Failed to fetch recipes" }, { status: 500 });
  }
}