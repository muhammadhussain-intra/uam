// Keeps only numbers (0-9) for OTP typing and pasting
export function extractDigits(value: string): string {
  return value.replace(/\D/g, "");
}

// Masks email for privacy (e.g. admin@mail.com -> a***@mail.com)
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;

  const [username, domain] = email.split("@");
  if (!username) return email;

  const visibleChar = username[0];
  return `${visibleChar}***@${domain}`;
}
