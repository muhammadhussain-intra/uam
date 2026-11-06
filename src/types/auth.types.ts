
export interface AuthRole {
  id: number;
  code: string;
  name: string;
}

export type AuthLoginMethod = "otp" | "totp" | "backup";

export interface AuthUser {
  email: string;
  full_name: string;
  user_code: string;
  roles: AuthRole[];
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // MFA details
  loginMethods: AuthLoginMethod[];
  backupCodesRemaining: number;
  totpFactorId: number | null;
}


// export interface AuthRole {
//   id: number;
//   code: string;
//   name: string;
// }

// export interface AuthUser {
//   email: string;
//   full_name: string;
//   user_code: string;
//   roles: AuthRole[];
// }

// export interface AuthState {
//   user: AuthUser | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
// }
