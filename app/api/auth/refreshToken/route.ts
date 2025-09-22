import { NextResponse } from "next/server";
import { refreshAccessToken } from "@/app/actions/auth/authActions";

export async function POST() {
  const result = await refreshAccessToken();

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true, user: result.user });
}
