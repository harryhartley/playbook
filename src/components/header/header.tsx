// import { useSidebarContext } from "../contexts/SidebarContext";
import { HeaderFirstSection } from "./first_section";
import { HeaderForm } from "./form";
import { HeaderSecondSection } from "./second_section";

export function Header() {
  return (
    <div className="mx-4 mb-6 flex justify-between gap-10 pt-2 lg:gap-20">
      <HeaderFirstSection />
      <HeaderForm />
      <HeaderSecondSection />
    </div>
  );
}
