export default function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs uppercase tracking-[0.3em] text-tertiary">
      {children}
    </span>
  );
}
