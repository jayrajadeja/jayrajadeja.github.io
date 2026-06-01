import Eyebrow from "./Eyebrow";

export default function SectionHeader({
  eyebrow,
  id,
  children,
}: {
  eyebrow: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-4 border-b border-outline-variant/30 pb-4 mb-8">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="font-headline text-2xl md:text-3xl font-bold tracking-tight">
        {children}
      </h2>
    </div>
  );
}
