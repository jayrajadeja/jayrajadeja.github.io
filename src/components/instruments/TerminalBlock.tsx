export default function TerminalBlock({
  title = "jayraj@engineering — zsh",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-outline-variant/30 bg-surface-container-lowest overflow-hidden font-mono text-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-outline-variant/30 bg-surface-container">
        <span aria-hidden="true" className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span aria-hidden="true" className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span aria-hidden="true" className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-outline text-xs">{title}</span>
      </div>
      <div className="p-4 leading-relaxed">{children}</div>
    </div>
  );
}
