"use client";
import { useEffect, useRef, useState } from "react";
import styles from "../modules/LandingPage.module.css";

interface Props {
  onGoLogin: () => void;
  onGoRegister: () => void;
}

const FEATURES = [
  {
    icon: "ti-upload",
    title: "Importe ton cours",
    desc: "Colle ton texte ou dépose un fichier .txt / .md. L'IA lit et comprend ton contenu en quelques secondes.",
  },
  {
    icon: "ti-brain",
    title: "L'IA génère le quiz",
    desc: "Questions QCM, Vrai/Faux et ouvertes générées automatiquement, adaptées à ton niveau d'études.",
  },
  {
    icon: "ti-chart-bar",
    title: "Analyse tes résultats",
    desc: "Score détaillé, explications pour chaque erreur et possibilité de refaire uniquement les questions ratées.",
  },
];

const STATS = [
  { value: "3", unit: "types", label: "de questions" },
  { value: "30", unit: "max", label: "questions par quiz" },
  { value: "100", unit: "%", label: "basé sur ton cours" },
];

export default function LandingPage({ onGoLogin, onGoRegister }: Props) {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleMouseMove(e: React.MouseEvent) {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <div className={styles.page}>
      {/* ── Nav ── */}
      <nav className={`${styles.nav} ${mounted ? styles.navVisible : ""}`}>
        <div className={styles.navLogo}>
          <div className={styles.logoIcon}>
            <i className="ti ti-brain" aria-hidden="true" />
          </div>
          <span>QuizAI</span>
        </div>
        <div className={styles.navActions}>
          <button className={styles.btnGhost} onClick={onGoLogin}>
            Se connecter
          </button>
          <button className={styles.btnPrimary} onClick={onGoRegister}>
            Commencer <i className="ti ti-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        className={styles.hero}
        ref={heroRef}
        onMouseMove={handleMouseMove}
      >
        {/* Orbs suivant la souris */}
        <div
          className={styles.orbFollow}
          style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
        />

        {/* Orbs statiques */}
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />

        {/* Grille de fond */}
        <div className={styles.grid} />

        <div className={`${styles.heroContent} ${mounted ? styles.heroVisible : ""}`}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Propulsé par l'IA · Gratuit
          </div>

          <h1 className={styles.heroTitle}>
            Transforme ton cours
            <br />
            <span className={styles.heroTitleAccent}>en quiz intelligent</span>
          </h1>

          <p className={styles.heroSub}>
            Colle ton cours, choisis le nombre de questions et laisse l'IA créer
            un quiz personnalisé en quelques secondes. Apprends mieux, retiens plus.
          </p>

          <div className={styles.heroCtas}>
            <button className={styles.ctaPrimary} onClick={onGoRegister}>
              <i className="ti ti-sparkles" aria-hidden="true" />
              Créer mon premier quiz
            </button>
            <button className={styles.ctaSecondary} onClick={onGoLogin}>
              J'ai déjà un compte
            </button>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            {STATS.map((s, i) => (
              <div key={i} className={styles.statItem}>
                <span className={styles.statValue}>{s.value}<span className={styles.statUnit}>{s.unit}</span></span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preview card flottante */}
        <div className={`${styles.previewWrap} ${mounted ? styles.previewVisible : ""}`}>
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <div className={styles.previewDots}>
                <span /><span /><span />
              </div>
              <span className={styles.previewTitle}>Quiz · Biologie cellulaire</span>
            </div>
            <div className={styles.previewBody}>
              <div className={styles.previewQ}>
                <span className={styles.previewQBadge}>QCM · Q3</span>
                <p>Quel organite est responsable de la synthèse des protéines ?</p>
              </div>
              <div className={styles.previewOptions}>
                {["Mitochondrie", "Ribosome", "Noyau", "Appareil de Golgi"].map((opt, i) => (
                  <div
                    key={i}
                    className={`${styles.previewOption} ${i === 1 ? styles.previewOptionCorrect : ""}`}
                  >
                    <span className={styles.previewLetter}>{["A","B","C","D"][i]}</span>
                    {opt}
                    {i === 1 && <i className="ti ti-check" style={{ marginLeft: "auto" }} aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <div className={styles.previewExplanation}>
                <i className="ti ti-info-circle" aria-hidden="true" />
                Les ribosomes traduisent l'ARNm en chaînes polypeptidiques.
              </div>
            </div>
          </div>

          {/* Badge score flottant */}
          <div className={styles.scoreBadge}>
            <i className="ti ti-trophy" aria-hidden="true" />
            <div>
              <span className={styles.scoreVal}>16/20</span>
              <span className={styles.scoreSub}>Excellent !</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.features}>
        <div className={styles.sectionHead}>
          <p className={styles.sectionEyebrow}>Comment ça marche</p>
          <h2 className={styles.sectionTitle}>Trois étapes, c'est tout</h2>
        </div>

        <div className={styles.featureGrid}>
          {FEATURES.map((f, i) => (
            <div key={i} className={styles.featureCard}>
              <div className={styles.featureStep}>{i + 1}</div>
              <div className={styles.featureIcon}>
                <i className={`ti ${f.icon}`} aria-hidden="true" />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow} />
        <h2 className={styles.ctaTitle}>Prêt à booster ta révision ?</h2>
        <p className={styles.ctaSub}>Inscription gratuite, aucune carte bancaire requise.</p>
        <button className={styles.ctaPrimary} onClick={onGoRegister}>
          <i className="ti ti-sparkles" aria-hidden="true" />
          Commencer gratuitement
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>
          <i className="ti ti-brain" aria-hidden="true" />
          <span>QuizAI</span>
        </div>
        <p>© {new Date().getFullYear()} QuizAI · Tous droits réservés</p>
      </footer>
    </div>
  );
}