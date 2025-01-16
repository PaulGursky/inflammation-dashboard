import { json } from "@remix-run/node";
import { connectToDatabase } from "./../utils/db.server";
import { User } from "./../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const action = async ({ request }) => {
  await connectToDatabase();

  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "default_secret", // Use a secure secret in production
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    return json({
      success: true,
      message: "Login successful.",
      results: {
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error processing login:", error);
    return json(
      { success: false, message: "An error occurred during login." },
      { status: 500 }
    );
  }
};
