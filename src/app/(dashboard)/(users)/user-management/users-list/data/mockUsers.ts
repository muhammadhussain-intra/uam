
export type UserStatus = "Active" | "Inactive" | "Pending";

export type UserRole = "Admin" | "Teacher" | "Staff" | "Student";

export interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
  program: string;
  role: UserRole;
  facility: string;
  status: UserStatus;
  security: "MFA" | "None";
  deviceBinding: "Bound" | "None";
}

export const mockUsers: User[] = [
  {
    id: "01",
    name: "Abdul Rehman",
    email: "abdul.rehman@example.com",
    userType: "Admin",
    program: "Program A",
    role: "Admin",
    facility: "Region 1",
    status: "Active",
    security: "MFA",
    deviceBinding: "Bound",
  },
  {
    id: "02",
    name: "Sara Khan",
    email: "sara.khan@example.com",
    userType: "Teacher",
    program: "Program B",
    role: "Teacher",
    facility: "District 2",
    status: "Active",
    security: "MFA",
    deviceBinding: "Bound",
  },
  {
    id: "03",
    name: "Ali Hussain",
    email: "ali.hussain@example.com",
    userType: "Admin",
    program: "Program A",
    role: "Admin",
    facility: "Region 1",
    status: "Active",
    security: "None",
    deviceBinding: "None",
  },
  {
    id: "04",
    name: "Zara Malik",
    email: "zara.malik@example.com",
    userType: "Staff",
    program: "Program C",
    role: "Staff",
    facility: "District 4",
    status: "Inactive",
    security: "None",
    deviceBinding: "None",
  },
  {
    id: "05",
    name: "Hamza Siddiqui",
    email: "hamza.siddiqui@example.com",
    userType: "Teacher",
    program: "Program A",
    role: "Teacher",
    facility: "Region 1",
    status: "Active",
    security: "MFA",
    deviceBinding: "Bound",
  },
  {
    id: "06",
    name: "Ayesha Noor",
    email: "ayesha.noor@example.com",
    userType: "Student",
    program: "Program B",
    role: "Student",
    facility: "Taluka 3",
    status: "Active",
    security: "MFA",
    deviceBinding: "None",
  },
  {
    id: "07",
    name: "Usman Ali",
    email: "usman.ali@example.com",
    userType: "Staff",
    program: "Program C",
    role: "Staff",
    facility: "Region 2",
    status: "Pending",
    security: "None",
    deviceBinding: "None",
  },
  {
    id: "08",
    name: "Hina Ahmed",
    email: "hina.ahmed@example.com",
    userType: "Teacher",
    program: "Program A",
    role: "Teacher",
    facility: "District 1",
    status: "Active",
    security: "MFA",
    deviceBinding: "Bound",
  },
  {
    id: "09",
    name: "Bilal Shah",
    email: "bilal.shah@example.com",
    userType: "Student",
    program: "Program B",
    role: "Student",
    facility: "Taluka 5",
    status: "Inactive",
    security: "None",
    deviceBinding: "None",
  },
  {
    id: "10",
    name: "Mariam Khan",
    email: "mariam.khan@example.com",
    userType: "Admin",
    program: "Program C",
    role: "Admin",
    facility: "Region 3",
    status: "Active",
    security: "MFA",
    deviceBinding: "Bound",
  },
];

export const userStatistics = {
  totalUsers: {
    value: 1248,
    change: 12,
  },
  activeUsers: {
    value: 1106,
    change: 8,
  },
  deviceBound: {
    value: 864,
    change: 5,
  },
  mfaEnabled: {
    value: 736,
    change: 18,
  },
};
