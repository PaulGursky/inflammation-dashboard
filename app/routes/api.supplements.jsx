import { json } from "@remix-run/node";
import { connectToDatabase } from "../utils/db.server";
import { Supplement } from "../models/Supplement";
import { corsHeaders, verifyToken } from '~/utils/auth.server';

export const action = async ({ request }) => {
  await connectToDatabase();

  if (request.method !== "POST") {
    return json(
      { success: false, message: "Method not allowed." },
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    const authHeader = request.headers.get("Authorization");
    const user = verifyToken(authHeader);

    if (!user) {
      return json(
        { success: false, message: "Unauthorized or invalid token." },
        { status: 403, headers: corsHeaders }
      );
    }

    const body = await request.json();
    const { title, image, link, subTitle, __v } = body;

    if (!title || !image || !link || !subTitle || typeof __v !== "number") {
      return json(
        { success: false, message: "Missing required fields." },
        { status: 400, headers: corsHeaders }
      );
    }

    const newSupplement = new Supplement({
      title,
      image,
      link,
      subTitle,
      __v,
    });

    await newSupplement.save();

    return json(
      { success: true, message: "Supplement created successfully.", id: newSupplement._id },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error creating supplement:", error);
    return json(
      { success: false, message: "Internal server error." },
      { status: 500, headers: corsHeaders }
    );
  }
};

export const loader = async ({ request }) => {
  await connectToDatabase();

  try {
    const authHeader = request.headers.get("Authorization");
    // Verify the JWT Token
    const user = verifyToken(authHeader);
    if (!user) {
      return json(
        { success: false, message: "Invalid or expired token." },
        { status: 403, headers:corsHeaders }
      );
    }

    // Fetch supplements from the database
    const supplements = await Supplement.find();

    return json({
      success: true,
      results: supplements.map((supplement) => ({
        id: supplement._id,
        title: supplement.title,
        image: supplement.image,
        link: supplement.link,
        subTitle: supplement.subTitle,
        v: supplement.__v,
      })),
    }, {headers:corsHeaders});
  } catch (error) {
    console.error("Error fetching supplements:", error);
    return json(
      { success: false, message: "An error occurred while fetching supplements." },
      { status: 500, headers:corsHeaders }
    );
  }
};
