import { getUserFromRequest } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { title } = body;

  // verify token + get user from request
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!title.trim()) {
    return NextResponse.json({
      success: false,
      error: "Invalid title",
    });
  }
};
