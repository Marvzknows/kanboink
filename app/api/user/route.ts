import { getUserFromRequest } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const [total, users] = await prisma.$transaction([
      // Count
      prisma.user.count({
        where: {
          ...(search
            ? {
                first_name: {
                  contains: search,
                },
              }
            : {}),
        },
      }),

      // Users
      prisma.user.findMany({
        where: {
          ...(search
            ? {
                first_name: {
                  contains: search,
                },
              }
            : {}),
        },
        select: {
          id: true,
          first_name: true,
          middle_name: true,
          last_name: true,
          email: true,
        },
        skip,
        take: limit,
        orderBy: {
          last_name: "asc",
        },
      }),
    ]);

    // formatted paginated response
    const hasNextPage = page * limit < total;
    const hasPrevPage = page > 1;

    const formattedResponse = {
      users: users,
    };

    return NextResponse.json(
      {
        success: true,
        data: formattedResponse,
        pagination: {
          total: total,
          hasNextPage,
          hasPrevPage,
          limit,
          currentPage: page,
        },
      },
      { status: 200 }
    );

    // return response
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};
