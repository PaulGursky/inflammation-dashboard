import { connectToDatabase } from '../utils/db.server'
import { json } from '@remix-run/node';
import { verifyToken } from '../utils/auth.server'
import Recipe from '../models/Recipe'

export const loader = async ({ request }) => {
  await connectToDatabase();

  try {
    const authHeader = request.headers.get("Authorization");

    // Verify JWT token and decode user ID
    const decoded = verifyToken(authHeader);

    // Fetch recipes created by the user (or you can adapt this based on your needs)
    const recipes = await Recipe.find({ "createdBy.id": decoded.id });  // Assuming 'createdBy.id' is the user ID field

    // Map over recipes to extract relevant fields
    return json({
      success: true,
      results: recipes.map((recipe) => ({
        id: recipe._id,
        name: recipe.name,
        ingredients: recipe.ingredients.map((ingredient) => ({
          id: ingredient.id,
          name: ingredient.ingredient.name,
          category: ingredient.ingredient.category,
          quantity: ingredient.quantity,
        })),
        createdBy: {
          id: recipe.createdBy.id,
          name: recipe.createdBy.name,
          email: recipe.createdBy.email,
        },
        preparationSteps: recipe.preparationSteps.map((step) => ({
          id: step.id,
          title: step.title,
          points: step.points,
        })),
        price: recipe.price,
        image: recipe.image,
        createdAt: recipe.createdAt,
        updatedAt: recipe.updatedAt,
        v: recipe.__v,
      })),
    });
  } catch (error) {
    console.error("Error fetching purchased recipes:", error.message);
    return json(
      { success: false, message: error.message || "An error occurred." },
      { status: error.message === "Unauthorized access." ? 401 : 500 }
    );
  }
};