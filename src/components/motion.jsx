import { motion, useInView, animate, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const ease = [0.22, 1, 0.36, 1];

/*
 * Téléphone / tablette tactile ou petit écran : on garde des animations sobres
 * (apparitions douces, retour au toucher) et on coupe les effets qui suivent la souris.
 */
export const isTouch = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches;
export const isSmall = () => typeof window !== "undefined" && window.matchMedia("(max-width: 720px)").matches;
export const isLite = () => isTouch() || isSmall();

export function Reveal({ children, delay = 0, y = 40, className, as = "div", ...rest }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}

/* Titre animé mot par mot */
export function SplitWords({ text, className, delay = 0, stagger = 0.06, as = "span" }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {text.split(" ").map((w, i) => (
        <span key={i} className="word-mask" aria-hidden>
          <motion.span
            className="word"
            variants={{ hidden: { y: "110%", rotate: 4 }, show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease } } }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </M>
  );
}

export function Counter({ to, suffix = "", duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, {
      duration,
      ease,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = String(Math.round(v)).padStart(2, "0") + suffix;
      },
    });
    return () => c.stop();
  }, [inView, to, suffix, duration]);
  return <span ref={ref}>00{suffix}</span>;
}

/* Bouton magnétique (ordinateur uniquement) */
export function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <span ref={ref} className="magnetic" onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </span>
  );
}

/*
 * Carte 3D avec reflet lumineux.
 * - Ordinateur : s'incline en suivant la souris.
 * - Téléphone : reste stable ; un léger enfoncement au toucher, et la carte
 *   au centre de l'écran prend l'apparence « survolée » (zoom photo, flèche…).
 */
export function Tilt3D({ children, className = "", max = 12, glare = true, scale = 1.02, style, ...rest }) {
  const ref = useRef(null);
  const [lite] = useState(isLite);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });
  const s = useSpring(1, { stiffness: 300, damping: 22 });
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.35), transparent 55%)`;
  const live = useInView(ref, { margin: "-40% 0px -40% 0px" });

  if (lite) {
    return (
      <motion.div
        ref={ref}
        className={`tilt tilt--lite ${live ? "is-live" : ""} ${className}`}
        onPointerDown={() => s.set(0.98)}
        onPointerUp={() => s.set(1)}
        onPointerCancel={() => s.set(1)}
        onPointerLeave={() => s.set(1)}
        style={{ scale: s, ...style }}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }

  const onMove = (e) => {
    if (e.pointerType === "touch") return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    gx.set(px * 100);
    gy.set(py * 100);
    s.set(scale);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    s.set(1);
  };

  return (
    <motion.div
      ref={ref}
      className={`tilt ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, scale: s, transformPerspective: 1000, ...style }}
      {...rest}
    >
      {children}
      {glare && <motion.span className="tilt__glare" style={{ background: glareBg }} />}
    </motion.div>
  );
}

/* Apparition 3D : la carte bascule depuis l'arrière-plan (version douce sur téléphone) */
export function Reveal3D({ children, className, delay = 0, from = "bottom", ...rest }) {
  const [lite] = useState(isLite);
  const initial = lite
    ? { opacity: 0, y: 40, rotateX: 12 }
    : {
        bottom: { opacity: 0, rotateX: 35, y: 90, z: -120 },
        left: { opacity: 0, rotateY: 40, x: -80, z: -120 },
        right: { opacity: 0, rotateY: -40, x: 80, z: -120 },
      }[from];
  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, x: 0, y: 0, z: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: lite ? 0.8 : 1.1, ease, delay: lite ? Math.min(delay, 0.15) : delay }}
      style={{ transformPerspective: 1200, transformOrigin: from === "bottom" || lite ? "50% 100%" : "50% 50%" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
