import { Bell, LogIn, Search } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { useUIStore } from "~/stores/uiStore";
import { PlayForm } from "../play_form/play_form";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
// import { ThemeSwitch } from "../theme_switch/theme_switch";
import { isUserContributorOrAbove } from "~/utils/auth";

export function HeaderSecondSection() {
  const { data: session, status: sessionStatus } = useSession();
  const { push } = useRouter();
  const { fullWidthSearch, showFullWidthSearch } = useUIStore();

  return (
    <div
      className={`mr-2 flex-shrink-0 items-center md:gap-2 ${
        fullWidthSearch ? "hidden" : "flex"
      }`}
    >
      <Button
        onClick={() => showFullWidthSearch()}
        size="icon"
        variant="ghost"
        className="md:hidden"
      >
        <Search />
      </Button>

      {sessionStatus === "authenticated" &&
        isUserContributorOrAbove(session.user.role) && <PlayForm />}

      <Button size="icon" variant="ghost">
        <Bell />
      </Button>

      {/* <ThemeSwitch /> */}

      {sessionStatus === "loading" ? (
        <div>Loading...</div>
      ) : session ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="rounded-r-none focus-visible:ring-transparent"
          >
            <Button size="icon" variant="link">
              <Avatar>
                <AvatarImage src={session.user.image ?? ""} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => push(`/user/${session.user.id}`)}
            >
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => void signOut()}
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button size="icon" variant="link" onClick={() => void signIn()}>
          <LogIn />
        </Button>
      )}
    </div>
  );
}
