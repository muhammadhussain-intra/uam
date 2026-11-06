
"use server";

import "server-only";

import {
  mockUsers,
  userStatistics,
  type User,
} from "../data/mockUsers";

export interface GetUsersResult {
  success: boolean;
  message: string;
  users: User[];
  totalEntries: number;
  statistics: typeof userStatistics;
}

export default async function getUsers(): Promise<GetUsersResult> {
  try {
    return {
      success: true,
      message: "Users retrieved successfully.",
      users: mockUsers,
      totalEntries: 1248,
      statistics: userStatistics,
    };
  } catch {
    return {
      success: false,
      message: "Unable to retrieve users. Please try again.",
      users: [],
      totalEntries: 0,
      statistics: userStatistics,
    };
  }
}
