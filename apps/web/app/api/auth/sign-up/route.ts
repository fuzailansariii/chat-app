import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password } = await req.json();
    if (!fullName || !email || !password) {
      return NextResponse.json(
        {
          message: "All fields are required",
          success: false,
        },
        { status: 400 }
      );
    }
    const trimmedEmail = email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({
      where: {
        email: trimmedEmail,
      },
    });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email already exist",
          success: false,
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email: trimmedEmail,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,

        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Internal server error",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
