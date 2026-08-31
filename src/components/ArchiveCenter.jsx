/**
 * The immersive centerpiece — a large editorial 'nostalgia' headline in
 * Nepali, sitting at the vertical center of the page while the player
 * rests lower down the screen.
 */
export default function ArchiveCenter() {
  return (
    <div className="pointer-events-none flex flex-col items-center gap-6 px-6 text-center">
      <p className="font-mono text-[30px] tracking-[0.4em] text-white sm:text-lg">
        पुराना दिनहरूको सङ्ग्रह
      </p>

      <h1 className="font-display text-[4rem] leading-[1.05] font-medium text-cream sm:text-[7rem] md:text-[9rem]">
      नोस्टाल्जिया
      </h1>

      <p className="max-w-md font-sans text-sm leading-relaxed text-cream-dim sm:text-base">
       पुराना नेपाली रेकर्डिङहरूको एउटा शान्त कोठा — क्यासेट युगका लोक तथा पप गीतहरू यहाँ संग्रहित छन्, फेरि–फेरि सुन्नका लागि।

      </p>
    </div>
  )
}
