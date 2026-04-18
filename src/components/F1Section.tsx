export default function F1Section() {
  return (
    <section className="mb-32">
      <div className="flex items-baseline gap-4 mb-12">
        <span className="font-headline text-tertiary text-sm font-bold tracking-widest">
          02
        </span>
        <h2 className="font-headline text-4xl font-bold tracking-tight uppercase">
          Formula 1
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="p-8 bg-surface-container-low rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 font-headline text-surface-container-highest text-6xl font-black select-none">
              AER0
            </div>
            <h3 className="font-headline text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                settings_input_component
              </span>
              Technical Evolutions
            </h3>
            <p className="font-body text-lg text-on-surface-variant leading-relaxed">
              Fascinated by the shift from high-rake concepts to ground-effect
              aerodynamics. Analyzing how venturi tunnels have redefined
              cornering speeds and wheel-to-wheel racing dynamics in the 2022+
              era.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
              <span className="font-label text-sm uppercase tracking-widest text-on-surface-variant">
                Active Research
              </span>
              <span className="font-label text-sm text-tertiary">
                MGU-H Efficiency
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
              <span className="font-label text-sm uppercase tracking-widest text-on-surface-variant">
                Design Interest
              </span>
              <span className="font-label text-sm text-tertiary">
                Suspension Kinematics
              </span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container rounded-lg p-1">
          <div className="relative group">
            <img
              className="w-full aspect-video object-cover rounded-lg"
              alt="F1 car racing at night"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuByP6T7MjHwGQRrdY1WxS0u0tEvFSci5_ARb7C8Xw_tiGqVTwZQSvEfKzh5m_A442tCuDiXwynEGdbanbFB66Kz5weX7ZAi9xAJ2kmNBcolOweVUFFdbNE5fmNE5n_VwBGJp5FUa-YWoogv1Ku83Omvfipkb45ul0laDcohnD2NbZ-Iw6nxgH9qsZzTsvFIMn3OgkrhGweqDzCsedAXR0taGc42fyEMt9CUN5cMZZZq5ue8FhL2JFOpY1wd12VEYH7zULL5shDtGJg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-container/90 to-transparent flex flex-col justify-end p-8">
              <h4 className="font-headline text-3xl font-bold text-white uppercase tracking-tighter">
                Iconic Moments
              </h4>
              <p className="font-body text-on-primary-container/80 text-lg">
                Monaco &apos;84, Spa &apos;00, and the tactical masterclass of
                Hungary &apos;19.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
