
export const ROLE_OPTIONS = [
  {
    value: 1,
    label: "Administrator",
    description: "Administrative access",
  },
  {
    value: 2,
    label: "Program Manager",
    description: "Program-level access",
  },
  {
    value: 3,
    label: "Data Entry Operator",
    description: "Data entry access",
  },
];

export const INITIAL_USER_FORM = {
  full_name: "",
  email: "",
  username: "",
  program_id: "",
  role_ids: [] as number[],
  is_active: true,
};
