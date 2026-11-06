
"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

import { logoutUser } from "@/actions/auth/logout";
import { clearAuth } from "@/store/slices/authSlice";

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const logoutInProgress = useRef(false);

  const logout = useCallback(async () => {
    if (logoutInProgress.current) return;

    logoutInProgress.current = true;
    setIsLoggingOut(true);

    try {
      // Backend logout is mandatory.
      const response = await logoutUser();

      if (response.status !== "success") {
        toast.error(response.message || "Server logout failed.");
        return;
      }

      // Clear local authentication only after backend confirms success.
      dispatch(clearAuth());

      toast.success(response.message || "Logged out successfully.");

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("[Logout] Server logout failed:", error);

      // Keep Redux and localStorage unchanged.
      toast.error(
        "Unable to logout. Server connection failed. Please try again.",
      );
    } finally {
      logoutInProgress.current = false;
      setIsLoggingOut(false);
    }
  }, [dispatch, router]);

  return {
    logout,
    isLoggingOut,
  };
};

export default useLogout;
