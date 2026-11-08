import { useState } from "react";
import { ArrowRight, Phone, ChevronDown } from "lucide-react";
import { CONTACT, waLink } from "../data";
import { WhatsAppIcon } from "./Icons";

/*
 * Première section : volontairement statique (aucune animation, aucune parallaxe)
 * pour un affichage stable sur téléphone comme sur ordinateur.
 */
export default function Hero() {
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
    <section id="accueil" className="hero hero--static">
      <div className="hero__frame">
        <div className="hero__bg">
          <img src="/images/palisade.jpg" alt="Hyundai Palisade bleu nuit présenté par PAULINE VOITURES" />
        </div>
        <div className="hero__shade" />

        <div className="hero__content">
          <p className="eyebrow eyebrow--light">/ Automobile &amp; commerce · Abidjan</p>
          <h1 className="hero__title">
            Votre besoin
            <br />
            automobile, entre
            <br />
            de bonnes mains
          </h1>
          <p className="hero__lead">
            À Yopougon, PAULINE VOITURES étudie votre demande et vous met en relation avec des opportunités adaptées, pour
            les particuliers comme pour les professionnels.
          </p>
          <div className="hero__ctas">
            <a className="btn btn--orange" href={waLink("Bonjour PAULINE VOITURES, ")} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> Nous contacter sur WhatsApp
            </a>
            <a className="btn btn--glass" href={`tel:${CONTACT.phoneIntl}`}>
              <Phone size={15} /> Appeler
            </a>
          </div>
        </div>

        <form className="quick" onSubmit={submit}>
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
                  {p}
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
        </form>
      </div>
    </section>
  );
}
