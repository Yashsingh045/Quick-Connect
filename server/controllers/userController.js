import dotenv from "dotenv"
import prisma from "../config/config.js"
import bcrypt from "bcryptjs";



// register user

export const createUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const usernameLower = username.trim().toLowerCase();
    const emailLower = email.trim()?.toLowerCase();

    const findUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (findUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user

    const newUser = await prisma.user.create({
      data: {
        username: usernameLower,
        email: emailLower,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

// login

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password both are required"
      });
    }

    const emailLower = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: emailLower,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }


    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: userWithoutPassword
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }

}