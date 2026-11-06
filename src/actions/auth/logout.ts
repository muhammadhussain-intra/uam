import axiosInstance from "@/lib/axiosInstance";

export const logoutUser = async () => {
  const response = await axiosInstance.post("/auth/logout");

  return response.data;
};