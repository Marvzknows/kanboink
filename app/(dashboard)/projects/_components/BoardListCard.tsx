import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

type BoardListCardProps = {
  title: string;
  createdAt: string;
};

const BoardListCard = ({ title, createdAt }: BoardListCardProps) => {
  return (
    <Card className="shadow-sm rounded">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        Created: {format(createdAt, "MMM dd, yyyy")}
      </CardContent>
    </Card>
  );
};

export default BoardListCard;
