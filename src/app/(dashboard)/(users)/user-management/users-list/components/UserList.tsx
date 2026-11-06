"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/ui/Button";

import getUsers from "../actions/getUsers";
import UserKpiSection from "../components/UserKpiSection";
import UserFilters from "../components/UserFilters";
import UsersTable from "../components/UsersTable";

import type { User } from "../data/mockUsers";
import type { UsersFilterValues } from "../users.schema";
import { usersFilterSchema } from "../users.schema";
import DeleteUserModal from "./DeleteUserModal";

const initialFilters: UsersFilterValues = {
  search: "",
  role: "all",
  status: "all",
  fromDate: "",
  toDate: "",
};

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [statistics, setStatistics] = useState<
    Awaited<ReturnType<typeof getUsers>>["statistics"] | null
  >(null);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [filters, setFilters] = useState<UsersFilterValues>(initialFilters);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getUsers();

      if (!result.success) {
        toast.error("Unable to load users", {
          description: result.message,
        });
        return;
      }

      setUsers(result.users);
      setTotalEntries(result.totalEntries);
      setStatistics(result.statistics);
    } catch {
      toast.error("Something went wrong", {
        description: "Unable to retrieve users.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((user) => {
    const search = filters.search.toLowerCase().trim();

    const matchesSearch =
      !search ||
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.id.toLowerCase().includes(search);

    const matchesRole = filters.role === "all" || user.role === filters.role;

    const matchesStatus =
      filters.status === "all" || user.status === filters.status;

    return matchesSearch && matchesRole && matchesStatus;
  });

  function handleFiltersChange(nextFilters: UsersFilterValues) {
    const validation = usersFilterSchema.safeParse(nextFilters);

    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message ?? "Invalid filters");
      return;
    }

    setFilters(validation.data);
  }

  function handleResetFilters() {
    setFilters(initialFilters);
  }

  function handleViewUser(user: User) {
    router.push(`/user-management/${user.id}/view`);
  }

  function handleEditUser(user: User) {
    router.push(`/user-management/${user.id}/edit`);
  }

  function handleDeleteUser(user: User) {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  }

  function handleConfirmDelete() {
    if (!selectedUser) return;

    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== selectedUser.id),
    );

    setTotalEntries((prev) => Math.max(0, prev - 1));

    toast.success("User deleted successfully", {
      description: `${selectedUser.name} has been removed.`,
    });

    setDeleteModalOpen(false);
    setSelectedUser(null);
  }

  return (
    <div className="min-w-0 space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users size={21} className="text-primary" />

            <h1 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              User Management
            </h1>
          </div>

          <p className="mt-1 text-sm text-text-secondary">
            Manage users, their roles, access and security settings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            leftIcon={<RefreshCw size={16} />}
            onClick={fetchUsers}
            loading={loading}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus size={17} />}
            onClick={() => router.push("/user-management/create")}
          >
            Add User
          </Button>
        </div>
      </div>

      {/* KPI Section */}
      {statistics && <UserKpiSection statistics={statistics} />}

      {/* Filters */}
      <UserFilters
        filters={filters}
        onChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      {/* Users Table */}
      {loading ? (
        <div className="flex min-h-60 items-center justify-center rounded-xl border border-border-default bg-white">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <RefreshCw size={18} className="animate-spin" />
            Loading users...
          </div>
        </div>
      ) : (
        <UsersTable
          users={filteredUsers}
          totalEntries={
            filters.search || filters.role !== "all" || filters.status !== "all"
              ? filteredUsers.length
              : totalEntries
          }
          onView={handleViewUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      )}
      <DeleteUserModal
        isOpen={deleteModalOpen}
        user={selectedUser}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
