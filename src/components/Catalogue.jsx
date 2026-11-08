import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Phone, X, Maximize2 } from "lucide-react";
import { CATALOGUE, CONTACT, waLink } from "../data";
import { Reveal, SplitWords, Tilt3D, ease } from "./motion";

export default function Catalogue() {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ask = waLink("Bonjour, je souhaite connaître vos disponibilités du moment.");

  return (
    <section className="section" id="catalogue">
      <div className="container">
        <div className="head-row head-row--center">
          <div>
            <Reveal as="p" className="eyebrow">/ Catalogue</Reveal>
            <h2 className="h2">
              <SplitWords text="Des opportunités qui évoluent" />
            </h2>
          </div>
          <Reveal delay={0.2}>
            <a className="btn btn--dark" href={ask} target="_blank" rel="noreferrer">
              Demander les disponibilités <ArrowRight size={15} />
            </a>
          </Reveal>
        </div>

        <div className="cat">
          <Reveal className="cat__card">
            <span className="live">
              <span className="live__dot" /> Mis à jour régulièrement
            </span>
            <h3>Les disponibilités du moment, sur demande</h3>
            <p>
              Les opportunités automobiles varient régulièrement. Indiquez-nous ce que vous recherchez : nous vous
              présentons directement ce qui correspond à votre besoin.
            </p>
            <div className="cat__btns">
              <a className="btn btn--orange" href={ask} target="_blank" rel="noreferrer">
                Demander les disponibilités
              </a>
              <a className="btn btn--outline" href={`tel:${CONTACT.phoneIntl}`}>
                <Phone size={14} /> Appeler
              </a>
            </div>
          </Reveal>

          <div className="cat__grid scene">
            {CATALOGUE.map((c, i) => (
              <motion.div
                key={c.img}
                initial={{ opacity: 0, rotateY: i % 2 ? -90 : 90, z: -200 }}
                whileInView={{ opacity: 1, rotateY: 0, z: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1.1, ease, delay: i * 0.12 }}
                style={{ transformPerspective: 1200, transformOrigin: i % 2 ? "0% 50%" : "100% 50%" }}
              >
                <Tilt3D className="cat__tilt" max={10}>
                  <button className="cat__item" onClick={() => setOpen(i)} aria-label={`Agrandir : ${c.label}`}>
                    <motion.img layoutId={`cat-${i}`} src={c.img} alt={c.label} loading="lazy" />
                    <span className="cat__label">
                      {c.label} <Maximize2 size={13} />
                    </span>
                  </button>
                </Tilt3D>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.figure onClick={(e) => e.stopPropagation()} className="lightbox__fig">
              <motion.img layoutId={`cat-${open}`} src={CATALOGUE[open].img} alt={CATALOGUE[open].label} />
              <motion.figcaption initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <span>{CATALOGUE[open].label}</span>
                <a
                  className="btn btn--orange btn--sm"
                  href={waLink(`Bonjour, je suis intéressé(e) par ce type de véhicule : ${CATALOGUE[open].label}.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ce véhicule m’intéresse <ArrowRight size={14} />
                </a>
              </motion.figcaption>
              <button className="lightbox__close" onClick={() => setOpen(null)} aria-label="Fermer">
                <X size={18} />
              </button>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
