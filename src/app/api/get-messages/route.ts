import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }


  const userId = new mongoose.Types.ObjectId((session.user as any)._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]).exec();

    if (!user || user.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, messages: user[0].messages },
      { status: 200 }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}