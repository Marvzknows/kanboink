"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { AddNewTaskDialog } from "./_components/AddNewTaskDialog";
import { AddNewProjectDialog } from "./_components/AddNewProjectDialog";
import { AddNewListDialog } from "./_components/AddNewListDialog";
import { useContext, useState } from "react";
import { useBoards } from "./hooks";
import { AxiosErrorType, handleApiError } from "@/app/axios/axios-error";
import { toast } from "sonner";
import { AddMembersDialog } from "./_components/AddMembersDialog";
import SelectProjectTitle from "./_components/SelectProjectTitle";
import { AuthContext } from "@/context/AuthContext";
import { ActiveBoardT } from "@/app/(auth)/types";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectsPage = () => {
  const { user, activeBoard, setUserActiveBoard } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [openProject, setOpenProject] = useState(false);
  const [openMember, setOpenMember] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [listTitle, setListTitle] = useState("");

  const {
    createBoardMutation,
    userBoardList,
    setUserActiveBoardMutation,
    createBoardListMutation,
    userProjectBaordData,
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

  const handleTaskAdd = (task: {
    title: string;
    description?: string;
    listName: string;
  }) => {
    // Handle adding the task to your data source, this would be a server action or API call
    console.log("Adding task:", task);
  };

  const { data: userProjectBoardData, isLoading: isLoadingUserProjetBoard } =
    userProjectBaordData(String(activeBoard?.id), !!activeBoard?.id);

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
              userProjectBoardData?.data.board.lists.map((list) => (
                <div
                  key={list.id}
                  className="min-w-[280px] max-w-[280px] flex-shrink-0 flex flex-col gap-2 p-2.5 rounded shadow border bg-secondary"
                >
                  <h3 className="font-semibold text-lg mb-2">{list.title}</h3>
                  <div className="flex flex-col gap-2 overflow-y-auto">
                    {list.cards.map((card) => (
                      <Card key={card.id} className="shadow-sm rounded">
                        <CardHeader>
                          <CardTitle className="text-base">
                            {card.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">
                          Created: {format(card.createdAt, "MMM dd, yyyy")}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
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
