import { useEffect, useRef, useState } from "react";
import { gx, gy, isTouch, startGyro, state } from "./gyro";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Phone, ChevronDown } from "lucide-react";
import { CONTACT, waLink } from "../data";
import { ease, Magnetic } from "./motion";
import { WhatsAppIcon } from "./Icons";

const TITLE = ["Votre besoin", "automobile, entre", "de bonnes mains"];

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  // Parallaxe 3D à la souris : l'image et le texte bougent en sens opposé
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const bgX = useTransform(mx, (v) => v * -24);
  const bgY = useTransform(my, (v) => v * -16);
  const bgRotY = useTransform(mx, (v) => v * 4);
  const bgRotX = useTransform(my, (v) => v * -3);
  const txtRotY = useTransform(mx, (v) => v * 6);
  const txtRotX = useTransform(my, (v) => v * -5);
  const onPointerMove = (e) => {
    if (e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onPointerLeave = () => {
    if (isTouch()) return;
    mx.set(0);
    my.set(0);
  };

  // Mobile : parallaxe pilotée par le gyroscope, et un léger mouvement automatique
  // tant que le téléphone n'envoie pas de données de mouvement.
  useEffect(() => {
    if (!isTouch()) return;
    startGyro();
    let t = 0;
    let raf;
    const tick = () => {
      t += 0.012;
      if (state.active) {
        mx.set(gx.get() * 1.4);
        my.set(gy.get() * 1.4);
      } else {
        mx.set(Math.sin(t) * 0.7);
        my.set(Math.cos(t * 0.8) * 0.45);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mx, my]);

  // Le cadre du hero bascule en 3D quand on le quitte en défilant (ordinateur et mobile)
  const frameRotX = useTransform(scrollYProgress, [0, 1], [0, 14]);
  const frameScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const frameRadius = useTransform(scrollYProgress, [0, 1], [22, 40]);

  const [profil, setProfil] = useState("Professionnel");
  const [form, setForm] = useState({ besoin: "Autre demande", vehicule: "", echeance: "Dès que possible", budget: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const msg = [
      "Bonjour PAULINE VOITURES,",
      `Profil : ${profil}`,
      `Besoin : ${form.besoin}`,
      form.vehicule && `Véhicule / usage : ${form.vehicule}`,
      `Échéance : ${form.echeance}`,
      form.budget && `Budget indicatif : ${form.budget}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(waLink(msg), "_blank", "noopener");
  };

  return (
    <section id="accueil" className="hero" ref={ref}>
      <motion.div
        className="hero__frame"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ rotateX: frameRotX, scale: frameScale, borderRadius: frameRadius, transformPerspective: 1400, transformOrigin: "50% 0%" }}
      >
        <motion.div className="hero__bg" style={{ y: imgY, scale: imgScale }}>
          <motion.div
            className="hero__bg3d"
            style={{ x: bgX, y: bgY, rotateY: bgRotY, rotateX: bgRotX, transformPerspective: 1200 }}
          >
            <motion.img
              src="/images/palisade.jpg"
              alt="Hyundai Palisade bleu nuit présenté par PAULINE VOITURES"
              initial={{ scale: 1.25, filter: "blur(8px)" }}
              animate={{ scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 2.2, ease }}
            />
          </motion.div>
        </motion.div>
        <div className="hero__shade" />
        <motion.div
          className="hero__glow"
          animate={{ opacity: [0.35, 0.65, 0.35], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="hero__content"
          style={{ y: contentY, rotateY: txtRotY, rotateX: txtRotX, transformPerspective: 1000, transformOrigin: "0% 50%" }}
        >
          <motion.p
            className="eyebrow eyebrow--light"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease }}
          >
            / Automobile &amp; commerce · Abidjan
          </motion.p>
          <h1 className="hero__title">
            {TITLE.map((line, i) => (
              <span key={i} className="line-mask">
                <motion.span
                  className="line"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.1, ease, delay: 0.6 + i * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="hero__lead"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8, ease }}
          >
            À Yopougon, PAULINE VOITURES étudie votre demande et vous met en relation avec des opportunités adaptées, pour
            les particuliers comme pour les professionnels.
          </motion.p>
          <motion.div
            className="hero__ctas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.8, ease }}
          >
            <Magnetic>
              <a className="btn btn--orange" href={waLink("Bonjour PAULINE VOITURES, ")} target="_blank" rel="noreferrer">
                <WhatsAppIcon /> Nous contacter sur WhatsApp
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn btn--glass" href={`tel:${CONTACT.phoneIntl}`}>
                <Phone size={15} /> Appeler
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.form
          className="quick"
          onSubmit={submit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.45, duration: 1, ease }}
        >
          <div className="quick__top">
            <div className="seg" role="tablist">
              {["Particulier", "Professionnel"].map((p) => (
                <button
                  type="button"
                  key={p}
                  role="tab"
                  aria-selected={profil === p}
                  onClick={() => setProfil(p)}
                  className={profil === p ? "on" : ""}
                >
                  {profil === p && (
                    <motion.span layoutId="seg" className="seg__bg" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                  )}
                  <span>{p}</span>
                </button>
              ))}
            </div>
            <p className="quick__hint">Décrivez votre besoin, nous vous répondons sur WhatsApp.</p>
          </div>
          <div className="quick__fields">
            <label>
              <span>Votre besoin</span>
              <div className="select">
                <select value={form.besoin} onChange={set("besoin")}>
                  <option>Autre demande</option>
                  <option>Achat de véhicule</option>
                  <option>Vente de véhicule</option>
                  <option>Reprise</option>
                  <option>Financement</option>
                </select>
                <ChevronDown size={15} />
              </div>
            </label>
            <label>
              <span>Véhicule ou usage</span>
              <input placeholder="Marque, modèle, usage..." value={form.vehicule} onChange={set("vehicule")} />
            </label>
            <label>
              <span>Échéance</span>
              <div className="select">
                <select value={form.echeance} onChange={set("echeance")}>
                  <option>Dès que possible</option>
                  <option>Dans le mois</option>
                  <option>Dans 3 mois</option>
                  <option>Je me renseigne</option>
                </select>
                <ChevronDown size={15} />
              </div>
            </label>
            <label>
              <span>Budget indicatif</span>
              <input placeholder="Facultatif" value={form.budget} onChange={set("budget")} />
            </label>
            <button className="btn btn--orange quick__send" type="submit">
              Envoyer <ArrowRight size={15} />
            </button>
          </div>
        </motion.form>
      </motion.div>
    </section>
  );
}
