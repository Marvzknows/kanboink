import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    // const body = await req.json();
    // const { first_name, middle_name, last_name, email, password } = body;
    return NextResponse.json({
      data: req.json(),
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
