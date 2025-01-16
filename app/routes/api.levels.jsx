import { json } from "@remix-run/node";
import HomeLevel from "../models/HomeLevel";
import { connectToDatabase } from '../utils/db.server'
import { corsHeaders, verifyToken } from '../utils/auth.server';

export const loader = async ({ request }) => {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return json(
        { success: false, message: "Authorization token is required" },
        { status: 401 }
      );
    }

    // Verify JWT token
    const decoded = verifyToken(authHeader);

    // Fetch the home level data for the user
    await connectToDatabase();
    const levelsData = await HomeLevel.findOne({ userId: decoded.id });

    if (!levelsData) {
      return json(
        { success: false, message: "User levels data not found" },
        { status: 404, headers:corsHeaders }
      );
    }

    return json({
      success: true,
      results: {
        level: levelsData.level,
        points: levelsData.points,
        goal: levelsData.goal,
        meal: levelsData.meal,
        referrals: levelsData.referrals,
      },
    }, {headers:corsHeaders});
  } catch (error) {
    console.error("Error fetching levels:", error.message);
    return json(
      { success: false, message: "An error occurred" },
      { status: 500, headers:corsHeaders }
    );
  }
};
