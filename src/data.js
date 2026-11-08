export const CONTACT = {
  whatsapp: "05 75 85 72 74",
  whatsappIntl: "2250575857274",
  phone: "07 59 97 04 52",
  phoneIntl: "+2250759970452",
  email: "prunellevoitures@gmail.com",
  location: "Yopougon, Abidjan",
  hours: "De 08 h à 18 h 30",
};

export const waLink = (text = "") =>
  `https://wa.me/${CONTACT.whatsappIntl}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const NAV = [
  { id: "accueil", label: "Accueil" },
  { id: "apropos", label: "À propos" },
  { id: "activites", label: "Activités" },
  { id: "engagements", label: "Engagements" },
  { id: "contact", label: "Contact" },
];

export const ACTIVITIES = [
  { n: "01", title: "Étude du besoin", text: "Nous écoutons votre demande et clarifions avec vous vos priorités.", img: "/images/landcruiser.jpg" },
  { n: "02", title: "Opportunités", text: "Nous identifions des opportunités automobiles en lien avec votre projet.", img: "/images/elantra.jpg" },
  { n: "03", title: "Mise en relation", text: "Nous facilitons le contact entre clients potentiels et interlocuteurs.", img: "/images/suv-noir.jpg" },
  { n: "04", title: "Accompagnement", text: "Nous restons disponibles pour vous orienter à chaque étape.", img: "/images/tucson-rear.jpg" },
];

export const CATALOGUE = [
  { img: "/images/palisade.jpg", label: "Hyundai Palisade" },
  { img: "/images/landcruiser.jpg", label: "Toyota Land Cruiser" },
  { img: "/images/elantra.jpg", label: "Hyundai Elantra" },
  { img: "/images/suv-noir.jpg", label: "SUV 4x4 noir" },
];

export const ENGAGEMENTS = [
  { n: "01", title: "Écoute attentive", text: "Nous prenons le temps de comprendre votre besoin avant toute proposition." },
  { n: "02", title: "Accompagnement personnalisé", text: "Un suivi adapté à votre situation, particulier ou professionnel." },
  { n: "03", title: "Sérieux", text: "Des échanges clairs et une démarche rigoureuse à chaque étape." },
  { n: "04", title: "Relation de confiance", text: "Nous construisons avec vous des relations durables et sincères." },
];
