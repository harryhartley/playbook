import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { useSidebarContext } from "~/contexts/SidebarContext";
import { useUIStore } from "~/stores/uiStore";
import { useTheme } from "next-themes";

export function HeaderFirstSection() {
  const { resolvedTheme } = useTheme();
  const { fullWidthSearch } = useUIStore();
  const { toggle } = useSidebarContext();

  return (
    <div
      className={`flex-shrink-0 items-center gap-4 ${
        fullWidthSearch ? "hidden" : "flex"
      }`}
    >
      <Button onClick={toggle} variant="ghost" size="icon">
        <Menu />
      </Button>
      <Link className="flex items-center gap-4" href="/">
        <Image
          src={`/images/logo/${resolvedTheme ?? "light"}.png`}
          alt="Playbook Logo"
          width="64"
          height="64"
        />
        <h1 className="text-xl font-bold tracking-tight">Playbook</h1>
      </Link>
    </div>
  );
}
