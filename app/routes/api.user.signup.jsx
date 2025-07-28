import { json } from "@remix-run/node";
import { connectToDatabase } from "./../utils/db.server";
import { User } from "./../models/User";
import bcrypt from "bcrypt";
import { corsHeaders } from '../utils/auth.server'

export const action = async ({ request }) => {
  await connectToDatabase();

  try {
    const body = await request.json();
    const { name, email, password, code } = body;

    // Validate input
    if (!name || !email || !password) {
      return json(
        { success: false, message: "Name, email, and password are required." },
        { status: 400, headers:corsHeaders }
      );
    }

    // if (!/[a-z]/.test(password)) {
    //   return json(
    //     {
    //       success: false,
    //       message: "Password must contain at least one lower case letter.",
    //     },
    //     { status: 400 }
    //   );
    // }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return json(
        { success: false, message: "User already exists." },
        { status: 400, headers:corsHeaders }
      );
    }

    // Validate referral code (if applicable)
    if (code && code !== "VALID_CODE") {
      return json(
        { success: false, message: "Invalid referral code." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      private: false,
      level: 0,
      referral: code || "",
    });
    console.log(user)
    return json(
      {
        success: true,
        message: "User created successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201, headers:corsHeaders }
    );
  } catch (error) {
    console.error("Error processing signup:", error);
    return json(
      { success: false, message: "An error occurred during signup." },
      { status: 500, headers:corsHeaders }
    );
  }
};
