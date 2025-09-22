"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type BoardListProps = {
  titile: string;
  children: React.ReactNode;
  listId: string;
};

const BoardList = ({ titile, children, listId }: BoardListProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: listId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="min-w-[280px] max-w-[280px] flex-shrink-0 flex flex-col gap-2 p-2.5 rounded shadow border bg-secondary"
    >
      <h3 className="font-semibold text-lg mb-2">{titile}</h3>
      <div className="flex flex-col gap-2 overflow-y-auto">
        {/* Cards */}
        {children}
      </div>
    </div>
  );
};

export default BoardList;
