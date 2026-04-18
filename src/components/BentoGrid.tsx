export default function BentoGrid() {
  return (
    <section className="max-w-7xl mx-auto px-8 mb-48">
      <h2 className="font-headline text-xs uppercase tracking-[0.5em] text-outline mb-16 text-center">
        Intellectual Foundations &amp; Rituals
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[600px]">
        {/* F1 Card */}
        <div className="md:col-span-8 bg-surface-container rounded-sm relative group overflow-hidden">
          <div className="absolute inset-0 opacity-40 group-hover:scale-110 transition-transform duration-1000">
            <img
              alt="F1 Motion"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWCyF0seBO3HAvbc8L5ncF6DeegI7j5_y8JCD8dzkceRzndyZtMnbk0V29KHN-LFRSvHmbRLgsg6_O3LFBKRDIA6vBSR7ADBlU0MkAFwqUs5gA216P2EFQV74aFDBFhis4Krt_0_Kdkheidsh2yz1SAPTk8XgRoxsPpKwPZ4DVGW4O8dRfVBuZVMaHf7CuA4y9rnriH-7TI3j_21VhPtqdIjQpB8EX8pBkzTUyTA9Fj2-8LAwQ7G8mohdsrvBAwnq6ORa3IrYLbKM"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent" />
          <div className="relative p-12 h-full flex flex-col justify-end">
            <span className="font-headline text-primary text-sm mb-4 block tracking-widest uppercase">
              The Machine
            </span>
            <h3 className="font-headline text-4xl font-bold mb-4 tracking-tighter">
              FORMULA 1
            </h3>
            <p className="max-w-md italic text-lg text-on-surface-variant">
              The intersection of extreme engineering, data-driven decisions, and
              human limit testing. A masterclass in performance optimization.
            </p>
          </div>
        </div>

        {/* Finance Card */}
        <div className="md:col-span-4 bg-surface-container-high rounded-sm p-12 flex flex-col justify-between">
          <div>
            <span className="font-headline text-tertiary text-sm mb-4 block tracking-widest uppercase">
              The Market
            </span>
            <h3 className="font-headline text-4xl font-bold mb-4 tracking-tighter">
              FINANCE
            </h3>
          </div>
          <div className="space-y-6">
            <div className="h-[1px] w-full bg-outline-variant/20" />
            <p className="italic text-lg text-on-surface-variant leading-relaxed">
              Understanding the underlying code of global value. Markets are just
              massive distributed systems with high latency.
            </p>
          </div>
        </div>

        {/* Books Card */}
        <div className="md:col-span-4 bg-primary-container rounded-sm p-12 flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <span className="material-symbols-outlined text-[160px]">
              menu_book
            </span>
          </div>
          <div className="relative">
            <span className="font-headline text-primary text-sm mb-4 block tracking-widest uppercase">
              The Archive
            </span>
            <h3 className="font-headline text-4xl font-bold mb-4 tracking-tighter">
              BOOKS
            </h3>
          </div>
          <div className="relative">
            <p className="italic text-lg text-on-surface-variant leading-relaxed">
              Curating a library of thought. From classical philosophy to modern
              technical treatises.
            </p>
          </div>
        </div>

        {/* Tech Card */}
        <div className="md:col-span-8 bg-surface-container rounded-sm relative group overflow-hidden">
          <div className="absolute inset-0 opacity-30 group-hover:scale-105 transition-transform duration-700">
            <img
              alt="Technology Detail"
              className="w-full h-full object-cover grayscale"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwYVPe4JGJICHB67iurcQ0jrBqdJmbKqqSVZfx9EBRYE8O6JI2iin2510qKNfZAyt2l8D14Gu0p8yebA6lVPzUZArlkj3Bktiky_HceO9CjD-sq1sEkTEzbX-RIX3vXchslWeKOMLL5_AGMZPOPOKu4bwplAtCOqNN3Dl_Cg7hnjQmuzgQXzb6sArAR-xxBDpIO7gsy5Wt_nXBydBhxXEtEmgpywDT1hDojUe89xT-6SWpZg1G97f5orplAsK1Kllx89IYULkXENQ"
            />
          </div>
          <div className="relative p-12 h-full flex flex-col justify-center items-center text-center">
            <div className="max-w-xl">
              <span className="font-headline text-tertiary text-sm mb-4 block tracking-widest uppercase">
                The Catalyst
              </span>
              <h3 className="font-headline text-4xl font-bold mb-4 tracking-tighter">
                TECH ETHOS
              </h3>
              <p className="italic text-lg text-on-surface-variant leading-relaxed">
                Building software is an act of literature. Code should be as
                readable as a novel and as efficient as a mechanical watch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
