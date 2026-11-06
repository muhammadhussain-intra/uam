
import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description: string;
  icon: ReactNode;
  step: string;
  children: ReactNode;
}

export default function FormSection({
  title,
  description,
  icon,
  step,
  children,
}: FormSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border-default bg-white shadow-sm">
      <div className="flex items-start gap-4 border-b border-border-default px-5 py-5 sm:px-6">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-green-light text-primary">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-text-primary">
              {title}
            </h2>

            <span className="rounded-full bg-subtle px-2.5 py-0.5 text-[11px] font-medium text-text-secondary">
              Step {step}
            </span>
          </div>

          <p className="mt-1 text-sm text-text-secondary">
            {description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-6">
        {children}
      </div>
    </section>
  );
}
