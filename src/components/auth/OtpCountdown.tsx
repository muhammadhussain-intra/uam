
import { Clock } from "lucide-react";
import { formatTime } from "@/utils";

interface OtpCountdownProps {
  secondsLeft: number;
  label?: string;
  expiredMessage?: string;
  className?: string;
}

export default function OtpCountdown({
  secondsLeft,
  label = "OTP expires in",
  expiredMessage = "OTP has expired. Please request a new code.",
  className = "mb-5",
}: OtpCountdownProps) {
  const isExpired = secondsLeft <= 0;

  return (
    <div
      className={`flex items-center gap-2 text-xs ${
        isExpired ? "text-error" : "text-text-secondary"
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      <Clock
        size={14}
        className={`shrink-0 ${
          isExpired ? "text-error" : "text-text-muted"
        }`}
      />

      {isExpired ? (
        <span>{expiredMessage}</span>
      ) : (
        <span>
          {label}{" "}
          <strong className="font-semibold tabular-nums text-text-primary">
            {formatTime(secondsLeft)}
          </strong>
        </span>
      )}
    </div>
  );
}
