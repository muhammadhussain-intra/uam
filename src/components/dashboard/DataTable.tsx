"use client";

import { useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type ColumnFiltersState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  totalEntries?: number;
  searchPlaceholder?: string;
  emptyMessage?: string;
  showSearch?: boolean;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 5,
  totalEntries,
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  showSearch = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const filteredCount = table.getFilteredRowModel().rows.length;
  const pageRows = table.getRowModel().rows;
  const { pageIndex } = table.getState().pagination;

  const firstEntry = filteredCount === 0 ? 0 : pageIndex * pageSize + 1;
  const lastEntry = Math.min((pageIndex + 1) * pageSize, filteredCount);

  const pageCount = table.getPageCount();

  // Keep pagination compact for large datasets.
  const pageNumbers = Array.from(
    { length: pageCount },
    (_, index) => index,
  ).filter((index) => {
    if (pageCount <= 7) return true;
    if (index === 0 || index === pageCount - 1) return true;
    return Math.abs(index - pageIndex) <= 1;
  });

  return (
    <div className="w-full min-w-0">
      {showSearch && (
        <div className="mb-4">
          <input
            value={globalFilter}
            onChange={(event) => {
              setGlobalFilter(event.target.value);
              table.setPageIndex(0);
            }}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="h-10 w-full max-w-sm rounded-lg border border-border-default bg-card px-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-action/20"
          />
        </div>
      )}

      <div className="w-full overflow-x-auto rounded-lg">
        <table className="w-full border-separate border-spacing-0 text-left text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="whitespace-nowrap bg-green-light px-4 py-3 text-xs font-semibold text-text-secondary first:rounded-l-lg last:rounded-r-lg"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "flex items-center gap-1.5"
                            : ""
                        }
                      >
                        {header.column.getCanSort() ? (
                          <button
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                            className="inline-flex items-center gap-1.5 text-left hover:text-primary"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}

                            {header.column.getIsSorted() === "asc" ? (
                              <ChevronUp size={14} />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ChevronDown size={14} />
                            ) : (
                              <ChevronsUpDown
                                size={13}
                                className="text-text-muted"
                              />
                            )}
                          </button>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {pageRows.length > 0 ? (
              pageRows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-green-light/40"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border-b border-border-default/50 bg-white/65 px-4 py-3 text-text-primary last:border-r-0"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-text-secondary"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-text-secondary">
          Showing {firstEntry} to {lastEntry} of{" "}
          {(totalEntries ?? filteredCount).toLocaleString("en-US")} entries
        </p>

        <nav
          aria-label="Table pagination"
          className="flex flex-wrap items-center gap-1"
        >
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-green-light disabled:opacity-40"
          >
            <ChevronLeft size={17} />
          </button>

          {pageNumbers.map((page, index) => {
            const previousPage = pageNumbers[index - 1];
            const showEllipsis =
              previousPage !== undefined && page - previousPage > 1;

            return (
              <span key={page} className="contents">
                {showEllipsis && (
                  <span className="flex h-8 min-w-7 items-center justify-center text-xs text-text-muted">
                    ...
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => table.setPageIndex(page)}
                  aria-label={`Page ${page + 1}`}
                  aria-current={pageIndex === page ? "page" : undefined}
                  className={`h-8 min-w-8 rounded-md px-2 text-xs font-medium transition-colors ${
                    pageIndex === page
                      ? "bg-primary text-white"
                      : "bg-green-light text-text-secondary hover:bg-border-default"
                  }`}
                >
                  {page + 1}
                </button>
              </span>
            );
          })}

          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-green-light disabled:opacity-40"
          >
            <ChevronRight size={17} />
          </button>
        </nav>
      </div>
    </div>
  );
}
