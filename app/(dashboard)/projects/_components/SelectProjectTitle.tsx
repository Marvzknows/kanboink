import { ActiveBoardT } from "@/app/(auth)/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BoardsT } from "@/utils/types";

type Props = {
  projectBoardTitle: string;
  boards: BoardsT[];
  ownerId: string;
  handleOnSelect: (
    activeBoard: ActiveBoardT
  ) => Promise<string | number | undefined>;
  isLoading: boolean;
};

const SelectProjectTitle = ({
  projectBoardTitle,
  boards,
  ownerId,
  handleOnSelect,
  isLoading,
}: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={isLoading}
          variant="outline"
          className="font-bold text-2xl whitespace-nowrap w-max"
        >
          {isLoading ? "...." : projectBoardTitle}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel className="font-bold">
          Select Board
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {boards.length === 0 ? (
            <p>No Boards</p>
          ) : (
            boards.map((board) => (
              <DropdownMenuItem
                onClick={() =>
                  handleOnSelect({
                    id: board.id,
                    title: board.title,
                    ownerId: board.ownerId,
                  })
                }
                key={board.id}
              >
                {board.title}
                {ownerId === board.ownerId && (
                  <DropdownMenuShortcut>Owner</DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SelectProjectTitle;
