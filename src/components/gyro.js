import { motionValue } from "framer-motion";

/*
 * Source partagée de l'inclinaison du téléphone (gyroscope).
 * gx / gy valent entre -1 et 1. `state.active` passe à true dès qu'un vrai
 * mouvement du téléphone est reçu (sinon on garde l'animation automatique).
 */
export const gx = motionValue(0);
export const gy = motionValue(0);
export const state = { active: false };

export const isTouch = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches;

let started = false;
let base = null;

function onOrientation(e) {
  if (e.gamma == null || e.beta == null) return;
  // On mémorise la position de départ pour que l'inclinaison soit relative à la façon dont on tient le téléphone
  if (!base) base = { beta: e.beta, gamma: e.gamma };
  const clamp = (v) => Math.max(-1, Math.min(1, v));
  gx.set(clamp((e.gamma - base.gamma) / 25));
  gy.set(clamp((e.beta - base.beta) / 25));
  state.active = true;
}

function listen() {
  window.addEventListener("deviceorientation", onOrientation, { passive: true });
}

export function startGyro() {
  if (started || typeof window === "undefined" || !isTouch()) return;
  started = true;
  const DOE = window.DeviceOrientationEvent;
  if (!DOE) return;
  if (typeof DOE.requestPermission === "function") {
    // iOS : l'accès aux capteurs doit être demandé après un geste de l'utilisateur
    const ask = () => {
      DOE.requestPermission()
        .then((r) => r === "granted" && listen())
        .catch(() => {});
    };
    window.addEventListener("touchend", ask, { once: true });
  } else {
    listen();
  }
  // Recalibre quand on revient sur la page
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) base = null;
  });
}
