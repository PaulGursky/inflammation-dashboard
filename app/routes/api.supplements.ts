import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { connectToDatabase } from "./../utils/db.server";
import { Supplement } from "./../models/Supplement";
import { corsHeaders, verifyToken } from '~/utils/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
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
