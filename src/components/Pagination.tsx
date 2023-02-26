import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import type { Dispatch, SetStateAction } from 'react'

interface PaginationProps {
  currentPage: number
  setCurrentPage: Dispatch<SetStateAction<number>>
  itemCount: number
  pageSize: number
}

export const Pagination = ({ currentPage, setCurrentPage, itemCount, pageSize }: PaginationProps) => {
  const neighbours = 2

  return (
    <div className='flex justify-center'>
      <nav className='isolate inline-flex -space-x-px rounded-md shadow-sm' aria-label='Pagination'>
        <button
          onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)}
          className='relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20'
        >
          <span className='sr-only'>Previous</span>
          <ChevronLeftIcon className='h-5 w-5' aria-hidden='true' />
        </button>
        {Array(Math.ceil(itemCount / pageSize))
          .fill(0)
          .map((_, idx) => {
            if (idx + 1 === currentPage) {
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className='relative z-10 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20'
                >
                  {idx + 1}
                </button>
              )
            }
            if (idx + 1 === 1 || idx + 1 === Math.ceil(itemCount / pageSize)) {
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className='relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20'
                >
                  {idx + 1}
                </button>
              )
            }
            if (idx + 1 === currentPage - neighbours - 1 || idx + 1 === currentPage + neighbours + 1) {
              return (
                <span
                  key={idx}
                  className='relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700'
                >
                  ...
                </span>
              )
            }
            if (idx + 1 < currentPage - neighbours || idx + 1 > currentPage + neighbours) {
              return null
            }
            return (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className='relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20'
              >
                {idx + 1}
              </button>
            )
          })}
        <button
          onClick={() =>
            setCurrentPage(currentPage === Math.ceil(itemCount / pageSize) ? currentPage : currentPage + 1)
          }
          className='relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20'
        >
          <span className='sr-only'>Next</span>
          <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
        </button>
      </nav>
    </div>
  )
}
