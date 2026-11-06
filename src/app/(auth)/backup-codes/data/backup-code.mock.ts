export const mockBackupCodeData = {
  totalCodes: 8,
  usedCodes: 2,
  remainingCodes: [
    "ABCD-1234",
    "EFGH-5678",
    "IJKL-9012",
    "MNOP-3456",
    "QRST-7890",
    "UVWX-1234",
  ],
};

export const getRemainingBackupCodes = () => {
  return mockBackupCodeData.remainingCodes.length;
};