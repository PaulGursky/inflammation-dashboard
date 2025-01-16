import { json } from "@remix-run/node";
import { connectToDatabase } from '../utils/db.server'
import { Meal } from "../models/Meal";
import { corsHeaders, verifyToken } from '../utils/auth.server'

export const action = async ({ request }) => {
  await connectToDatabase();

  try {
    const authHeader = request.headers.get("Authorization");

    // Verify JWT token
    const decoded = verifyToken(authHeader);

    // Parse the request body
    const body = await request.json();
    const { date, meal } = body;

    // Validate required fields
    if (!date || !meal || !meal.type || !meal.recipe) {
      return json(
        { success: false, message: "Date, meal type, and recipe are required." },
        { status: 400, headers:corsHeaders }
      );
    }

    // Create and save the meal
    const newMeal = new Meal({
      date: new Date(date),
      type: meal.type.toLowerCase(),
      recipe: meal.recipe,
      createdBy: decoded.id, // Link meal to user from decoded token
    });
    await newMeal.save();

    return json({
      success: true,
      message: "Meal added successfully.",
      meal: {
        id: newMeal._id,
        date: newMeal.date,
        type: newMeal.type,
        recipe: newMeal.recipe,
      },
    }, {headers:corsHeaders});
  } catch (error) {
    console.error("Error in addMeal action:", error.message);
    return json(
      { success: false, message: error.message || "An error occurred." },
      { status: error.message === "Unauthorized access." ? 401 : 500, headers:corsHeaders }
    );
  }
};

export const loader = async ({ request }) => {
  await connectToDatabase();

  try {
    const authHeader = request.headers.get("Authorization");

    // Verify JWT token
    verifyToken(authHeader);

    // Determine if weekly or daily meals are requested
    const url = new URL(request.url);
    const isWeekly = url.searchParams.get("weekly") === "true";

    // Get the date range
    const now = new Date();
    const startDate = isWeekly
      ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      : new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const meals = await Meal.find({
      date: { $gte: startDate, $lte: now },
    }).exec();

    return json({
      success: true,
      message: `Meals for ${isWeekly ? "the last week" : "today"} retrieved successfully.`,
      results: meals.map((meal) => ({
        id: meal._id,
        date: meal.date,
        type: meal.type,
        recipe: meal.recipe,
      })),
    }, {headers:corsHeaders});
  } catch (error) {
    console.error("Error fetching meals:", error.message);
    return json(
      { success: false, message: error.message || "An error occurred." },
      { status: error.message === "Unauthorized access." ? 401 : 500, headers:corsHeaders }
    );
  }
};