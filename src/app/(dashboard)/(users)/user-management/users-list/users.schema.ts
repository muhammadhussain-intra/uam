
import { z } from "zod";

export const usersFilterSchema = z
  .object({
    search: z
      .string()
      .trim()
      .max(100, "Search must not exceed 100 characters"),

    role: z.enum([
      "all",
      "Admin",
      "Teacher",
      "Staff",
      "Student",
    ]),

    status: z.enum([
      "all",
      "Active",
      "Inactive",
      "Pending",
    ]),

    fromDate: z.string(),

    toDate: z.string(),
  })
  .refine(
    (values) => {
      if (!values.fromDate || !values.toDate) {
        return true;
      }

      return new Date(values.fromDate) <= new Date(values.toDate);
    },
    {
      message: "To date must be after or equal to from date",
      path: ["toDate"],
    },
  );

export type UsersFilterValues = z.infer<typeof usersFilterSchema>;
