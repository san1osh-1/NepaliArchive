/**
 * The immersive centerpiece — a large editorial 'nostalgia' headline in
 * Nepali, sitting at the vertical center of the page while the player
 * rests lower down the screen.
 */
export default function ArchiveCenter() {
  return (
    <div className="pointer-events-none flex flex-col items-center gap-5 px-6 text-center sm:gap-6">
      <p className="font-mono text-[12px] tracking-[0.28em] text-white sm:text-lg sm:tracking-[0.4em]">
        पुराना दिनहरूको सङ्ग्रह
      </p>

      <h1 className="font-display text-[2.5rem] leading-[1.1] font-medium text-cream sm:text-[6rem] sm:leading-[1.05] md:text-[7rem] lg:text-[8rem]">
      नोस्टाल्जिया
      </h1>

      <p className="max-w-md font-sans text-sm leading-relaxed text-cream-dim sm:text-base">
       पुराना नेपाली रेकर्डिङहरूको एउटा शान्त कोठा — क्यासेट युगका लोक तथा पप गीतहरू यहाँ संग्रहित छन्, फेरि–फेरि सुन्नका लागि।

      </p>
    </div>
  )
}
