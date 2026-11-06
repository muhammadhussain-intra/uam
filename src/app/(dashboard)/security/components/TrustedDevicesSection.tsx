"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Monitor,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  Trash2,
} from "lucide-react";

import Button from "@/components/ui/Button";

import { getTrustedDevices, revokeTrustedDevice } from "../actions";

import type { TrustedDevice } from "../actions/trusted-devices";

const formatDate = (date?: string) => {
  if (!date) return null;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return null;

  return parsedDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function TrustedDevicesSection() {
  const [devices, setDevices] = useState<TrustedDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<number | null>(null);
  const [loadError, setLoadError] = useState(false);

  const loadDevices = useCallback(async () => {
    setLoading(true);
    setLoadError(false);

    try {
      const response = await getTrustedDevices();

      if (!response || !Array.isArray(response.data)) {
        setDevices([]);
        setLoadError(true);
        return;
      }

      setDevices(response.data);
    } catch (error) {
      console.error("[MFA] Load Trusted Devices Error:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDevices();
  }, [loadDevices]);

  const handleRevoke = async (deviceId: number) => {
    if (revokingId !== null) return;

    setRevokingId(deviceId);

    try {
      const response = await revokeTrustedDevice(deviceId);

      if (!response) return;

      await loadDevices();
    } catch (error) {
      console.error("[MFA] Revoke Trusted Device Error:", error);
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <section className="rounded-xl border border-border-default bg-white p-4 shadow-card sm:p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-default/70 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-green-light text-primary">
            <Monitor size={19} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Trusted Devices
            </h2>
            <p className="mt-0.5 text-xs text-text-secondary">
              Devices allowed to skip additional verification.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadDevices}
          disabled={loading || revokingId !== null}
          leftIcon={<RefreshCw size={14} />}
        >
          Refresh
        </Button>
      </div>

      {/* Device Count */}
      {!loading && !loadError && (
        <div className="mt-4 flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary" />
          <p className="text-xs font-medium text-text-secondary">
            {devices.length} trusted{" "}
            {devices.length === 1 ? "device" : "devices"}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <RefreshCw size={22} className="animate-spin text-primary" />
          <p className="text-sm text-text-secondary">
            Loading trusted devices...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && loadError && (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm text-text-secondary">
            Unable to load trusted devices.
          </p>

          <Button variant="outline" size="sm" onClick={loadDevices}>
            Try Again
          </Button>
        </div>
      )}

      {/* Empty */}
      {!loading && !loadError && devices.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <ShieldCheck size={32} className="text-text-secondary" />

          <div>
            <p className="text-sm font-medium text-text-primary">
              No trusted devices found
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              Devices you trust during authentication will appear here.
            </p>
          </div>
        </div>
      )}

      {/* Devices */}
      {!loading && !loadError && devices.length > 0 && (
        <div className="mt-4 divide-y divide-border-default/70">
          {devices.map((device) => {
            const trustedDate = formatDate(device.trusted_at);
            const expiryDate = formatDate(device.expires_at);
            const lastUsedDate = formatDate(device.last_used_at);

            return (
              <div
                key={device.id}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-subtle">
                    <Monitor size={19} className="text-text-secondary" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-text-primary">
                        {device.name || "Unknown Device"}
                      </p>

                      {device.current && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-[10px] font-medium text-success">
                          <Smartphone size={11} />
                          Current Device
                        </span>
                      )}
                    </div>

                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
                      {trustedDate && <span>Trusted: {trustedDate}</span>}

                      {expiryDate && <span>Expires: {expiryDate}</span>}

                      {lastUsedDate && <span>Last Used: {lastUsedDate}</span>}
                    </div>
                  </div>
                </div>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRevoke(device.id)}
                  disabled={revokingId !== null || device.current === true}
                  loading={revokingId === device.id}
                  leftIcon={<Trash2 size={14} />}
                  className="w-full sm:w-auto"
                >
                  Revoke
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
