"use client";

import type { LoginHistoryItem } from "../actions/dashboard";
import { Loader2, Search } from "lucide-react";
import Select from "@/components/ui/Select";

interface Props {
  data: LoginHistoryItem[];
  loading: boolean;

  page: number;
  pageSize: number;
  totalEntries: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  user: string;
  onUserChange: (value: string) => void;

  result: "all" | "success" | "failed";
  onResultChange: (
    value: "all" | "success" | "failed",
  ) => void;

  from: string;
  onFromChange: (value: string) => void;

  to: string;
  onToChange: (value: string) => void;
}

export default function LoginHistoryTable({
  data,
  loading,
  page,
  pageSize,
  totalEntries,
  totalPages,
  onPageChange,
  user,
  onUserChange,
  result,
  onResultChange,
  from,
  onFromChange,
  to,
  onToChange,
}: Props) {
  const firstEntry =
    totalEntries === 0 ? 0 : (page - 1) * pageSize + 1;

  const lastEntry = Math.min(
    page * pageSize,
    totalEntries,
  );

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  ).filter(
    (number) =>
      number === 1 ||
      number === totalPages ||
      Math.abs(number - page) <= 1,
  );

  return (
    <section className="min-w-0 rounded-xl border border-border-default bg-white p-4 shadow-card sm:p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-text-primary">
          Login History
        </h2>

        <p className="mt-1 text-xs text-text-secondary">
          Recent authentication events across all interfaces.
        </p>
      </div>

      {/* Backend-supported filters */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />

          <input
            type="text"
            value={user}
            onChange={(event) =>
              onUserChange(event.target.value)
            }
            placeholder="Search user..."
            className="h-9 w-full rounded-lg border border-border-default bg-white pl-9 pr-3 text-xs outline-none focus:border-primary"
          />
        </div>

        <Select
          value={result}
          onChange={(event) =>
            onResultChange(
              event.target.value as
                | "all"
                | "success"
                | "failed",
            )
          }
          aria-label="Filter by login result"
          selectSize="md"
          options={[
            { label: "All Results", value: "all" },
            { label: "Success", value: "success" },
            { label: "Failed", value: "failed" },
          ]}
        />

        <input
          type="date"
          value={from}
          max={to || undefined}
          onChange={(event) => onFromChange(event.target.value)}
          aria-label="From date"
          className="h-9 rounded-lg border border-border-default bg-white px-3 text-xs outline-none focus:border-primary"
        />

        <input
          type="date"
          value={to}
          min={from || undefined}
          onChange={(event) => onToChange(event.target.value)}
          aria-label="To date"
          className="h-9 rounded-lg border border-border-default bg-white px-3 text-xs outline-none focus:border-primary"
        />
      </div>

      {/* Table */}
      <div className="relative min-h-48 w-full overflow-x-auto rounded-lg">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
            <Loader2
              size={27}
              className="animate-spin text-primary"
            />
          </div>
        )}

        <table className="w-full border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr>
              {[
                "User ID",
                "User",
                "Login",
                "IP Address",
                "Device",
                "Login Time",
                "Status",
                "Failure Reason",
              ].map((heading) => (
                <th
                  key={heading}
                  className="whitespace-nowrap bg-green-light px-4 py-3 text-xs font-semibold text-text-secondary"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((record) => (
                <tr
                  key={record.id}
                  className="transition-colors hover:bg-green-light/40"
                >
                  <td className="whitespace-nowrap border-b border-border-default/50 px-4 py-3 font-mono text-xs">
                    {record.user_code}
                  </td>

                  <td className="whitespace-nowrap border-b border-border-default/50 px-4 py-3 text-xs font-medium">
                    {record.display_name}
                  </td>

                  <td className="whitespace-nowrap border-b border-border-default/50 px-4 py-3 text-xs">
                    {record.login}
                  </td>

                  <td className="whitespace-nowrap border-b border-border-default/50 px-4 py-3 font-mono text-xs">
                    {record.client_ip}
                  </td>

                  <td className="whitespace-nowrap border-b border-border-default/50 px-4 py-3 text-xs">
                    {record.device_type}
                  </td>

                  <td className="whitespace-nowrap border-b border-border-default/50 px-4 py-3 text-xs">
                    {new Date(record.timestamp).toLocaleString()}
                  </td>

                  <td className="border-b border-border-default/50 px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        record.result === "success"
                          ? "bg-[#D5F7E1] text-[#16834A]"
                          : "bg-[#FCE7E7] text-[#C43D3D]"
                      }`}
                    >
                      {record.result === "success"
                        ? "Success"
                        : "Failed"}
                    </span>
                  </td>

                  <td className="border-b border-border-default/50 px-4 py-3 text-xs text-error">
                    {record.failure_reason || "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-sm text-text-secondary"
                >
                  {loading
                    ? "Loading login history..."
                    : "No login history records found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Server Pagination */}
      <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-text-secondary">
          Showing {firstEntry} to {lastEntry} of{" "}
          {totalEntries.toLocaleString()} entries
        </p>

        <nav
          aria-label="Login history pagination"
          className="flex flex-wrap items-center gap-1"
        >
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-green-light disabled:opacity-40"
          >
            Previous
          </button>

          {pageNumbers.map((number, index) => (
            <span key={number} className="contents">
              {index > 0 &&
                number - pageNumbers[index - 1] > 1 && (
                  <span className="px-1 text-xs">...</span>
                )}

              <button
                type="button"
                disabled={loading}
                onClick={() => onPageChange(number)}
                aria-current={page === number ? "page" : undefined}
                className={`h-8 min-w-8 rounded-md px-2 text-xs font-medium ${
                  page === number
                    ? "bg-primary text-white"
                    : "bg-green-light text-text-secondary hover:bg-border-default"
                }`}
              >
                {number}
              </button>
            </span>
          ))}

          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
            className="flex h-8 items-center justify-center rounded-md px-2 text-xs text-text-secondary hover:bg-green-light disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      </div>
    </section>
  );
}