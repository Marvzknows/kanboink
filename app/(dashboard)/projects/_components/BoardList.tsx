type BoardListProps = {
  titile: string;
  children: React.ReactNode;
};

const BoardList = ({ titile, children }: BoardListProps) => {
  return (
    <div className="min-w-[280px] max-w-[280px] flex-shrink-0 flex flex-col gap-2 p-2.5 rounded shadow border border-red-500 bg-secondary">
      <h3 className="font-semibold text-lg mb-2">{titile}</h3>
      <div className="flex flex-col gap-2 overflow-y-auto">
        {/* Cards */}
        {children}
      </div>
    </div>
  );
};

export default BoardList;
