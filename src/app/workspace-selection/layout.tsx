import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-page">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/auth/auth-bg.webp')",
        }}
        aria-hidden="true"
      />

      {/* Theme-based Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, color-mix(in srgb, var(--primary) 92%, transparent) 0%, color-mix(in srgb, var(--primary) 72%, transparent) 42%, color-mix(in srgb, var(--action) 32%, transparent) 72%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Page Content */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;