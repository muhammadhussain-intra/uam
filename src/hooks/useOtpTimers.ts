
"use client";

import { useCallback, useEffect, useState } from "react";

interface UseOtpTimersProps {
  enabled: boolean;
  expiryKey: string;
  resendKey: string;
  expirySeconds: number;
  resendSeconds: number;
}

interface UseOtpTimersReturn {
  secondsLeft: number;
  resendSecondsLeft: number;
  resetTimers: () => void;
  clearTimers: () => void;
}

const getRemainingSeconds = (key: string): number => {
  const expiresAt = Number(sessionStorage.getItem(key));

  if (!Number.isFinite(expiresAt) || expiresAt <= 0) {
    return 0;
  }

  return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
};

export default function useOtpTimers({
  enabled,
  expiryKey,
  resendKey,
  expirySeconds,
  resendSeconds,
}: UseOtpTimersProps): UseOtpTimersReturn {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [resendSecondsLeft, setResendSecondsLeft] = useState(0);

  // Initialize timestamps or restore existing timestamps
  useEffect(() => {
    if (!enabled) return;

    const initializeTimer = (key: string, duration: number) => {
      const storedExpiry = Number(sessionStorage.getItem(key));

      if (!Number.isFinite(storedExpiry) || storedExpiry <= 0) {
        sessionStorage.setItem(
          key,
          String(Date.now() + duration * 1000),
        );
      }
    };

    initializeTimer(expiryKey, expirySeconds);
    initializeTimer(resendKey, resendSeconds);

    const updateTimers = () => {
      setSecondsLeft(getRemainingSeconds(expiryKey));
      setResendSecondsLeft(getRemainingSeconds(resendKey));
    };

    updateTimers();

    const interval = window.setInterval(updateTimers, 1000);

    return () => window.clearInterval(interval);
  }, [
    enabled,
    expiryKey,
    resendKey,
    expirySeconds,
    resendSeconds,
  ]);

  // Reset both timers after successful OTP resend
  const resetTimers = useCallback(() => {
    const newExpiry = Date.now() + expirySeconds * 1000;
    const newResendExpiry = Date.now() + resendSeconds * 1000;

    sessionStorage.setItem(expiryKey, String(newExpiry));
    sessionStorage.setItem(resendKey, String(newResendExpiry));

    setSecondsLeft(expirySeconds);
    setResendSecondsLeft(resendSeconds);
  }, [expiryKey, resendKey, expirySeconds, resendSeconds]);

  // Clear timers after successful verification
  const clearTimers = useCallback(() => {
    sessionStorage.removeItem(expiryKey);
    sessionStorage.removeItem(resendKey);

    setSecondsLeft(0);
    setResendSecondsLeft(0);
  }, [expiryKey, resendKey]);

  return {
    secondsLeft,
    resendSecondsLeft,
    resetTimers,
    clearTimers,
  };
}
