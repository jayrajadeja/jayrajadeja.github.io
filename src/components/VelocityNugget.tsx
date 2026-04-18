import type { VelocityNugget as VelocityNuggetType } from "@/lib/types";

export default function VelocityNugget({
  nugget,
  showBorder = false,
}: {
  nugget: VelocityNuggetType;
  showBorder?: boolean;
}) {
  return (
    <div
      className={`p-8 bg-surface-container-low rounded-sm relative overflow-hidden group ${
        showBorder ? "border-l border-primary/20" : ""
      }`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <span className="material-symbols-outlined text-6xl text-tertiary">
          {nugget.icon}
        </span>
      </div>
      <span className="font-headline text-[10px] font-bold text-tertiary uppercase tracking-widest mb-4 block">
        Velocity Nugget {nugget.number}
      </span>
      <h3 className="font-body text-2xl text-on-surface leading-snug">
        {nugget.title}
      </h3>
      <p className="font-body text-on-surface-variant mt-3 text-sm italic">
        &ldquo;{nugget.quote}&rdquo;
      </p>
    </div>
  );
}
