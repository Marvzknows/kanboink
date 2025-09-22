import { getUserFromRequest } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { boardId, lists } = body;

    // Validate required fields
    if (!boardId || !Array.isArray(lists) || lists.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Validate lists array structure
    const isValidListsArray = lists.every(
      (list) => typeof list.id === "string" && typeof list.position === "number"
    );

    if (!isValidListsArray) {
      return NextResponse.json(
        { success: false, error: "Invalid lists array format" },
        { status: 400 }
      );
    }

    // Check if user owns the board
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: { ownerId: true },
    });

    if (!board || board.ownerId !== user.userId) {
      return NextResponse.json(
        { success: false, error: "Board not found or unauthorized" },
        { status: 403 }
      );
    }

    // Verify all lists belong to the board
    const listIds = lists.map((list) => list.id);
    const existingLists = await prisma.list.findMany({
      where: {
        id: { in: listIds },
        boardId: boardId,
      },
      select: { id: true },
    });

    if (existingLists.length !== listIds.length) {
      return NextResponse.json(
        { success: false, error: "Some lists don't belong to this board" },
        { status: 400 }
      );
    }

    // Use transaction to update all positions atomically
    const updatedLists = await prisma.$transaction(
      lists.map((list) =>
        prisma.list.update({
          where: { id: list.id },
          data: { position: list.position },
          select: {
            id: true,
            title: true,
            boardId: true,
            position: true,
            createdAt: true,
            updatedAt: true,
          },
        })
      )
    );

    // Log activity for board update
    await prisma.activityLog.create({
      data: {
        action: "BOARD_UPDATED",
        details: {
          action: "lists_reordered",
          listCount: lists.length,
        },
        userId: user.userId,
        boardId: boardId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: { lists: updatedLists },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating list positions:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};

// Alternative approach: Single list position update
export const PUT = async (req: NextRequest) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { listId, newPosition, boardId } = body;

    // Validate required fields
    if (!listId || typeof newPosition !== "number" || !boardId) {
      console.log(typeof newPosition);
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Check if user owns the board and list exists
    const list = await prisma.list.findUnique({
      where: { id: listId },
      include: {
        board: {
          select: { ownerId: true, id: true },
        },
      },
    });

    if (
      !list ||
      list.board.ownerId !== user.userId ||
      list.board.id !== boardId
    ) {
      return NextResponse.json(
        { success: false, error: "List not found or unauthorized" },
        { status: 403 }
      );
    }

    const currentPosition = list.position;

    // Use transaction to reorder positions
    await prisma.$transaction(async (tx) => {
      if (newPosition > currentPosition) {
        // Moving down: shift lists up
        await tx.list.updateMany({
          where: {
            boardId: boardId,
            position: {
              gt: currentPosition,
              lte: newPosition,
            },
          },
          data: {
            position: {
              decrement: 1,
            },
          },
        });
      } else if (newPosition < currentPosition) {
        // Moving up: shift lists down
        await tx.list.updateMany({
          where: {
            boardId: boardId,
            position: {
              gte: newPosition,
              lt: currentPosition,
            },
          },
          data: {
            position: {
              increment: 1,
            },
          },
        });
      }

      // Update the moved list's position
      await tx.list.update({
        where: { id: listId },
        data: { position: newPosition },
      });
    });

    // Get updated list
    const updatedList = await prisma.list.findUnique({
      where: { id: listId },
      select: {
        id: true,
        title: true,
        boardId: true,
        position: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: "BOARD_UPDATED",
        details: {
          action: "list_moved",
          listId: listId,
          oldPosition: currentPosition,
          newPosition: newPosition,
        },
        userId: user.userId,
        boardId: boardId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: { list: updatedList },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating list position:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
};
