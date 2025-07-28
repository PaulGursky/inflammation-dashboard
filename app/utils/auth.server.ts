import jwt from 'jsonwebtoken';

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Adjust to specific origin if needed
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const verifyToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized access.");
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    // {
    //   id: '676565b5ece92a43710fd0f8',
    //   email: 'abdulrehmanali82@gmail.com',
    //   iat: 1735220187,
    //   exp: 1735223787
    // }
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token.");
  }
};