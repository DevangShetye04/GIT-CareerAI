import { Sparkles, TrendingUp, CheckCircle2 } from "lucide-react";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-paper">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <LogoMark size="sm" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">{title}</h1>
          {subtitle && (
            <p className="font-body text-sm text-ink-soft mt-1.5 mb-8">{subtitle}</p>
          )}
          {!subtitle && <div className="mb-8" />}
          {children}
        </div>
      </div>

      <aside className="lg:w-[44%] xl:w-[42%] bg-ink text-paper flex flex-col justify-center p-10 sm:p-14 lg:min-h-screen">
        <div className="max-w-md mx-auto lg:mx-0">
          <div className="hidden lg:flex mb-10">
            <LogoMark variant="dark" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold leading-tight text-white">
            Your AI-powered career intelligence platform
          </h2>
          <p className="font-body text-sm mt-4 leading-relaxed text-[#C7D2CB]">
            Track ATS scores, discover career paths, and get placement-ready with personalized
            recommendations built for GIT students.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              { icon: Sparkles, text: "AI-matched career recommendations" },
              { icon: TrendingUp, text: "Real-time readiness tracking" },
              { icon: CheckCircle2, text: "Company eligibility insights" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 font-body text-sm text-[#C7D2CB]">
                <span className="w-8 h-8 rounded-lg bg-amber/15 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-amber" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export function LogoMark({ size = "md", variant = "light" }) {
  const isSmall = size === "sm";
  const textClass = variant === "dark" ? "text-white" : "text-ink";
  const subClass = variant === "dark" ? "text-[#8FA096]" : "text-ink-faint";
  return (
    <div className="flex items-center gap-2">
      <div
        className={`${isSmall ? "w-8 h-8" : "w-10 h-10"} rounded-lg flex items-center justify-center bg-amber`}
      >
        <Sparkles size={isSmall ? 16 : 20} color="#2B1D04" />
      </div>
      <div>
        <div className={`font-display font-semibold leading-tight ${textClass} ${isSmall ? "text-sm" : "text-base"}`}>
          GIT CareerAI
        </div>
        <div className={`font-body ${subClass} ${isSmall ? "text-[10px]" : "text-xs"}`}>
          Career Intelligence
        </div>
      </div>
    </div>
  );
}
