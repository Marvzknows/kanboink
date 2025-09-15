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

const mockData = [
  {
    list_name: "Pending Task",
    card: [
      { id: 1, title: "UI/UX Adjustment", createdAt: new Date() },
      { id: 2, title: "API Adjustment", createdAt: new Date() },
    ],
  },
  {
    list_name: "In Progress",
    card: [{ id: 3, title: "Form Validation", createdAt: new Date() }],
  },
  {
    list_name: "Completed",
    card: [{ id: 4, title: "Setup CI/CD", createdAt: new Date() }],
  },
  {
    list_name: "Bugs",
    card: [{ id: 5, title: "Create User Error", createdAt: new Date() }],
  },
  {
    list_name: "Ready for Deployment",
    card: [{ id: 6, title: "Final QA", createdAt: new Date() }],
  },
];

const ProjectsPage = () => {
  const { user, activeBoard, setUserActiveBoard } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [openProject, setOpenProject] = useState(false);
  const [openMember, setOpenMember] = useState(false);
  const { createBoardMutation, userBoardList, setUserActiveBoardMutation } =
    useBoards();
  const { mutateAsync: createBoardAction, isPending } = createBoardMutation;
  const {
    mutateAsync: setActiveBoardAction,
    isPending: isUpdatingActiveBoard,
  } = setUserActiveBoardMutation;
  const { data: userBoardListData } = userBoardList({
    page: 1,
    limit: 100,
  });

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

  return (
    <div className="p-4 h-full flex flex-col">
      <SelectProjectTitle
        projectBoardTitle={
          !activeBoard?.title ? "Select Project Board" : activeBoard.title
        }
        boards={userBoardListData?.data.boards || []}
        ownerId={user?.id || ""}
        handleOnSelect={handleOnSelectProjectBoard}
        isLoading={isUpdatingActiveBoard}
      />
      <div className="flex flex-row p-2 gap-2 overflow-x-auto">
        <div className="flex-1"></div>
        <div className="flex gap-2 flex-shrink-0">
          <AddMembersDialog isOpen={openMember} setIsOpen={setOpenMember} />
          <AddNewTaskDialog onTaskAdd={handleTaskAdd} />
          <AddNewProjectDialog
            isOpen={openProject}
            setIsOpen={setOpenProject}
            title={title}
            setTitle={setTitle}
            onSubmit={onSubmitProject}
            isLoading={isPending}
          />
          <AddNewListDialog />
        </div>
      </div>
      {/* Kanban Board */}
      <div className="flex-1 min-h-0">
        <div className="flex gap-1.5 overflow-x-auto h-full pb-2 border p-2.5 shadow">
          {mockData.map((list) => (
            <div
              key={list.list_name}
              className="min-w-[280px] max-w-[280px] flex-shrink-0 flex flex-col gap-2 p-2.5 rounded shadow border bg-secondary"
            >
              {/* Column Header */}
              <h3 className="font-semibold text-lg mb-2">{list.list_name}</h3>

              {/* Cards */}
              <div className="flex flex-col gap-2 overflow-y-auto">
                {list.card.map((task) => (
                  <Card key={task.id} className="shadow-sm rounded">
                    <CardHeader>
                      <CardTitle className="text-base">{task.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      Created: {format(task.createdAt, "MMM dd, yyyy")}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
