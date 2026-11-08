import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Phone, Mail, MapPin, Clock, ChevronDown, Check } from "lucide-react";
import { CONTACT, waLink } from "../data";
import { Reveal, Reveal3D, SplitWords, Tilt3D, ease } from "./motion";

const INFOS = [
  { icon: MessageCircle, label: "WhatsApp (prioritaire)", value: CONTACT.whatsapp, href: waLink() },
  { icon: Phone, label: "Téléphone", value: CONTACT.phone, href: `tel:${CONTACT.phoneIntl}` },
  { icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: MapPin, label: "Localisation", value: CONTACT.location },
  { icon: Clock, label: "Horaires", value: CONTACT.hours },
];

export default function Contact() {
  const [f, setF] = useState({ nom: "", profil: "Professionnel", besoin: "", moment: "Le matin" });
  const [sent, setSent] = useState(false);
  const [quick, setQuick] = useState("");
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const msg = [
      "Bonjour PAULINE VOITURES, je souhaite prendre rendez-vous.",
      `Nom : ${f.nom}`,
      `Profil : ${f.profil}`,
      `Besoin : ${f.besoin}`,
      `Moment préféré : ${f.moment}`,
    ].join("\n");
    window.open(waLink(msg), "_blank", "noopener");
    setSent(true);
    setTimeout(() => setSent(false), 3500);
  };

  const submitQuick = (e) => {
    e.preventDefault();
    if (!quick.trim()) return;
    window.open(waLink(`Bonjour PAULINE VOITURES, ${quick.trim()}`), "_blank", "noopener");
    setQuick("");
  };

  return (
    <section id="contact" className="section contact">
      <div className="container contact__grid">
        <div>
          <Reveal as="p" className="eyebrow">/ Contact</Reveal>
          <h2 className="h2 h2--xl">
            <SplitWords text="Parlons de" />
            <br />
            <SplitWords className="muted" text="votre besoin." delay={0.15} />
          </h2>
          <Reveal as="p" className="lead" delay={0.15}>
            Une question, un projet ou l’envie de fixer un rendez-vous ? Écrivez-nous sur WhatsApp : c’est le moyen le
            plus rapide de nous joindre.
          </Reveal>
          <Reveal delay={0.2}>
            <a className="btn btn--dark" href={waLink("Bonjour PAULINE VOITURES, ")} target="_blank" rel="noreferrer">
              Écrire sur WhatsApp <ArrowRight size={15} />
            </a>
          </Reveal>

          <ul className="infos">
            {INFOS.map((it, i) => {
              const Icon = it.icon;
              const Inner = (
                <>
                  <span className="infos__ic">
                    <Icon size={15} />
                  </span>
                  <span>
                    <small>{it.label}</small>
                    <b>{it.value}</b>
                  </span>
                </>
              );
              return (
                <motion.li
                  key={it.label}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease, delay: 0.1 * i }}
                >
                  {it.href ? (
                    <a href={it.href} target={it.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                      {Inner}
                    </a>
                  ) : (
                    <div>{Inner}</div>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </div>

        <motion.div
          className="device"
          initial={{ opacity: 0, y: 80, rotate: 6 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease }}
        >
          <motion.div className="device__float" animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
            <form className="device__screen" onSubmit={submit}>
              <h3>Demande de rendez-vous</h3>
              <p className="device__sub">Votre message s’ouvre directement dans WhatsApp.</p>
              <label>
                <span>Votre nom</span>
                <input required placeholder="Nom et prénom" value={f.nom} onChange={set("nom")} />
              </label>
              <label>
                <span>Vous êtes</span>
                <div className="select select--light">
                  <select value={f.profil} onChange={set("profil")}>
                    <option>Professionnel</option>
                    <option>Particulier</option>
                  </select>
                  <ChevronDown size={15} />
                </div>
              </label>
              <label>
                <span>Votre besoin</span>
                <textarea required rows={3} placeholder="Décrivez votre projet en quelques lignes" value={f.besoin} onChange={set("besoin")} />
              </label>
              <label>
                <span>Moment préféré pour échanger</span>
                <div className="select select--light">
                  <select value={f.moment} onChange={set("moment")}>
                    <option>Le matin</option>
                    <option>Le midi</option>
                    <option>L’après-midi</option>
                    <option>En fin de journée</option>
                  </select>
                  <ChevronDown size={15} />
                </div>
              </label>
              <motion.button whileTap={{ scale: 0.97 }} className="btn btn--orange btn--block" type="submit">
                {sent ? (
                  <>
                    <Check size={15} /> Ouverture de WhatsApp…
                  </>
                ) : (
                  <>
                    Envoyer via WhatsApp <ArrowRight size={15} />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>

      <div className="container promo scene">
        <Reveal3D>
          <Tilt3D className="promo__card" max={7}>
            <img src="/images/banner.jpg" alt="PAULINE VOITURES — L’excellence automobile à Yopougon" loading="lazy" />
          </Tilt3D>
        </Reveal3D>
      </div>

      <div className="container stay">
        <h2 className="h3 center">
          <SplitWords text="Restons en contact." />
        </h2>
        <Reveal as="p" className="center lead">
          Décrivez votre besoin en une phrase, nous vous répondons sur WhatsApp.
        </Reveal>
        <Reveal as="form" className="stay__form" onSubmit={submitQuick} delay={0.15}>
          <input placeholder="Ex. : je cherche un véhicule familial" value={quick} onChange={(e) => setQuick(e.target.value)} aria-label="Votre besoin" />
          <button type="submit" aria-label="Envoyer">
            <ArrowRight size={16} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
