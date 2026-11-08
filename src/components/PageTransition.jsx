import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { NAV } from "../data";

const LABELS = { ...Object.fromEntries(NAV.map((n) => [n.id, n.label])), catalogue: "Catalogue" };
const PANELS = 5;
const curve = [0.76, 0, 0.24, 1];

/*
 * Transition « entre les pages » : chaque lien interne (#section) déclenche un rideau
 * de panneaux qui recouvre l'écran, on se déplace vers la section pendant qu'il est fermé,
 * puis le rideau se lève sur la nouvelle « page ».
 */
export default function PageTransition() {
  const [phase, setPhase] = useState(null); // null | "in" | "out"
  const [label, setLabel] = useState("");
  const target = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      const el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.scrollIntoView();
        return;
      }
      target.current = id;
      setLabel(LABELS[id] || "");
      setPhase("in");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const onCovered = () => {
    const el = document.getElementById(target.current);
    if (el) {
      const top = target.current === "accueil" ? 0 : el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "instant" });
      history.replaceState(null, "", `#${target.current}`);
    }
    setTimeout(() => setPhase("out"), 380);
  };

  if (!phase) return null;

  return (
    <div className="pt" aria-hidden>
      {Array.from({ length: PANELS }).map((_, i) => (
        <motion.span
          key={i}
          className="pt__panel"
          initial={{ scaleY: 0, originY: 1 }}
          animate={phase === "in" ? { scaleY: 1, originY: 1 } : { scaleY: 0, originY: 0 }}
          transition={{ duration: 0.55, ease: curve, delay: (phase === "in" ? i : PANELS - 1 - i) * 0.05 }}
          onAnimationComplete={() => {
            if (i !== PANELS - 1) return;
            if (phase === "in") onCovered();
            else setPhase(null);
          }}
        />
      ))}
      <motion.div
        className="pt__label"
        initial={{ opacity: 0, y: 40, rotateX: -70 }}
        animate={phase === "in" ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: -40, rotateX: 70 }}
        transition={{ duration: 0.5, ease: curve, delay: phase === "in" ? 0.3 : 0 }}
        style={{ transformPerspective: 800 }}
      >
        <img src="/images/logo-mark.jpg" alt="" />
        <span>{label}</span>
      </motion.div>
    </div>
  );
}
