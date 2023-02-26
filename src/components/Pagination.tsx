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
      <nav aria-label='Pagination'>
        <ul className='inline-flex space-x-2'>
          <li>
            <button
              onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)}
              className='focus:shadow-outline flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-150 hover:bg-gray-200'
            >
              <span className='sr-only'>Previous</span>
              <ChevronLeftIcon className='h-5 w-5' aria-hidden='true' />
            </button>
          </li>
          {Array(Math.ceil(itemCount / pageSize))
            .fill(0)
            .map((_, idx) => {
              if (idx + 1 === currentPage) {
                return (
                  <li key={idx}>
                    <button
                      onClick={() => setCurrentPage(idx + 1)}
                      className='focus:shadow-outline h-10 w-10 rounded-full border border-r-0 border-gray-500 bg-gray-500 text-white transition-colors duration-150'
                    >
                      {idx + 1}
                    </button>
                  </li>
                )
              }
              if (idx + 1 === 1 || idx + 1 === Math.ceil(itemCount / pageSize)) {
                return (
                  <li key={idx}>
                    <button
                      onClick={() => setCurrentPage(idx + 1)}
                      className='focus:shadow-outline h-10 w-10 rounded-full transition-colors duration-150 hover:bg-gray-200'
                    >
                      {idx + 1}
                    </button>
                  </li>
                )
              }
              if (idx + 1 === currentPage - neighbours - 1 || idx + 1 === currentPage + neighbours + 1) {
                return (
                  <button key={idx} className='focus:shadow-outline h-10 w-10 cursor-default rounded-full'>
                    ...
                  </button>
                )
              }
              if (idx + 1 < currentPage - neighbours || idx + 1 > currentPage + neighbours) {
                return null
              }
              return (
                <li key={idx}>
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className='focus:shadow-outline h-10 w-10 rounded-full transition-colors duration-150 hover:bg-gray-200'
                  >
                    {idx + 1}
                  </button>
                </li>
              )
            })}
          <li>
            <button
              onClick={() =>
                setCurrentPage(currentPage === Math.ceil(itemCount / pageSize) ? currentPage : currentPage + 1)
              }
              className='focus:shadow-outline flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-150 hover:bg-gray-200'
            >
              <span className='sr-only'>Next</span>
              <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
