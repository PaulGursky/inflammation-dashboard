import { json } from "@remix-run/node";
import { connectToDatabase } from '../utils/db.server'
import { AchieveGoal } from "../models/AchieveGoal";
import { corsHeaders, verifyToken } from '../utils/auth.server'

export const loader = async ({ request }) => {
  await connectToDatabase();

  try {
    const authHeader = request.headers.get("Authorization");

    // Verify JWT token
    verifyToken(authHeader);

    // Fetch achieved goals from the database
    const goals = await AchieveGoal.find({}).exec();

    return json({
      success: true,
      message: "Achieved goals retrieved successfully.",
      results: goals.map((goal) => ({
        id: goal._id,
        title: goal.title,
        description: goal.description,
        dateAchieved: goal.dateAchieved,
      })),
    }, {headers:corsHeaders});
  } catch (error) {
    console.error("Error fetching achieved goals:", error.message);
    return json(
      { success: false, message: error.message || "An error occurred." },
      { status: error.message === "Unauthorized access." ? 401 : 500, headers:corsHeaders }
    );
  }
};
