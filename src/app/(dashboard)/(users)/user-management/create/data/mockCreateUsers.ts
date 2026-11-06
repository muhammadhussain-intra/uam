
import type { CreateUserFormValues } from "../create-user.schema";

export interface MockCreatedUser extends CreateUserFormValues {
  id: string;
  created_at: string;
}

export function createMockUser(
  values: CreateUserFormValues,
): MockCreatedUser {
  return {
    ...values,
    id: `USR-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
}
