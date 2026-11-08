import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Activities from "./components/Activities";
import Catalogue from "./components/Catalogue";
import Engagements from "./components/Engagements";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { WhatsAppIcon } from "./components/Icons";
import PageTransition from "./components/PageTransition";
import { waLink } from "./data";

function Preloader({ done }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="preloader"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.img
            src="/images/logo.jpg"
            alt=""
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.span className="preloader__bar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, ease: "easeInOut" }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [loaded, setLoaded] = useState(false);
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1100);
    const onScroll = () => setShowFab(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <Preloader done={loaded} />
      <motion.div className="progress" style={{ scaleX: progress }} />
      <PageTransition />
      {loaded && (
        <>
          <Navbar />
          <main>
            <Hero />
            <About />
            <Activities />
            <Catalogue />
            <Engagements />
            <Contact />
          </main>
          <Footer />
        </>
      )}
      <AnimatePresence>
        {showFab && (
          <motion.a
            className="fab"
            href={waLink("Bonjour PAULINE VOITURES, ")}
            target="_blank"
            rel="noreferrer"
            aria-label="Écrire sur WhatsApp"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="fab__ping" />
            <WhatsAppIcon size={24} />
          </motion.a>
        )}
      </AnimatePresence>
    </>
  );
}
