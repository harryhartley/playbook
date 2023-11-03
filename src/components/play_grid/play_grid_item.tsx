/* eslint-disable @next/next/no-img-element */
import { Prisma } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { formatTimeAgo } from "~/utils/formatTimeAgo";
import { Button } from "../ui/button";
import { Check, Trash } from "lucide-react";
import { api } from "~/utils/api";
import { PlayForm } from "../play_form/play_form";
import { useSession } from "next-auth/react";
import { isUserModeratorOrAbove } from "~/utils/auth";
import { BookmarkButton } from "../bookmark/bookmark_button";
import { StarButton } from "../star/star_button";

const playWithUserAndBookmarks = Prisma.validator<Prisma.PlayDefaultArgs>()({
  include: {
    user: { select: { id: true, name: true, image: true } },
    _count: { select: { bookmarks: true, stars: true } },
  },
});

type PlayGridItemProps = Prisma.PlayGetPayload<typeof playWithUserAndBookmarks>;

const VIEW_FORMATTER = new Intl.NumberFormat(undefined, {
  notation: "compact",
});

export function PlayGridItem({
  id,
  name,
  description,
  user,
  createdAt,
  thumbnailUrl,
  videoUrl,
  character,
  type,
  speed,
  environment,
  stage,
  difficulty,
  approved,
  _count,
}: PlayGridItemProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const queries = api.useContext();
  const { data: session } = useSession();

  // const createBookmark = api.bookmark.create.useMutation();
  // const deleteBookmark = api.bookmark.delete.useMutation();
  // const createStar = api.star.create.useMutation();
  // const deleteStar = api.star.delete.useMutation();

  const approvePlay = api.play.approveById.useMutation({
    onSuccess: () => queries.play.invalidate(),
  });
  const unapprovePlay = api.play.unapproveById.useMutation({
    onSuccess: () => queries.play.invalidate(),
  });
  const archivePlay = api.play.archiveById.useMutation({
    onSuccess: () => queries.play.invalidate(),
  });

  useEffect(() => {
    if (videoRef.current == null) return;

    if (isVideoPlaying) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.error);
    } else {
      videoRef.current.pause();
    }
  }, [isVideoPlaying]);

  return (
    <div
      className="flex flex-col gap-2"
      onMouseEnter={() => setIsVideoPlaying(true)}
      onMouseLeave={() => setIsVideoPlaying(false)}
    >
      <a href={`/play/${id}`} className="relative aspect-video">
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt="Play Thumbnail"
            className={`block h-full w-full rounded-xl object-cover transition-[border-radius] duration-200`}
          />
        )}
        {/* <div className="bg-secondary-dark absolute bottom-1 right-1 rounded px-0.5 text-sm text-secondary">
          {formatDuration(378)}
        </div> */}
        <video
          className={`absolute inset-0 block h-full rounded-xl object-cover transition-opacity duration-200 ${
            isVideoPlaying || !thumbnailUrl
              ? "opacity-100 delay-200"
              : "opacity-0"
          }`}
          ref={videoRef}
          muted
          playsInline
          src={videoUrl}
        />
      </a>
      <div className="flex gap-2">
        <a
          href={`/user/${user.id}`}
          className="flex flex-shrink-0 items-center"
        >
          <img
            className="h-12 w-12 rounded-full"
            src={user.image ?? ""}
            alt="User Profile Picture"
          />
        </a>
        <div className="flex flex-col">
          <a href={`/play/${id}`} className="font-bold">
            {name}
          </a>
          <a href={`/play/${user.id}`} className="text-sm">
            {character} • {type}
          </a>
          <a href={`/play/${user.id}`} className="text-sm">
            {VIEW_FORMATTER.format(_count.stars)} Stars •{" "}
            {formatTimeAgo(createdAt)}
          </a>
        </div>
      </div>
      <div className="flex justify-center">
        <BookmarkButton playId={id} bookmarkCount={_count.bookmarks} />
        <StarButton playId={id} starCount={_count.stars} />
        {session && isUserModeratorOrAbove(session?.user.role) && (
          <PlayForm
            id={id}
            name={name}
            description={description ?? ""}
            videoUrl={videoUrl}
            thumbnailUrl={thumbnailUrl ?? ""}
            type={type}
            speed={speed}
            character={character}
            environment={environment}
            stage={stage}
            difficulty={difficulty.toString()}
          />
        )}
        {!approved && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => approvePlay.mutate(id)}
          >
            <Check color="green" size={16} />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            approved ? unapprovePlay.mutate(id) : archivePlay.mutate(id)
          }
        >
          <Trash color="red" size={16} />
        </Button>
      </div>
    </div>
  );
}
