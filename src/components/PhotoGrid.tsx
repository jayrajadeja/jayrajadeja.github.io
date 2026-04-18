const PHOTOS = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAw5zO4ohOgo0a4E6GsdS_LagljIzG2b5_LSikdfLWdmPwxo5hMXIJwob8x_bJfyPeHsq25uUEaEUAdntdrWXvGeOw5eJxL-7kk5v9uVCTwsN6qUNMUU-8A46UO1l0kNc0zbw_mNx50owxbCLnj5eVCt65a5i4EilUi4OBWuPasvaz2lMoHQzqAH8lnpW2PRKnhYZE0pIrTIvmTGxrcNB3dV4OFCQjRa1KCfVXZZ7Mw8zZ8hQZmcRFHgQUL_R4KHnfHognh4jK0HRI",
    alt: "Mountain landscape",
    span: "md:col-span-8 md:row-span-2",
    caption: { label: "Location", text: "The Dolomites, North Italy" },
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlxbDGhaJ0AGGXYlUl-8jbK8UQ_PpiPd7zOynEdY3-0rd7o4v9Qg00Po7xQ_NK38SJok1p3JFp5VHCjeyUCz5l-8vypAZ6SiaLArlBWnwPVPAh4oCIR1FdpEqNJKUPQ6tZO0tSL0g9Er17AwgMuueB5-4Q-KAXaQMyj_GmCIi7TNYJoBiHCSVAatDVDvhA9-aKcQzk_sDosZJdPRHwhhdrLeJnjw_DGG-HftKn2kobRzL1dT1eouVqNHZJvwyxi-PwvAnDLTI22M4",
    alt: "Forest in fog",
    span: "md:col-span-4 md:row-span-3",
    caption: { label: "Study", text: "Atmospheric Layers" },
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtE-eQGrcmXixXPPla0SPQCPFmYvjAmzHnYDQsyea-cvr5BYiY-A0Z286P1L9cyxoY7hURmT5lOszU0EZv7eq1CjKz-AYAv9Sh92IiQwvpMymJVFzVw5Q_a_vpAyIiCMsgdtHjNKacZxfcsKACwSbs8wnJsMwWcTcYP664w2NtgUlAQ75AYiBDqt0NDHlAL1z0Y6u9w82Rq-0TA1HPdAwoY_h1kbP9dMlPO965jIeNrNN4Rt9Ymu6bsnglJetZbzqkb0ATaZp5aSg",
    alt: "Brutalist architecture",
    span: "md:col-span-4 md:row-span-1",
    caption: null,
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJVgT8Hu1sNWqXN-Q0_G-LzjAdrG8g_xeFeRIYp2oiIKdCpcBWkCTQ2V8JNLgLA3WzV0r23tDAtqoRok_kdgKJ2DYvKp1AzCAn6ENENzak6fc7GAVEEaMbVMBExej3C9akslkK4HtRDtlxmJPAc6-k7h1iJ6HSE-J0hRIO7MkiTHtSpH4sKdsTtZWlYZEJ_DisL-YW7H25JR3MPcyPEc4pivI79s2t_aP-Y4oFEw-u4Ya4jiANYw21RUAoL2ZASExwLWzbrNUNMF4",
    alt: "Desert canyon",
    span: "md:col-span-4 md:row-span-1",
    caption: null,
  },
];

export default function PhotoGrid() {
  return (
    <section className="mb-32">
      <div className="flex items-baseline gap-4 mb-12">
        <span className="font-headline text-tertiary text-sm font-bold tracking-widest">
          01
        </span>
        <h2 className="font-headline text-4xl font-bold tracking-tight uppercase">
          Photography
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[300px]">
        {PHOTOS.map((photo) => (
          <div
            key={photo.alt}
            className={`${photo.span} group relative overflow-hidden rounded-lg bg-surface-container-low`}
          >
            <img
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
              src={photo.src}
              alt={photo.alt}
            />
            {photo.caption && (
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <span className="font-label text-xs text-tertiary tracking-widest uppercase mb-2">
                  {photo.caption.label}
                </span>
                <p className="font-body text-2xl text-white">
                  {photo.caption.text}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
