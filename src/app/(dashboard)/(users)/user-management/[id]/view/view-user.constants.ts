
export const USER_VIEW_MESSAGES = {
  title: "User Details",
  description:
    "View the user's profile information, assigned roles and account configuration.",
  notFound: "User not found.",
};

export const USER_VIEW_ROUTES = {
  list: "/user-management/users-list",
  edit: (id: string | number) =>
    `/user-management/${id}/edit`,
};
