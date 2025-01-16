import { json } from "@remix-run/node";
import { connectToDatabase } from "../utils/db.server";
import { Flare } from "../models/Flare";
import { corsHeaders, verifyToken } from '../utils/auth.server'

// Loader Function: Fetch flares with JWT verification
export const loader = async ({ request }) => {
  await connectToDatabase();

  try {
    const url = new URL(request.url);
    const searchDate = url.searchParams.get("date");
    const authHeader = request.headers.get("Authorization");

    // Verify token
    verifyToken(authHeader);

    // Query database
    let flares;
    if (searchDate) {
      const date = new Date(searchDate);
      flares = await Flare.find({ date: { $gte: date } }).exec();
    } else {
      flares = await Flare.find({}).exec();
    }

    return json({
      success: true,
      results: flares.map((flare) => ({
        id: flare._id,
        date: flare.date,
        sovereignty: flare.sovereignty,
        notes: flare.notes,
      })),
    }, {headers:corsHeaders});
  } catch (error) {
    console.error("Error in loader:", error.message);
    return json(
      { success: false, message: error.message || "An error occurred." },
      { status: error.message === "Unauthorized access." ? 401 : 500, headers:corsHeaders }
    );
  }
};

export const action = async ({ request }) => {
  await connectToDatabase();

  try {
    const authHeader = request.headers.get("Authorization");

    // Verify JWT token
    const decoded = verifyToken(authHeader);

    // Parse the request body
    const body = await request.json();
    const { date, sovereignty, notes } = body;

    // Validate required fields
    if (!date || !sovereignty) {
      return json(
        { success: false, message: "Date and sovereignty are required." },
        { status: 400, headers:corsHeaders }
      );
    }

    // Create and save the flare
    const flare = new Flare({
      date: new Date(date),
      sovereignty,
      notes: notes || "",
      createdBy: decoded.id, // Link flare to user from decoded token
    });
    await flare.save();

    return json({
      success: true,
      message: "Flare set successfully.",
      flare: {
        id: flare._id,
        date: flare.date,
        sovereignty: flare.sovereignty,
        notes: flare.notes,
      },
    }, {headers:corsHeaders});
  } catch (error) {
    console.error("Error in setFlare action:", error.message);
    return json(
      { success: false, message: error.message || "An error occurred." },
      { status: error.message === "Unauthorized access." ? 401 : 500, headers:corsHeaders }
    );
  }
};
