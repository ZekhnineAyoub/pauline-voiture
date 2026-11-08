import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ACTIVITIES, waLink } from "../data";
import { Reveal, Reveal3D, SplitWords, Tilt3D, ease } from "./motion";

export default function Activities() {
  const ctaRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: ctaRef, offset: ["start end", "end start"] });
  const rotA = useTransform(scrollYProgress, [0, 0.5, 1], [-18, -6, 4]);
  const rotB = useTransform(scrollYProgress, [0, 0.5, 1], [18, 6, -4]);
  const lift = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="activites" className="section">
      <div className="container">
        <div className="head-row">
          <div>
            <Reveal as="p" className="eyebrow">/ Nos activités</Reveal>
            <h2 className="h2">
              <SplitWords text="Des solutions" />
              <br />
              <SplitWords className="muted" text="adaptées à chaque besoin." delay={0.15} />
            </h2>
          </div>
          <Reveal as="p" className="head-row__text" delay={0.2}>
            Nous intervenons dans l’automobile et le commerce, en identifiant des opportunités et en facilitant la mise en
            relation avec les bons interlocuteurs.
          </Reveal>
        </div>

        <div className="acts scene">
          {ACTIVITIES.map((a, i) => (
            <Reveal3D key={a.n} delay={i * 0.1}>
              <Tilt3D className="act" max={14}>
                <img src={a.img} alt="" loading="lazy" />
                <div className="act__shade" />
                <div className="act__body depth">
                  <span className="act__n">{a.n}</span>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </div>
                <span className="act__arrow depth">
                  <ArrowRight size={16} />
                </span>
              </Tilt3D>
            </Reveal3D>
          ))}
        </div>

        <motion.div
          ref={ctaRef}
          className="cta"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease }}
        >
          <div className="cta__text">
            <p className="cta__kicker">Particuliers &amp; professionnels</p>
            <h2>Un projet automobile en tête ?</h2>
            <p>Parlez-nous de votre besoin : nous l’étudions avec vous et revenons vers vous avec des pistes adaptées.</p>
            <a className="btn btn--white" href={waLink("Bonjour, j'ai un projet automobile : ")} target="_blank" rel="noreferrer">
              Écrire sur WhatsApp <ArrowRight size={15} />
            </a>
          </div>
          <div className="cta__stage">
            {[
              { src: "/images/bmw-x5.jpg", rot: rotA, cls: "cta__card--a", alt: "BMW X5 blanc" },
              { src: "/images/bmw-serie5.jpg", rot: rotB, cls: "cta__card--b", alt: "BMW Série 5 noire" },
            ].map((c) => (
              <motion.div key={c.src} className={`cta__card ${c.cls}`} style={{ rotateY: c.rot, y: lift, transformPerspective: 900 }}>
                <img src={c.src} alt={c.alt} loading="lazy" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
