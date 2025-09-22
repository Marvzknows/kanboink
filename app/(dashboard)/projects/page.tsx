"use client";

import { AddNewTaskDialog } from "./_components/AddNewTaskDialog";
import { AddNewProjectDialog } from "./_components/AddNewProjectDialog";
import { AddNewListDialog } from "./_components/AddNewListDialog";
import { useContext, useEffect, useState } from "react";
import { useBoards } from "./hooks";
import { AxiosErrorType, handleApiError } from "@/app/axios/axios-error";
import { toast } from "sonner";
import { AddMembersDialog } from "./_components/AddMembersDialog";
import SelectProjectTitle from "./_components/SelectProjectTitle";
import { AuthContext } from "@/context/AuthContext";
import { ActiveBoardT } from "@/app/(auth)/types";
import { Skeleton } from "@/components/ui/skeleton";
import BoardList from "./_components/BoardList";
import BoardListCard from "./_components/BoardListCard";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { ListT } from "./_components/types";

const ProjectsPage = () => {
  const { user, activeBoard, setUserActiveBoard } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [openProject, setOpenProject] = useState(false);
  const [openMember, setOpenMember] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [listTitle, setListTitle] = useState("");

  const [lists, setLists] = useState<ListT[]>([]);

  const {
    createBoardMutation,
    userBoardList,
    setUserActiveBoardMutation,
    createBoardListMutation,
    userProjectBaordData,
    updateBoardListPosition,
  } = useBoards();

  const { mutateAsync: createBoardAction, isPending } = createBoardMutation;
  const {
    mutateAsync: setActiveBoardAction,
    isPending: isUpdatingActiveBoard,
  } = setUserActiveBoardMutation;

  const { data: userBoardListData, isLoading: isLoadingUserBoardList } =
    userBoardList({
      page: 1,
      limit: 100,
    });

  const { mutateAsync: createBoardListAction, isPending: isCreatingList } =
    createBoardListMutation;

  const { mutateAsync: updateListPositionAction } = updateBoardListPosition;

  const { data: userProjectBoardData, isLoading: isLoadingUserProjetBoard } =
    userProjectBaordData(String(activeBoard?.id), !!activeBoard?.id);

  // Sync when server data changes
  useEffect(() => {
    if (userProjectBoardData?.data.board.lists) {
      setLists(userProjectBoardData.data.board.lists);
    }
  }, [userProjectBoardData]);

  // #region Event Listener
  const handleTaskAdd = (task: {
    title: string;
    description?: string;
    listName: string;
  }) => {
    // Handle adding the task to your data source, this would be a server action or API call
    console.log("Adding task:", task);
  };

  const onSubmitProject = async () => {
    try {
      await createBoardAction(title, {
        onSuccess: () => {
          toast.success("Board created successfully!");
          setTitle("");
          setOpenProject(false);
        },
      });
    } catch (err) {
      handleApiError(err as AxiosErrorType);
    }
  };

  const handleOnSelectProjectBoard = async (activeBoard: ActiveBoardT) => {
    if (!activeBoard?.id) return toast.error("Invalid Board");
    try {
      await setActiveBoardAction(activeBoard.id, {
        onSuccess: () => {
          setUserActiveBoard(activeBoard);
          toast.success("Updated Active Board");
        },
      });
    } catch (err) {
      handleApiError(err as AxiosErrorType);
    }
  };

  const onSubmitCreateList = async () => {
    if (!activeBoard?.id) return toast.error("Invalid data");
    if (!listTitle.trim()) return toast.error("Invalid board list title");
    try {
      await createBoardListAction(
        { title: listTitle, board_id: activeBoard.id },
        {
          onSuccess: () => {
            toast.success("New list successfully added");
            setOpenList(false);
            setListTitle("");
          },
        }
      );
    } catch (error) {
      handleApiError(error as AxiosErrorType);
    }
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = lists.findIndex((l) => l.id === active.id);
    const newIndex = lists.findIndex((l) => l.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Optimistically update UI
    const newLists = arrayMove(lists, oldIndex, newIndex).map(
      (list, index) => ({
        ...list,
        position: index + 1, // ensure positions are 1-based
      })
    );
    setLists(newLists);

    try {
      await updateListPositionAction({
        listId: active.id as string,
        newPosition: newIndex + 1,
        boardId: activeBoard?.id as string,
      });
    } catch (error) {
      handleApiError(error as AxiosErrorType);

      setLists(lists);
    }
  };

  // #endregion

  return (
    <div className="p-4 h-full flex flex-col">
      <SelectProjectTitle
        projectBoardTitle={
          !activeBoard?.title ? "Select Project Board" : activeBoard.title
        }
        boards={userBoardListData?.data.boards || []}
        ownerId={user?.id || ""}
        handleOnSelect={handleOnSelectProjectBoard}
        isLoading={isUpdatingActiveBoard || isLoadingUserBoardList}
      />
      <div className="flex flex-row p-2 gap-2 overflow-x-auto">
        <div className="flex-1"></div>
        <div className="flex gap-2 flex-shrink-0">
          {user?.id === activeBoard?.ownerId && (
            <>
              <AddMembersDialog
                isOpen={openMember}
                setIsOpen={setOpenMember}
                active_board={activeBoard}
              />
              <AddNewListDialog
                isOpen={openList}
                setIsOpen={setOpenList}
                onSubmit={onSubmitCreateList}
                title={listTitle}
                setTitle={setListTitle}
                isLoading={isCreatingList}
              />
            </>
          )}
          <AddNewTaskDialog onTaskAdd={handleTaskAdd} />
          <AddNewProjectDialog
            isOpen={openProject}
            setIsOpen={setOpenProject}
            title={title}
            setTitle={setTitle}
            onSubmit={onSubmitProject}
            isLoading={isPending}
          />
        </div>
      </div>
      {/* Kanban Board */}
      <div className="flex-1 min-h-0">
        <div className="flex gap-1.5 overflow-x-auto h-full pb-2 border p-2.5 shadow">
          {activeBoard ? (
            isLoadingUserProjetBoard ? (
              <div className="flex gap-2 w-full h-full">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="flex-1 h-full rounded-xl" />
                ))}
              </div>
            ) : (
              <DndContext onDragEnd={handleDragEnd}>
                <SortableContext items={lists.map((list) => list.id)}>
                  {lists.map((list) => (
                    // List
                    <BoardList
                      key={list.id}
                      titile={list.title}
                      listId={list.id}
                    >
                      {/* Cards */}
                      {list.cards.map((card) => (
                        <BoardListCard
                          key={card.id}
                          title={card.title}
                          createdAt={card.createdAt}
                        />
                      ))}
                    </BoardList>
                  ))}
                </SortableContext>
              </DndContext>
            )
          ) : (
            <p className="m-auto">NO BOARD FOUND</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
