
import React from "react";
import type { LucideIcon } from "lucide-react";

export interface AuthFeature {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ReusableLayoutProps {
  title: React.ReactNode;
  description: React.ReactNode;
  features?: AuthFeature[];
  children: React.ReactNode;
}

const ReusableLayout = ({
  title,
  description,
  features = [],
  children,
}: ReusableLayoutProps) => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent">
      <div className="relative z-10 grid min-h-screen grid-cols-1 items-center gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-2 lg:gap-12 lg:px-16 lg:py-10">
        {/* Left content: desktop only */}
        <section className="hidden flex-col justify-center text-white lg:flex">
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.12] tracking-tight lg:text-5xl xl:text-6xl">
            {title}
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-snug text-white/80 xl:text-xl">
            {description}
          </p>

          {features.length > 0 && (
            <div className="mt-7 flex max-w-xl flex-col gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.id}
                    className="flex items-center gap-4"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-action/70 text-white sm:h-14 sm:w-14">
                      <Icon size={26} strokeWidth={1.6} />
                    </div>

                    <div className="h-11 w-px shrink-0 bg-white/70" />

                    <div className="min-w-0">
                      <h2 className="text-base font-medium leading-snug sm:text-lg">
                        {feature.title}
                      </h2>

                      <p className="mt-1 text-sm leading-snug text-white/75 sm:text-base">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Form: full width on mobile, right column on desktop */}
        <section className="flex min-w-0 items-center justify-center">
          <div className="w-full max-w-md">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ReusableLayout;
