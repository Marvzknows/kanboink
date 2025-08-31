"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

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
  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h2 className="font-bold text-2xl">Project Name</h2>
        <Button variant="secondary">Add New Task</Button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 min-h-0">
        <div className="flex gap-4 overflow-x-auto h-full pb-2">
          {mockData.map((list) => (
            <div
              key={list.list_name}
              className="min-w-[280px] max-w-[280px] flex-shrink-0 flex flex-col gap-2 p-2.5 rounded-lg shadow border bg-secondary"
            >
              {/* Column Header */}
              <h3 className="font-semibold text-lg mb-2">{list.list_name}</h3>

              {/* Cards */}
              <div className="flex flex-col gap-2 overflow-y-auto">
                {list.card.map((task) => (
                  <Card key={task.id} className="shadow-sm rounded-md">
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
