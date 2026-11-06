"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Check, ShieldCheck, Download } from "lucide-react";
import { toast } from "sonner";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

import { generateBackupCodes } from "../actions";

// ==========================================
// Validation
// ==========================================

const schema = z.object({
  password: z.string().min(1, "Current password is required."),
});

type FormValues = z.infer<typeof schema>;

// ==========================================
// Props
// ==========================================

interface BackupCodesModalProps {
  open: boolean;
  onClose: () => void;
  onGenerated?: (totalCodes: number) => void;
}

// ==========================================
// Component
// ==========================================

export default function BackupCodesModal({
  open,
  onClose,
  onGenerated,
}: BackupCodesModalProps) {
  const [codes, setCodes] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({ password: "" });
      setCodes([]);
      setCopied(false);
    }
  }, [open, reset]);

  // ==========================================
  // Generate Backup Codes
  // ==========================================

  const handleGenerate = async (values: FormValues) => {
    const response = await generateBackupCodes({
      password: values.password,
    });

    if (!response) return;

    const generatedCodes = response.data?.codes;
    const totalCodes = response.data?.count;

    if (!Array.isArray(generatedCodes) || generatedCodes.length === 0) {
      console.error("[MFA] Invalid backup codes response.");
      toast.error("No backup codes were returned.");
      return;
    }

    setCodes(generatedCodes);
    onGenerated?.(
      typeof totalCodes === "number" ? totalCodes : generatedCodes.length,
    );

    reset();
  };

  // ==========================================
  // Copy All Codes
  // ==========================================

  const handleCopy = async () => {
    if (!codes.length) return;

    try {
      await navigator.clipboard.writeText(codes.join("\n"));
      setCopied(true);
      toast.success("Backup codes copied.");

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("[MFA] Copy Backup Codes Error:", error);
      toast.error("Unable to copy backup codes.");
    }
  };

  const handleDownload = () => {
    if (!codes.length) return;

    try {
      const content = [
        "UAM - Backup Recovery Codes",
        "================================",
        "",
        ...codes.map((code, index) => `${index + 1}. ${code}`),
        "",
        "Keep these codes secure.",
        "Each code can only be used once.",
      ].join("\n");

      const blob = new Blob([content], {
        type: "text/plain;charset=utf-8",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `UAM-Backup-Codes-${new Date()
        .toISOString()
        .slice(0, 10)}.txt`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      toast.success("Backup codes downloaded.");
    } catch (error) {
      console.error("[MFA] Download Backup Codes Error:", error);
      toast.error("Unable to download backup codes.");
    }
  };

  // ==========================================
  // Close
  // ==========================================

  const handleClose = () => {
    if (isSubmitting) return;

    reset();
    setCodes([]);
    onClose();
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title="Backup Codes"
      size="md"
      closeOnOverlayClick={!isSubmitting}
      showCloseButton={!isSubmitting}
      footer={
        codes.length > 0 ? (
          <>
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>

            <Button
              variant="outline"
              onClick={handleCopy}
              leftIcon={copied ? <Check size={16} /> : <Copy size={16} />}
            >
              {copied ? "Copied" : "Copy All"}
            </Button>

            <Button
              variant="primary"
              onClick={handleDownload}
              leftIcon={<Download size={16} />}
            >
              Download
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={handleSubmit(handleGenerate)}
              loading={isSubmitting}
            >
              Generate Codes
            </Button>
          </>
        )
      }
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-lg border border-border-default bg-subtle/50 p-3">
          <ShieldCheck size={19} className="mt-0.5 shrink-0 text-primary" />

          <p className="text-xs leading-5 text-text-secondary">
            Generate backup codes to access your account if you cannot use your
            authenticator app. Generating new codes replaces your existing
            backup codes.
          </p>
        </div>

        {/* Password Form */}
        {codes.length === 0 && (
          <form onSubmit={handleSubmit(handleGenerate)} className="space-y-4">
            <TextField
              label="Current Password"
              type="password"
              placeholder="Enter your current password"
              autoComplete="current-password"
              required
              error={errors.password?.message}
              {...register("password")}
            />
          </form>
        )}

        {/* Generated Codes */}
        {codes.length > 0 && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Your Backup Codes
              </p>

              <p className="mt-1 text-xs text-text-secondary">
                {codes.length} codes generated. Each code can be used only once.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-lg border border-border-default bg-subtle/50 p-4">
              {codes.map((code, index) => (
                <div
                  key={`${index}-${code}`}
                  className="rounded-md bg-white px-3 py-2 text-center"
                >
                  <code className="text-sm font-semibold tracking-wide text-text-primary">
                    {code}
                  </code>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
              <p className="text-xs leading-5 text-text-secondary">
                Save these codes somewhere secure. They may not be shown again
                after closing this window. Do not share them with anyone.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
