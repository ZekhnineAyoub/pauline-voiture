import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Phone, Menu, X } from "lucide-react";
import { NAV, CONTACT, waLink } from "../data";
import { ease } from "./motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("accueil");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <motion.header
      className={`nav ${scrolled ? "nav--scrolled" : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease, delay: 0.2 }}
    >
      <a href="#accueil" className="brand" onClick={() => setOpen(false)}>
        <img src="/images/logo-mark.jpg" alt="" className="brand__mark" />
        <span>
          PAULINE <b>VOITURES</b>
        </span>
      </a>

      <nav className="nav__links" aria-label="Navigation principale">
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`} className={active === n.id ? "is-active" : ""}>
            {active === n.id && (
              <motion.span layoutId="nav-pill" className="nav__pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
            )}
            <span className="nav__label">{n.label}</span>
          </a>
        ))}
      </nav>

      <div className="nav__actions">
        <a href={waLink("Bonjour PAULINE VOITURES, ")} target="_blank" rel="noreferrer" className="btn btn--dark btn--sm hide-sm">
          Nous écrire <ArrowRight size={15} />
        </a>
        <a href={`tel:${CONTACT.phoneIntl}`} className="icon-btn" aria-label="Appeler">
          <Phone size={17} />
        </a>
        <button className="icon-btn icon-btn--ghost show-sm" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav__mobile"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3, ease }}
          >
            {NAV.map((n, i) => (
              <motion.a
                key={n.id}
                href={`#${n.id}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                {n.label} <ArrowRight size={16} />
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
