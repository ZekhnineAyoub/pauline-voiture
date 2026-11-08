import {
  motion,
  useInView,
  animate,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { gx as gyroX, gy as gyroY, isTouch } from "./gyro";

export const ease = [0.22, 1, 0.36, 1];

export function Reveal({ children, delay = 0, y = 40, className, as = "div", ...rest }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
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
      viewport={{ once: true, margin: "-60px" }}
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
      duration, ease,
      onUpdate: (v) => { if (ref.current) ref.current.textContent = String(Math.round(v)).padStart(2, "0") + suffix; },
    });
    return () => c.stop();
  }, [inView, to, suffix, duration]);
  return <span ref={ref}>00{suffix}</span>;
}

/* Bouton magnétique */
export function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <span ref={ref} className="magnetic" onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </span>
  );
}

/*
 * Carte inclinée en 3D avec reflet lumineux.
 * - Ordinateur : suit la souris.
 * - Mobile : s'incline avec le défilement, avec le gyroscope du téléphone,
 *   s'enfonce sous le doigt, et passe en état « actif » quand elle est au centre de l'écran.
 */
export function Tilt3D({ children, className = "", max = 12, glare = true, scale = 1.02, style, ...rest }) {
  const ref = useRef(null);
  const [touch] = useState(isTouch);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const px = useMotionValue(50);
  const py = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });
  const s = useSpring(1, { stiffness: 220, damping: 20 });

  // Mobile : inclinaison liée à la position de la carte dans l'écran pendant le défilement
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scrollRot = useTransform(scrollYProgress, [0, 0.5, 1], touch ? [max * 0.9, 0, -max * 0.9] : [0, 0, 0]);
  const sgx = useSpring(gyroX, { stiffness: 90, damping: 20 });
  const sgy = useSpring(gyroY, { stiffness: 90, damping: 20 });
  const k = touch ? max * 0.8 : 0;
  const rotateX = useTransform([srx, scrollRot, sgy], ([a, b, c]) => a + b - c * k);
  const rotateY = useTransform([sry, sgx], ([a, c]) => a + c * k);
  const glareX = useTransform([px, sgx], ([a, c]) => (touch ? 50 + c * 45 : a));
  const glareY = useTransform([py, sgy, scrollYProgress], ([a, c, p]) => (touch ? 100 - p * 100 + c * 30 : a));
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.35), transparent 55%)`;

  // Mobile : la carte au centre de l'écran devient « active » (équivalent du survol)
  const live = useInView(ref, { margin: "-38% 0px -38% 0px" });

  const aim = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    ry.set((x - 0.5) * max * 2);
    rx.set(-(y - 0.5) * max * 2);
    px.set(x * 100);
    py.set(y * 100);
  };
  const onMove = (e) => {
    if (e.pointerType === "touch") return;
    aim(e);
    s.set(scale);
  };
  const onDown = (e) => {
    if (e.pointerType !== "touch") return;
    aim(e);
    s.set(0.97);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    s.set(1);
  };

  return (
    <motion.div
      ref={ref}
      className={`tilt ${touch && live ? "is-live" : ""} ${className}`}
      onPointerMove={onMove}
      onPointerDown={onDown}
      onPointerUp={onLeave}
      onPointerCancel={onLeave}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, scale: s, transformPerspective: 1000, ...style }}
      {...rest}
    >
      {children}
      {glare && <motion.span className="tilt__glare" style={{ background: glareBg }} />}
    </motion.div>
  );
}

/* Apparition 3D : la carte bascule depuis l'arrière-plan */
export function Reveal3D({ children, className, delay = 0, from = "bottom", ...rest }) {
  const initial = {
    bottom: { opacity: 0, rotateX: 35, y: 90, z: -120 },
    left: { opacity: 0, rotateY: 40, x: -80, z: -120 },
    right: { opacity: 0, rotateY: -40, x: 80, z: -120 },
  }[from];
  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, x: 0, y: 0, z: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.1, ease, delay }}
      style={{ transformPerspective: 1200, transformOrigin: from === "bottom" ? "50% 100%" : "50% 50%" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
