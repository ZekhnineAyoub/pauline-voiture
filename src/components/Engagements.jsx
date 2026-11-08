import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ENGAGEMENTS, waLink } from "../data";
import { Counter, Reveal, SplitWords, ease } from "./motion";

const SLIDES = [
  { src: "/images/showroom-wide.jpg", alt: "Façade du showroom PAULINE VOITURES" },
  { src: "/images/palisade.jpg", alt: "Hyundai Palisade" },
  { src: "/images/showroom.jpg", alt: "Showroom à Yopougon" },
  { src: "/images/interior.jpg", alt: "Intérieur d’un véhicule" },
  { src: "/images/suv-noir.jpg", alt: "SUV 4x4 noir" },
];
const DURATION = 4500;

/* Position 3D de chaque carte du carrousel selon son écart avec la carte active */
function pose(offset) {
  const abs = Math.abs(offset);
  return {
    x: `${offset * 58}%`,
    z: -abs * 260,
    rotateY: offset * -38,
    scale: 1 - abs * 0.06,
    opacity: abs > 2 ? 0 : 1 - abs * 0.3,
    zIndex: 10 - abs,
    filter: `brightness(${1 - abs * 0.3})`,
  };
}

export default function Engagements() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [drag, setDrag] = useState(0); // décalage pendant le glissement au doigt (-1..1)
  const n = SLIDES.length;
  const go = (d) => setIdx((i) => (i + d + n) % n);

  useEffect(() => {
    if (paused || drag) return;
    const t = setTimeout(() => go(1), DURATION);
    return () => clearTimeout(t);
  }, [idx, paused, drag]);

  return (
    <section id="engagements" className="engage">
      <div className="engage__intro container">
        <h2 className="h2 h2--light center">
          <SplitWords text="Pourquoi nous choisir" />
        </h2>
        <Reveal as="p" className="center engage__sub" delay={0.2}>
          Quatre engagements qui guident chacune de nos relations clients.
        </Reveal>
      </div>

      <motion.div
        className="engage__card container"
        initial={{ opacity: 0, rotateX: 28, y: 120 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.2, ease }}
        style={{ transformPerspective: 1400, transformOrigin: "50% 0%" }}
      >
        <div className="engage__head">
          <div>
            <p className="eyebrow">/ Nos engagements</p>
            <h3 className="h3">Une relation fondée sur la confiance.</h3>
          </div>
          <a className="btn btn--orange" href={waLink("Bonjour, je souhaite prendre rendez-vous.")} target="_blank" rel="noreferrer">
            Demander un rendez-vous <ArrowRight size={15} />
          </a>
        </div>

        <div className="pillars">
          {ENGAGEMENTS.map((e, i) => (
            <motion.div
              key={e.n}
              className="pillar"
              initial={{ opacity: 0, y: 30, rotateX: -60 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease, delay: i * 0.1 }}
              style={{ transformPerspective: 800 }}
            >
              <span className="pillar__n">
                <Counter to={i + 1} />
              </span>
              <h4>{e.title}</h4>
              <p>{e.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="coverflow"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onPan={(_, info) => setDrag(Math.max(-1, Math.min(1, info.offset.x / 220)))}
          onPanEnd={(_, info) => {
            setDrag(0);
            if (Math.abs(info.offset.x) > 40 || Math.abs(info.velocity.x) > 300) go(info.offset.x < 0 ? 1 : -1);
          }}
        >
          {SLIDES.map((s, i) => {
            let off = i - idx;
            if (off > n / 2) off -= n;
            if (off < -n / 2) off += n;
            return (
              <motion.button
                key={s.src}
                className="coverflow__item"
                animate={pose(off + drag)}
                transition={drag ? { duration: 0.15 } : { duration: 0.9, ease }}
                onClick={() => setIdx(i)}
                aria-label={s.alt}
                tabIndex={off === 0 ? 0 : -1}
              >
                <img src={s.src} alt={s.alt} loading="lazy" />
              </motion.button>
            );
          })}
          <button className="coverflow__nav coverflow__nav--l" onClick={() => go(-1)} aria-label="Image précédente">
            <ChevronLeft size={18} />
          </button>
          <button className="coverflow__nav coverflow__nav--r" onClick={() => go(1)} aria-label="Image suivante">
            <ChevronRight size={18} />
          </button>
          <span className="coverflow__hint">Glissez</span>
        </motion.div>
        <div className="bars">
          {SLIDES.map((s, i) => (
            <button key={s.src} className="bar" onClick={() => setIdx(i)} aria-label={`Image ${i + 1}`}>
              <span
                key={`${idx}-${paused}`}
                className={`bar__fill ${i < idx ? "full" : ""} ${i === idx ? (paused ? "hold" : "run") : ""}`}
                style={{ animationDuration: `${DURATION}ms` }}
              />
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
