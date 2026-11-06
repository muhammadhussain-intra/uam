
interface OtpResendButtonProps {
  secondsLeft: number;
  isResending: boolean;
  onResend: () => void;
  disabled?: boolean;
  prefix?: string;
  loadingText?: string;
  resendText?: string;
  className?: string;
}

export default function OtpResendButton({
  secondsLeft,
  isResending,
  onResend,
  disabled = false,
  prefix = "Didn't receive the code?",
  loadingText = "Sending new code...",
  resendText = "Resend code",
  className = "mt-5",
}: OtpResendButtonProps) {
  const isCoolingDown = secondsLeft > 0;

  return (
    <p
      className={`text-center text-xs leading-relaxed text-text-secondary ${className}`}
      aria-live="polite"
    >
      {prefix}{" "}

      {isResending ? (
        <span className="font-medium text-text-muted">
          {loadingText}
        </span>
      ) : isCoolingDown ? (
        <span className="font-medium text-text-muted tabular-nums">
          Resend in {Math.floor(secondsLeft / 60)
            .toString()
            .padStart(2, "0")}
          :
          {(secondsLeft % 60).toString().padStart(2, "0")}
        </span>
      ) : (
        <button
          type="button"
          onClick={onResend}
          disabled={disabled}
          className="font-semibold text-primary underline-offset-4 transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resendText}
        </button>
      )}
    </p>
  );
}
