import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "../../utils/api";
import { Star } from "lucide-react";
import { Button } from "../ui/button";

interface StarButtonProps {
  playId: string;
  starCount: number;
}

export const StarButton = ({ playId, starCount }: StarButtonProps) => {
  const { data: session } = useSession();

  const [isStarred, setIsStarred] = useState(starCount > 0);

  const createStar = api.star.create.useMutation({
    onSuccess: () => setIsStarred(!isStarred),
  });
  const deleteStar = api.star.delete.useMutation({
    onSuccess: () => setIsStarred(!isStarred),
  });

  return (
    <>
      {isStarred ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteStar.mutate(playId)}
        >
          <Star fill="yellow" color="yellow" size={16} />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => session && createStar.mutate(playId)}
        >
          <Star size={16} />
        </Button>
      )}
    </>
  );
};
