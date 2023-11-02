/* eslint-disable @next/next/no-img-element */
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Home,
  ListVideo,
  Plus,
  Star,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Children, useState, type ElementType, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "~/components/ui/button";
import { useSidebarContext } from "~/contexts/SidebarContext";
import { HeaderFirstSection } from "../header/first_section";
import { useRouter } from "next/router";

// const subscriptions = [
//   {
//     channelName: "Fireship",
//     id: "Fireship",
//     imgUrl:
//       "https://yt3.googleusercontent.com/ytc/APkrFKb--NH6RwAGHYsD3KfxX-SAgWgIHrjR5E4Jb5SDSQ=s176-c-k-c0x00ffffff-no-rj",
//   },
//   {
//     channelName: "Caleb Curry",
//     id: "CalebCurry",
//     imgUrl:
//       "https://yt3.googleusercontent.com/ytc/APkrFKbpSojje_-tkBQecNtFuPdSCrg3ZT0FhaYjln9k0g=s176-c-k-c0x00ffffff-no-rj",
//   },
//   {
//     channelName: "Web Dev Simplified",
//     id: "WebDevSimplified",
//     imgUrl:
//       "https://yt3.ggpht.com/ytc/APkrFKZWeMCsx4Q9e_Hm6nhOOUQ3fv96QGUXiMr1-pPP=s48-c-k-c0x00ffffff-no-rj",
//   },
//   {
//     channelName: "Kevin Powell",
//     id: "KevinPowell",
//     imgUrl:
//       "https://yt3.ggpht.com/ytc/APkrFKa6XiLa13mMVPzkmmTBcgNPjjqCGPrY86KfJFmf5w=s48-c-k-c0x00ffffff-no-rj",
//   },
//   {
//     channelName: "Sonny Sangha",
//     id: "SonnySangha",
//     imgUrl:
//       "https://yt3.ggpht.com/FjeN785fVWx0Pr6xCbwPhhq8hHj_gocc3FygDXYDEQgp2gE_FQzRNsFHFAjQ3oE-VJaeGR1a=s68-c-k-c0x00ffffff-no-rj",
//   },
//   {
//     channelName: "Traversy Media",
//     id: "TraversyMedia",
//     imgUrl:
//       "https://yt3.googleusercontent.com/ytc/APkrFKYcYswt_UhD7D0j6ddiQz6Gb8Q_vSJOjhYI0CoXSw=s176-c-k-c0x00ffffff-no-rj-mo",
//   },
// ];

const playlists = [
  { id: "1", name: "Demo Playlist 1" },
  { id: "2", name: "Demo Playlist 2" },
  { id: "3", name: "Demo Playlist 3" },
  { id: "4", name: "Demo Playlist 4" },
  { id: "5", name: "Demo Playlist 5" },
  { id: "5", name: "Demo Playlist 6" },
];

