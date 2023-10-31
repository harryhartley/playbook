import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";

interface PaginationProps {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  itemCount: number;
  pageSize: number;
}

export const Pagination = ({
  currentPage,
  setCurrentPage,
  itemCount,
  pageSize,
}: PaginationProps) => {
  const neighbours = 2;
  const numberOfPages = Math.ceil(itemCount / pageSize) || 1;

  return (
    <div className="flex justify-center">
      <nav aria-label="Pagination">
        <ul className="inline-flex space-x-2">
          <li>
            <Button
              variant="ghost"
              onClick={() =>
                setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)
              }
            >
              <span className="sr-only">Previous</span>
              <ArrowLeftCircle />
            </Button>
          </li>
          {Array(numberOfPages)
            .fill(0)
            .map((_, idx) => {
              if (idx + 1 === currentPage) {
                return (
                  <li key={idx}>
                    <Button
                      onClick={() => setCurrentPage(idx + 1)}
                      variant="ghost"
                    >
                      {idx + 1}
                    </Button>
                  </li>
                );
              }
              if (idx + 1 === 1 || idx + 1 === numberOfPages) {
                return (
                  <li key={idx}>
                    <Button
                      onClick={() => setCurrentPage(idx + 1)}
                      variant="ghost"
                    >
                      {idx + 1}
                    </Button>
                  </li>
                );
              }
              if (
                idx + 1 === currentPage - neighbours - 1 ||
                idx + 1 === currentPage + neighbours + 1
              ) {
                return (
                  <Button variant="ghost" key={idx}>
                    ...
                  </Button>
                );
              }
              if (
                idx + 1 < currentPage - neighbours ||
                idx + 1 > currentPage + neighbours
              ) {
                return null;
              }
              return (
                <li key={idx}>
                  <Button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    variant="ghost"
                  >
                    {idx + 1}
                  </Button>
                </li>
              );
            })}
          <li>
            <Button
              variant="ghost"
              onClick={() =>
                setCurrentPage(
                  currentPage === numberOfPages ? currentPage : currentPage + 1,
                )
              }
            >
              <span className="sr-only">Next</span>
              <ArrowRightCircle />
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
};
