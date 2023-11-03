import { Character } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { CategoryPills } from "~/components/category_pills/category_pills";
import { Pagination } from "~/components/pagination/pagination";
import { PlayGridItem } from "~/components/play_grid/play_grid_item";
import { api } from "~/utils/api";

export default function Home() {
  const { query } = useRouter();
  const categories = Object.keys(Character);
  const [selectedCategory, setSelectedCategory] = useState(categories[0] ?? "");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const { data: plays } = api.play.getAllBookmarked.useQuery(
    {
      currentPage,
      pageSize,
      filter: { c: (query.c === "All" ? undefined : query.c) as Character },
    },
    { refetchOnWindowFocus: false },
  );

  return (
    <div className="overflow-x-hidden px-8 pb-4">
      <div className="sticky top-0 z-10 pb-4">
        <CategoryPills
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {plays?.plays.map((play) => <PlayGridItem key={play.id} {...play} />)}
      </div>
      {plays?.count !== undefined && plays?.count > 0 && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemCount={plays?.count ?? 0}
          pageSize={pageSize}
        />
      )}
    </div>
  );
}
