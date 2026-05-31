export default function StatusDot({
  children,
  color = "up",
}: {
  children: React.ReactNode;
  color?: "up" | "primary" | "tertiary";
}) {
  const c = color === "primary" ? "bg-primary" : color === "tertiary" ? "bg-tertiary" : "bg-up";
  return (
    <span className="inline-flex items-center gap-2 font-mono text-sm">
      <span className={`w-2 h-2 rounded-full ${c}`} />
      {children}
    </span>
  );
}
