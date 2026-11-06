
"use client";

import { AlertTriangle, Trash2 } from "lucide-react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

import type { User } from "../data/mockUsers";

interface DeleteUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteUserModal({
  isOpen,
  user,
  onClose,
  onConfirm,
  loading = false,
}: DeleteUserModalProps) {
  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete User"
      size="md"
      closeOnOverlayClick={!loading}
      showCloseButton={!loading}
      footer={
        <>
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            size="md"
            leftIcon={<Trash2 size={16} />}
            onClick={onConfirm}
            loading={loading}
          >
            Delete User
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-error">
            <AlertTriangle size={22} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              Are you sure you want to delete this user?
            </h3>

            <p className="mt-1 text-xs leading-5 text-text-secondary">
              This action will remove the selected user from
              the user listing. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border-default bg-subtle p-3">
          <p className="text-sm font-semibold text-text-primary">
            {user.name}
          </p>

          <p className="mt-1 text-xs text-text-secondary">
            {user.email}
          </p>

          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-md bg-white px-2 py-1 text-text-secondary">
              ID: {user.id}
            </span>

            <span className="rounded-md bg-white px-2 py-1 text-text-secondary">
              {user.role}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
