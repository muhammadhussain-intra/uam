
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ShieldCheck,
  Smartphone,
  FileText,
  ArrowRight,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import type { RootState } from "@/lib/store";
import { updateMfaDetails } from "@/store/slices/authSlice";

import Button from "@/components/ui/Button";

import {
  deleteMfaFactor,
} from "../actions";

import type { TotpEnrollmentData } from "../actions";

import TotpSetupModal from "./TotpSetupModal";
import TotpConfirmModal from "./TotpConfirmModal";
import BackupCodesModal from "./BackupCodesModal";
import ConfirmActionModal from "./ConfirmActionModal";
import TrustedDevicesSection from "./TrustedDevicesSection";

export default function MfaSettingsCard() {
  const dispatch = useDispatch();

  const {
    loginMethods,
    backupCodesRemaining,
    totpFactorId,
  } = useSelector((state: RootState) => state.auth);

  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);

  const [totpEnrollment, setTotpEnrollment] =
    useState<TotpEnrollmentData | null>(null);

  const [isDisabling, setIsDisabling] = useState(false);

  // Missing method means inactive.
  const isTotpEnabled = loginMethods.includes("totp");

  // ==========================================
  // TOTP Setup
  // ==========================================

  const handleTotpSetup = (data: TotpEnrollmentData) => {
    setTotpEnrollment(data);
    setIsSetupModalOpen(false);
    setIsConfirmModalOpen(true);
  };

  // ==========================================
  // TOTP Enabled Successfully
  // ==========================================

  const handleTotpSuccess = (factorId?: number) => {
    dispatch(
      updateMfaDetails({
        loginMethods: loginMethods.includes("totp")
          ? loginMethods
          : [...loginMethods, "totp"],

        totpFactorId:
          typeof factorId === "number" ? factorId : null,
      }),
    );

    setIsConfirmModalOpen(false);
    setTotpEnrollment(null);
  };

  // ==========================================
  // Disable TOTP
  // ==========================================

  const handleDisableTotp = async () => {
    if (isDisabling) return;

    if (totpFactorId === null) {
      toast.error(
        "Authenticator factor ID is unavailable. Please contact support.",
      );
      return;
    }

    setIsDisabling(true);

    try {
      const response = await deleteMfaFactor(totpFactorId);

      if (!response) return;

      dispatch(
        updateMfaDetails({
          loginMethods: loginMethods.filter(
            (method) => method !== "totp",
          ),
          totpFactorId: null,
        }),
      );

      setIsDisableModalOpen(false);

    } catch (error) {
      console.error("[MFA] Disable TOTP Error:", error);
    } finally {
      setIsDisabling(false);
    }
  };

  // ==========================================
  // Backup Codes Generated
  // ==========================================

  const handleBackupCodesGenerated = (totalCodes: number) => {
    dispatch(
      updateMfaDetails({
        backupCodesRemaining: totalCodes,
      }),
    );
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="space-y-5">

      <section className="rounded-xl border border-border-default bg-white p-4 shadow-card sm:p-5">

        <div className="flex items-center gap-3 border-b border-border-default/70 pb-4">

          <div className="flex size-9 items-center justify-center rounded-lg bg-green-light text-primary">
            <ShieldCheck size={19} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Multi-Factor Authentication
            </h2>

            <p className="mt-0.5 text-xs text-text-secondary">
              Configure your additional authentication methods.
            </p>
          </div>

        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* Authenticator App */}

          <div className="flex flex-col justify-between rounded-xl border border-border-default/70 bg-[#FBFDFC] p-4">

            <div>
              <div className="flex items-center gap-3">

                <div className="flex size-10 items-center justify-center rounded-lg bg-green-light text-primary">
                  <Smartphone size={19} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    Authenticator App
                  </h3>

                  <p className="text-xs text-text-secondary">
                    Time-based one-time password (TOTP)
                  </p>
                </div>

              </div>

              <p className="mt-4 text-xs leading-relaxed text-text-secondary">
                Connect an authenticator app to generate secure,
                time-based verification codes.
              </p>

              <p className="mt-3 text-xs font-medium">
                Status:{" "}
                <span className={
                  isTotpEnabled
                    ? "text-success"
                    : "text-text-secondary"
                }>
                  {isTotpEnabled ? "Enabled" : "Disabled"}
                </span>
              </p>
            </div>

            {isTotpEnabled ? (
              <Button
                variant="danger"
                size="md"
                fullWidth
                className="mt-5"
                leftIcon={<Trash2 size={15} />}
                // disabled={totpFactorId === null}
                onClick={() => setIsDisableModalOpen(true)}
              >
                Disable Authenticator
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                fullWidth
                className="mt-5"
                rightIcon={<ArrowRight size={16} />}
                onClick={() => setIsSetupModalOpen(true)}
              >
                Setup Authenticator
              </Button>
            )}

          </div>

          {/* Backup Codes */}

          <div className="flex flex-col justify-between rounded-xl border border-border-default/70 bg-[#FBFDFC] p-4">

            <div>
              <div className="flex items-center gap-3">

                <div className="flex size-10 items-center justify-center rounded-lg bg-green-light text-primary">
                  <FileText size={19} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    Backup Codes
                  </h3>

                  <p className="text-xs text-text-secondary">
                    {backupCodesRemaining} recovery codes remaining
                  </p>
                </div>

              </div>

              <p className="mt-4 text-xs leading-relaxed text-text-secondary">
                Generate one-time recovery codes to access your
                account if you cannot use your regular verification method.
              </p>
            </div>

            <Button
              variant="outline"
              size="md"
              fullWidth
              className="mt-5"
              rightIcon={<ArrowRight size={16} />}
              onClick={() => setIsBackupModalOpen(true)}
            >
              {backupCodesRemaining > 0
                ? "Regenerate Backup Codes"
                : "Generate Backup Codes"}
            </Button>

          </div>

        </div>
      </section>

      {/* Trusted Devices */}

      <TrustedDevicesSection />

      {/* TOTP Setup */}

      <TotpSetupModal
        open={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onContinue={handleTotpSetup}
      />

      {/* TOTP Confirmation */}

      <TotpConfirmModal
        open={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setTotpEnrollment(null);
        }}
        setupToken={totpEnrollment?.setup_token ?? ""}
        onSuccess={handleTotpSuccess}
      />

      {/* Backup Codes */}

      <BackupCodesModal
        open={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onGenerated={handleBackupCodesGenerated}
      />

      {/* Disable Confirmation */}

      <ConfirmActionModal
        open={isDisableModalOpen}
        title="Disable Authenticator App"
        description="Are you sure you want to remove your authenticator app? Your backup codes will remain available."
        confirmLabel="Disable Authenticator"
        cancelLabel="Cancel"
        danger
        onClose={() => setIsDisableModalOpen(false)}
        onConfirm={handleDisableTotp}
      />

    </div>
  );
}
