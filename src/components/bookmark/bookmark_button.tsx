import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "../../utils/api";
import { Bookmark } from "lucide-react";
import { Button } from "../ui/button";

interface BookmarkButtonProps {
  playId: string;
  bookmarkCount: number;
}

export const BookmarkButton = ({
  playId,
  bookmarkCount,
}: BookmarkButtonProps) => {
  const { data: session } = useSession();

  const [isBookmarked, setIsBookmarked] = useState(bookmarkCount > 0);

  const createBookmark = api.bookmark.create.useMutation({
    onSuccess: () => setIsBookmarked(!isBookmarked),
  });
  const deleteBookmark = api.bookmark.delete.useMutation({
    onSuccess: () => setIsBookmarked(!isBookmarked),
  });

  return (
    <>
      {isBookmarked ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteBookmark.mutate(playId)}
        >
          <Bookmark fill="yellow" size={16} />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => session && createBookmark.mutate(playId)}
        >
          <Bookmark size={16} />
        </Button>
      )}
    </>
  );
};
