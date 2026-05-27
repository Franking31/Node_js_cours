"use client";
import { useState, useEffect, useRef } from "react";
import { QuizQuestion, QuizConfig, SubmitAnswer, SubmitResponse, UserProfile } from "@/lib/types";
import LoginPage from "./LoginPage";
import RegisterPage from "./ResgisterPage";
import UploadPhase from "./UploadPhase";
import LoadingPhase from "./LoadingPhase";
import QuizPhase from "./QuizPhase";
import ResultsPhase from "./ResultsPhase";
import DashboardPage from "./DashboardPage";
import AdminPage from "./AdminPage";
import styles from "../modules/QuizApp.module.css";
import landingStyles from "../modules/LandingPage.module.css";
import { API } from "@/lib/config";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

type Phase = "landing" | "login" | "register" | "upload" | "loading" | "submitting" | "quiz" | "results" | "dashboard" | "admin";

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

function LandingPage({ onGoLogin, onGoRegister }: { onGoLogin: () => void; onGoRegister: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
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
    <div className={landingStyles.page}>
      {/* ── Nav ── */}
      <nav className={`${landingStyles.nav} ${mounted ? landingStyles.navVisible : ""}`}>
        <div className={landingStyles.navLogo}>
          <div className={landingStyles.logoIcon}>
            <i className="ti ti-brain" aria-hidden="true" />
          </div>
          <span>QuizAI</span>
        </div>
        <div className={landingStyles.navActions}>
          <button className={landingStyles.btnGhost} onClick={onGoLogin}>
            Se connecter
          </button>
          <button className={landingStyles.btnPrimary} onClick={onGoRegister}>
            Commencer <i className="ti ti-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={landingStyles.hero} ref={heroRef} onMouseMove={handleMouseMove}>
        <div
          className={landingStyles.orbFollow}
          style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
        />
        <div className={landingStyles.orb1} />
        <div className={landingStyles.orb2} />
        <div className={landingStyles.orb3} />
        <div className={landingStyles.grid} />

        <div className={`${landingStyles.heroContent} ${mounted ? landingStyles.heroVisible : ""}`}>
          <div className={landingStyles.badge}>
            <span className={landingStyles.badgeDot} />
            Propulsé par l'IA · Gratuit
          </div>

          <h1 className={landingStyles.heroTitle}>
            Transforme ton cours
            <br />
            <span className={landingStyles.heroTitleAccent}>en quiz intelligent</span>
          </h1>

          <p className={landingStyles.heroSub}>
            Colle ton cours, choisis le nombre de questions et laisse l'IA créer
            un quiz personnalisé en quelques secondes. Apprends mieux, retiens plus.
          </p>

          <div className={landingStyles.heroCtas}>
            <button className={landingStyles.ctaPrimary} onClick={onGoRegister}>
              <i className="ti ti-sparkles" aria-hidden="true" />
              Créer mon premier quiz
            </button>
            <button className={landingStyles.ctaSecondary} onClick={onGoLogin}>
              J'ai déjà un compte
            </button>
          </div>

          <div className={landingStyles.statsRow}>
            {STATS.map((s, i) => (
              <div key={i} className={landingStyles.statItem}>
                <span className={landingStyles.statValue}>
                  {s.value}<span className={landingStyles.statUnit}>{s.unit}</span>
                </span>
                <span className={landingStyles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preview card flottante */}
        <div className={`${landingStyles.previewWrap} ${mounted ? landingStyles.previewVisible : ""}`}>
          <div className={landingStyles.previewCard}>
            <div className={landingStyles.previewHeader}>
              <div className={landingStyles.previewDots}>
                <span /><span /><span />
              </div>
              <span className={landingStyles.previewTitle}>Quiz · Biologie cellulaire</span>
            </div>
            <div className={landingStyles.previewBody}>
              <div className={landingStyles.previewQ}>
                <span className={landingStyles.previewQBadge}>QCM · Q3</span>
                <p>Quel organite est responsable de la synthèse des protéines ?</p>
              </div>
              <div className={landingStyles.previewOptions}>
                {["Mitochondrie", "Ribosome", "Noyau", "Appareil de Golgi"].map((opt, i) => (
                  <div
                    key={i}
                    className={`${landingStyles.previewOption} ${i === 1 ? landingStyles.previewOptionCorrect : ""}`}
                  >
                    <span className={landingStyles.previewLetter}>{["A","B","C","D"][i]}</span>
                    {opt}
                    {i === 1 && <i className="ti ti-check" style={{ marginLeft: "auto" }} aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <div className={landingStyles.previewExplanation}>
                <i className="ti ti-info-circle" aria-hidden="true" />
                Les ribosomes traduisent l'ARNm en chaînes polypeptidiques.
              </div>
            </div>
          </div>

          <div className={landingStyles.scoreBadge}>
            <i className="ti ti-trophy" aria-hidden="true" />
            <div>
              <span className={landingStyles.scoreVal}>16/20</span>
              <span className={landingStyles.scoreSub}>Excellent !</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={landingStyles.features}>
        <div className={landingStyles.sectionHead}>
          <p className={landingStyles.sectionEyebrow}>Comment ça marche</p>
          <h2 className={landingStyles.sectionTitle}>Trois étapes, c'est tout</h2>
        </div>
        <div className={landingStyles.featureGrid}>
          {FEATURES.map((f, i) => (
            <div key={i} className={landingStyles.featureCard}>
              <div className={landingStyles.featureStep}>{i + 1}</div>
              <div className={landingStyles.featureIcon}>
                <i className={`ti ${f.icon}`} aria-hidden="true" />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className={landingStyles.ctaSection}>
        <div className={landingStyles.ctaGlow} />
        <h2 className={landingStyles.ctaTitle}>Prêt à booster ta révision ?</h2>
        <p className={landingStyles.ctaSub}>Inscription gratuite, aucune carte bancaire requise.</p>
        <button className={landingStyles.ctaPrimary} onClick={onGoRegister}>
          <i className="ti ti-sparkles" aria-hidden="true" />
          Commencer gratuitement
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className={landingStyles.footer}>
        <div className={landingStyles.footerLogo}>
          <i className="ti ti-brain" aria-hidden="true" />
          <span>QuizAI</span>
        </div>
        <p>© {new Date().getFullYear()} QuizAI · Tous droits réservés</p>
      </footer>
    </div>
  );
}

export default function QuizApp() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [submitResponse, setSubmitResponse] = useState<SubmitResponse | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      let res = await fetchWithAuth(`${API}/api/auth/me`);

      if (!res.ok) {
        const refreshRes = await fetchWithAuth(`${API}/api/auth/refresh`, { method: "POST" });
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          if (refreshData.accessToken) {
            localStorage.setItem("accessToken", refreshData.accessToken);
          }
          res = await fetchWithAuth(`${API}/api/auth/me`);
        }
      }

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setPhase("upload");
      } else {
        setPhase("landing");
      }
    } catch (err) {
      setPhase("landing");
    } finally {
      setIsLoadingUser(false);
    }
  }

  async function handleLogin(email: string, password: string) {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur de connexion");
    if (data.accessToken) localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
    setPhase("upload");
  }

  async function handleRegister(name: string, email: string, password: string) {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur d'inscription");
    if (data.accessToken) localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
    setPhase("upload");
  }

  async function handleLogout() {
    await fetchWithAuth(`${API}/api/auth/logout`, { method: "POST" });
    localStorage.removeItem("accessToken");
    setUser(null);
    setQuestions([]);
    setQuizId(null);
    setSubmitResponse(null);
    setPhase("landing");
  }

  async function handleGenerate(config: QuizConfig) {
    setPhase("loading");
    try {
      const res = await fetchWithAuth(`${API}/api/quiz/generate`, {
        method: "POST",
        body: JSON.stringify({
          course: {
            title: config.title,
            content: config.content,
            subject: config.subject,
            level: config.level,
          },
          quizConfig: {
            questionCount: config.questionCount,
            selectedTypes: config.selectedTypes,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur de génération");
      setQuizId(data.id);
      setQuestions(
        (data.questions as any[]).map((q) => ({
          id: q.id,
          type: q.type,
          question: q.question,
          options: q.options,
          order: q.order,
        }))
      );
      setSubmitResponse(null);
      setPhase("quiz");
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Erreur de génération.");
      setPhase("upload");
    }
  }

  async function handleQuizFinish(answers: SubmitAnswer[]) {
    if (!quizId) return;
    setPhase("submitting");
    try {
      const res = await fetchWithAuth(`${API}/api/quiz/${quizId}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la correction");

      const qs: any[] = data.questions ?? [];
      const ans: any[] = data.answers ?? [];
      const total = data.questionCount ?? qs.length;

      const results = qs.map((q: any) => {
        const a = ans.find((a: any) => a.questionId === q.id);
        return {
          questionId: q.id,
          question: q.question,
          type: q.type,
          options: q.options ?? [],
          userAnswer: a?.userAnswer ?? "",
          correctAnswer: q.answer,
          explanation: q.explanation,
          isCorrect: a?.isCorrect ?? false,
        };
      });

      const correctCount = results.filter((r) => r.isCorrect).length;
      setSubmitResponse({
        score: correctCount,
        total,
        percentage: Math.round((correctCount / total) * 100),
        results,
      });
      setPhase("results");
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Erreur lors de la soumission.");
      setPhase("quiz");
    }
  }

  function handleRestart() {
    setQuestions([]);
    setQuizId(null);
    setSubmitResponse(null);
    setPhase("upload");
  }

  function handleRetryWrong(wrongIds: string[]) {
    const wrongQuestions = questions.filter((q) => wrongIds.includes(q.id));
    if (wrongQuestions.length === 0) return;
    setQuestions(wrongQuestions);
    setSubmitResponse(null);
    setPhase("quiz");
  }

  /* ── Routing ── */
  if (phase === "landing") {
    return (
      <LandingPage
        onGoLogin={() => setPhase("login")}
        onGoRegister={() => setPhase("register")}
      />
    );
  }
  if (phase === "login") {
    return <LoginPage onLogin={handleLogin} onGoRegister={() => setPhase("register")} />;
  }
  if (phase === "register") {
    return <RegisterPage onRegister={handleRegister} onGoLogin={() => setPhase("login")} />;
  }
  if (phase === "dashboard") {
    return (
      <DashboardPage
        user={user!}
        onUserUpdate={(u) => setUser(u)}
        onBack={() => setPhase("upload")}
        onLogout={handleLogout}
      />
    );
  }
  if (phase === "admin") {
    return (
      <AdminPage
        onBack={() => setPhase("upload")}
        onLogout={handleLogout}
      />
    );
  }

  const stepIndex = ({ upload: 0, loading: 1, submitting: 1, quiz: 2, results: 2 } as Record<string, number>)[phase] ?? -1;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <i className="ti ti-brain" aria-hidden="true" />
        </div>
        <div style={{ flex: 1 }}>
          <h1>QuizAI</h1>
          <p>Générateur de quiz intelligent basé sur ton cours</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.navBtn} onClick={() => setPhase("dashboard")}>
            <i className="ti ti-user-circle" aria-hidden="true" />
            <span>{user?.name ?? "Profil"}</span>
          </button>
          {user?.role === "ADMIN" && (
            <button className={styles.navBtn} onClick={() => setPhase("admin")}>
              <i className="ti ti-shield" aria-hidden="true" />
              <span>Admin</span>
            </button>
          )}
          <button className={`${styles.navBtn} ${styles.navBtnDanger}`} onClick={handleLogout}>
            <i className="ti ti-logout" aria-hidden="true" />
            <span>Déconnexion</span>
          </button>
        </div>
      </header>

      <div className={styles.steps}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${styles.step} ${
              i < stepIndex ? styles.done : i === stepIndex ? styles.active : ""
            }`}
          />
        ))}
      </div>

      {phase === "upload" && <UploadPhase onGenerate={handleGenerate} />}
      {phase === "loading" && <LoadingPhase />}
      {phase === "submitting" && <LoadingPhase />}
      {phase === "quiz" && <QuizPhase questions={questions} onFinish={handleQuizFinish} />}
      {phase === "results" && submitResponse && (
        <ResultsPhase
          response={submitResponse}
          onRestart={handleRestart}
          onRetryWrong={handleRetryWrong}
        />
      )}
    </div>
  );
}