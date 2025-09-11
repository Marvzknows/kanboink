import { getUserFromRequest } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
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

    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Invalid title" },
        { status: 400 }
      );
    }

    const board = await prisma.board.create({
      data: {
        title: title,
        ownerId: user.userId,
        members: {
          connect: { id: user.userId },
        },
      },
      include: {
        members: {
          select: {
            id: true,
            first_name: true,
            middle_name: true,
            last_name: true,
            email: true,
          },
        },
        owner: {
          select: {
            id: true,
            first_name: true,
            middle_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });

    const createResponse = {
      ...board,
      members: board.members.map((member) => ({
        ...member,
        full_name: [member.first_name, member.middle_name, member.last_name]
          .filter(Boolean)
          .join(" "),
      })),
      owner: {
        ...board.owner,
        full_name: [
          board.owner.first_name,
          board.owner.middle_name,
          board.owner.last_name,
        ]
          .filter(Boolean)
          .join(" "),
      },
    };

    return NextResponse.json(
      { success: true, data: createResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Params
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const [total, board] = await prisma.$transaction([
      // Count
      prisma.board.count({
        where: {
          ownerId: user.userId,
          ...(search
            ? {
                title: {
                  contains: search,
                },
              }
            : {}),
        },
      }),

      // Paginated findmany
      prisma.board.findMany({
        where: {
          ownerId: user.userId,
          ...(search
            ? {
                title: {
                  contains: search,
                },
              }
            : {}),
        },
        include: {
          owner: {
            select: {
              id: true,
              first_name: true,
              middle_name: true,
              last_name: true,
              email: true,
            },
          },
          members: {
            select: {
              id: true,
              first_name: true,
              middle_name: true,
              last_name: true,
              email: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    // formatted response
    const hasNextPage = page * limit < total;
    const hasPrevPage = page > 1;

    const formattedResponse = {
      board: board,
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
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};
