import { useEffect, useState } from "react"

import bg1 from "../assets/bg1.JPG"
import bg2 from "../assets/bg2.JPG"
import bg3 from "../assets/bg3.JPG"
import bg4 from "../assets/bg4.JPG"
import bg5 from "../assets/bg5.JPG"
import bg6 from "../assets/bg6.JPG"
import bg7 from "../assets/bg7.JPG"
import bg8 from "../assets/bg8.JPG"
import bg9 from "../assets/bg9.JPG"
import bg10 from "../assets/bg10.JPG"
import bg11 from "../assets/bg11.JPG"
import bg12 from "../assets/bg12.JPG"
import bg13 from "../assets/bg13.JPG"
import bg14 from "../assets/bg14.JPG"
import bg15 from "../assets/bg15.JPG"
import bg16 from "../assets/bg16.JPG"
import bg17 from "../assets/bg17.JPG"
import bg18 from "../assets/bg18.JPG"
import bg19 from "../assets/bg19.JPG"
import bg20 from "../assets/bg20.JPG"
import bg21 from "../assets/bg21.JPG"
import bg22 from "../assets/bg22.JPG"
import bg23 from "../assets/bg23.JPG"
import bg24 from "../assets/bg24.JPG"
import bg25 from "../assets/bg25.JPG"
import bg26 from "../assets/bg26.JPG"
import bg27 from "../assets/bg27.JPG"
import bg28 from "../assets/bg28.JPG"
import bg29 from "../assets/bg29.JPG"
import bg30 from "../assets/bg30.JPG"
import bg31 from "../assets/bg31.JPG"
import bg32 from "../assets/bg32.JPG"
import bg33 from "../assets/bg33.JPG"
import bg34 from "../assets/bg34.JPG"

const backgrounds = [
  bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10,
  bg11, bg12, bg13, bg14, bg15, bg16, bg17, bg18, bg19, bg20,
  bg21, bg22, bg23, bg24, bg25, bg26, bg27, bg28, bg29, bg30,
  bg31, bg32, bg33, bg34,
]
const ROTATION_INTERVAL_MS = 10000

export default function ArchiveBackdrop() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setActiveIndex((i) => (i + 1) % backgrounds.length),
      ROTATION_INTERVAL_MS,
    )
    return () => clearInterval(id)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-charcoal-deep">
      {backgrounds.map((img, index) => (
        <div
          key={img}
          className={`bg-breathe absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
      {/* Readability overlay — kept translucent so the artwork stays visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-deep/55 via-charcoal-deep/25 to-charcoal-deep/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep/60 via-transparent to-transparent" />
      <div className="grain" />
    </div>
  )
}