export function Sidebar() {
  const { route } = useRouter();
  const { data: session } = useSession();
  const { isLargeOpen, isSmallOpen, close } = useSidebarContext();

  return (
    <>
      <aside
        className={`scrollbar-hidden sticky top-0 ml-1 flex flex-col overflow-y-auto pb-4 ${
          isLargeOpen ? "lg:hidden" : "lg:flex"
        }`}
      >
        <SmallSidebarItem Icon={Home} title="Home" url="/" />
        <SmallSidebarItem Icon={Star} title="Stars" url="/stars" />
        <SmallSidebarItem Icon={Bookmark} title="Bookmarks" url="/bookmarks" />
        {session && (
          <SmallSidebarItem Icon={Plus} title="Moderation" url="/moderation" />
        )}
      </aside>
      {isSmallOpen && (
        <div
          onClick={close}
          className="bg-secondary-dark fixed inset-0 z-[999] opacity-50 lg:hidden"
        />
      )}
      <aside
        className={`scrollbar-hidden absolute top-0 w-56 flex-col gap-2 overflow-y-auto px-2 pb-4 lg:sticky ${
          isLargeOpen ? "lg:flex" : "lg:hidden"
        } ${isSmallOpen ? "z-[999] flex max-h-screen bg-white" : "hidden"}`}
      >
        <div className="sticky top-0 bg-white px-2 pb-4 pt-2 lg:hidden">
          <HeaderFirstSection />
        </div>
        <LargeSidebarSection>
          <LargeSidebarItem
            isActive={route === "/"}
            IconOrImgUrl={Home}
            title="Home"
            url="/"
          />
          <LargeSidebarItem
            isActive={route === "/stars"}
            IconOrImgUrl={Star}
            title="Stars"
            url="/stars"
          />
          <LargeSidebarItem
            isActive={route === "/bookmarks"}
            IconOrImgUrl={Bookmark}
            title="Bookmarks"
            url="/bookmarks"
          />
        </LargeSidebarSection>
        <hr />
        <LargeSidebarSection title="Playlists" visibleItemCount={5}>
          {playlists.map((playlist) => (
            <LargeSidebarItem
              key={playlist.id}
              IconOrImgUrl={ListVideo}
              title={playlist.name}
              url={`/playlist?list=${playlist.id}`}
            />
          ))}
        </LargeSidebarSection>
        {/* <hr />
        <LargeSidebarSection title="Subscriptions">
          {subscriptions.map((subscription) => (
            <LargeSidebarItem
              key={subscription.id}
              IconOrImgUrl={subscription.imgUrl}
              title={subscription.channelName}
              url={`/@${subscription.id}`}
            />
          ))}
        </LargeSidebarSection> */}
        {/* <hr />
        <LargeSidebarSection title="Explore">
          <LargeSidebarItem
            IconOrImgUrl={Flame}
            title="Trending"
            url="/trending"
          />
          <LargeSidebarItem
            IconOrImgUrl={ShoppingBag}
            title="Shopping"
            url="/shopping"
          />
          <LargeSidebarItem IconOrImgUrl={Music2} title="Music" url="/music" />
          <LargeSidebarItem
            IconOrImgUrl={Film}
            title="Movies & TV"
            url="/movies-tv"
          />
          <LargeSidebarItem IconOrImgUrl={Radio} title="Live" url="/live" />
          <LargeSidebarItem
            IconOrImgUrl={Gamepad2}
            title="Gaming"
            url="/gaming"
          />
          <LargeSidebarItem IconOrImgUrl={Newspaper} title="News" url="/news" />
          <LargeSidebarItem
            IconOrImgUrl={Trophy}
            title="Sports"
            url="/sports"
          />
          <LargeSidebarItem
            IconOrImgUrl={Lightbulb}
            title="Learning"
            url="/learning"
          />
          <LargeSidebarItem
            IconOrImgUrl={Shirt}
            title="Fashion & Beauty"
            url="/fashion-beauty"
          />
          <LargeSidebarItem
            IconOrImgUrl={Podcast}
            title="Podcasts"
            url="/podcasts"
          />
        </LargeSidebarSection> */}
        {session && (
          <>
            <hr />
            <LargeSidebarSection title="Moderation">
              <LargeSidebarItem
                isActive={route === "/moderation"}
                IconOrImgUrl={Plus}
                title="Moderation Queue"
                url="/moderation"
              />
            </LargeSidebarSection>
          </>
        )}
      </aside>
    </>
  );
}

type SmallSidebarItemProps = {
  Icon: ElementType;
  title: string;
  url: string;
};

function SmallSidebarItem({ Icon, title, url }: SmallSidebarItemProps) {
  return (
    <a
      href={url}
      className={twMerge(
        "flex flex-col items-center gap-1 rounded-lg px-1 py-4",
      )}
    >
      <Icon className="h-6 w-6" />
      <div className="text-sm">{title}</div>
    </a>
  );
}

type LargeSidebarSectionProps = {
  children: ReactNode;
  title?: string;
  visibleItemCount?: number;
};

function LargeSidebarSection({
  children,
  title,
  visibleItemCount = Number.POSITIVE_INFINITY,
}: LargeSidebarSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const childrenArray = Children.toArray(children).flat();
  const showExpandButton = childrenArray.length > visibleItemCount;
  const visibleChildren = isExpanded
    ? childrenArray
    : childrenArray.slice(0, visibleItemCount);
  const ButtonIcon = isExpanded ? ChevronUp : ChevronDown;

  return (
    <div>
      {title && <div className="mb-1 ml-4 mt-2 text-lg">{title}</div>}
      {visibleChildren}
      {showExpandButton && (
        <Button
          onClick={() => setIsExpanded((e) => !e)}
          variant="ghost"
          className="flex w-full items-center gap-4 rounded-lg p-3"
        >
          <ButtonIcon className="h-6 w-6" />
          <div>{isExpanded ? "Show Less" : "Show More"}</div>
        </Button>
      )}
    </div>
  );
}

type LargeSidebarItemProps = {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  IconOrImgUrl: ElementType | string;
  title: string;
  url: string;
  isActive?: boolean;
};

function LargeSidebarItem({
  IconOrImgUrl,
  title,
  url,
  isActive = false,
}: LargeSidebarItemProps) {
  return (
    <a
      href={url}
      className={twMerge(
        `flex w-full items-center gap-4 rounded-lg p-3 ${
          isActive
            ? "bg-neutral-100 font-bold hover:bg-secondary dark:bg-neutral-800"
            : undefined
        }`,
      )}
    >
      {typeof IconOrImgUrl === "string" ? (
        <img src={IconOrImgUrl} className="h-6 w-6 rounded-full" alt="" />
      ) : (
        <IconOrImgUrl className="h-6 w-6" />
      )}
      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
        {title}
      </div>
    </a>
  );
}
