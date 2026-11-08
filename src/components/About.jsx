import { motion } from "framer-motion";
import { Clock, MapPin, Mail } from "lucide-react";
import { CONTACT } from "../data";
import { Reveal, Reveal3D, SplitWords, Tilt3D } from "./motion";

export default function About() {
  return (
    <section id="apropos" className="section about">
      <div className="container">
        <h2 className="h2 center">
          <SplitWords text="Plus qu’une mise en relation." />{" "}
          <SplitWords className="muted" text="Une relation de confiance." delay={0.25} />
        </h2>
        <Reveal as="p" className="lead center narrow" delay={0.2}>
          Implantée à Yopougon, PAULINE VOITURES accompagne les particuliers et les professionnels d’Abidjan avec écoute,
          sérieux et professionnalisme.
        </Reveal>

        <div className="about__grid scene">
          <div className="about__col">
            <Reveal3D from="left">
              <Tilt3D className="tile tile--img about__car">
                <img src="/images/tucson-front.jpg" alt="Hyundai Tucson bleu nuit" loading="lazy" />
              </Tilt3D>
            </Reveal3D>
            <Reveal3D from="left" delay={0.12} className="fill">
              <Tilt3D className="tile tile--orange" glare={false}>
                <div className="depth">
                  <h3 className="tile__big">Yopougon</h3>
                  <p className="tile__sub">
                    <MapPin size={13} /> Abidjan, Côte d’Ivoire
                  </p>
                </div>
                <a href={`mailto:${CONTACT.email}`} className="tile__mail depth">
                  <Mail size={14} /> {CONTACT.email}
                </a>
              </Tilt3D>
            </Reveal3D>
          </div>

          <Reveal3D delay={0.2} className="fill">
            <Tilt3D className="tile tile--dark" max={8}>
              <img src="/images/logo.jpg" alt="Logo PAULINE VOITURES" className="tile__logo depth" loading="lazy" />
              <h3 className="tile__title depth">Pensé autour de votre besoin</h3>
              <div className="hours depth">
                <span>Horaires</span>
                <span className="hours__clock">
                  <motion.span
                    className="hours__ring"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  />
                  <Clock size={18} />
                </span>
                <span>08 h – 18 h 30</span>
              </div>
              <p className="tile__text">
                Chaque demande commence par une écoute attentive. Nous prenons le temps de comprendre votre usage, vos
                contraintes et vos attentes avant de vous orienter.
              </p>
            </Tilt3D>
          </Reveal3D>

          <Reveal3D from="right" delay={0.3} className="fill about__tall">
            <Tilt3D className="tile tile--img tile--tall">
              <img src="/images/showroom.jpg" alt="Showroom PAULINE VOITURES à Yopougon" loading="lazy" />
              <div className="tile__overlay">
                <h3 className="depth">Une approche humaine, à chaque étape.</h3>
              </div>
            </Tilt3D>
          </Reveal3D>
        </div>
      </div>

      <div className="marquee" aria-hidden>
        <div className="marquee__track">
          {Array.from({ length: 2 }).map((_, k) => (
            <div className="marquee__group" key={k}>
              {["Achat", "Vente", "Reprise", "Financement", "Mise en relation", "Accompagnement", "Particuliers", "Professionnels"].map((w) => (
                <span key={w}>
                  {w} <i>✦</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
