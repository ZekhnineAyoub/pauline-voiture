import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { CONTACT, NAV } from "../data";
import { FacebookIcon, TikTokIcon } from "./Icons";
import { ease } from "./motion";

const Letters = ({ text, className, offset = 0 }) => (
  <span className={className}>
    {text.split("").map((ch, i) => (
      <motion.span
        key={i}
        className="footer__ch"
        variants={{ hidden: { y: "100%", opacity: 0 }, show: { y: "0%", opacity: 1 } }}
        transition={{ duration: 0.8, ease, delay: (offset + i) * 0.035 }}
      >
        {ch}
      </motion.span>
    ))}
  </span>
);

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <motion.h2 className="footer__big" initial="hidden" whileInView="show" viewport={{ once: true }} aria-label="PAULINE VOITURES">
          <Letters text="PAULINE" />
          <span className="footer__sp"> </span>
          <Letters text="VOITURES" className="orange" offset={7} />
        </motion.h2>

        <div className="footer__grid">
          <div>
            <img src="/images/logo.jpg" alt="PAULINE VOITURES" className="footer__logo" loading="lazy" />
            <p className="footer__about">
              Automobile et commerce à Abidjan : écoute, mise en relation et accompagnement personnalisé pour les
              particuliers et les professionnels.
            </p>
            <div className="footer__social">
              <span>Suivez-nous</span>
              <a href="#" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="TikTok">
                <TikTokIcon />
              </a>
            </div>
          </div>
          <div>
            <h4>Navigation</h4>
            {NAV.slice(1).map((n) => (
              <a key={n.id} href={`#${n.id}`}>
                {n.label}
              </a>
            ))}
          </div>
          <div>
            <h4>Contact</h4>
            <a href={`https://wa.me/${CONTACT.whatsappIntl}`} target="_blank" rel="noreferrer">
              WhatsApp : {CONTACT.whatsapp}
            </a>
            <a href={`tel:${CONTACT.phoneIntl}`}>Tél. : {CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </div>
          <div>
            <h4>Nous trouver</h4>
            <p>Yopougon, Abidjan</p>
            <p>Côte d’Ivoire</p>
            <p>{CONTACT.hours}</p>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} PAULINE VOITURES. Tous droits réservés.</span>
          <a href="#accueil" className="footer__top">
            Retour en haut <ArrowUp size={14} />
          </a>
          <span>Yopougon · Abidjan · Côte d’Ivoire</span>
        </div>
      </div>
    </footer>
  );
}
