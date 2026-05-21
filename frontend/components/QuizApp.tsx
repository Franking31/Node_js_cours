"use client";
import { useState, useEffect } from "react";
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

const API = "http://localhost:3000";

type Phase = "login" | "register" | "upload" | "loading" | "submitting" | "quiz" | "results" | "dashboard" | "admin";

export default function QuizApp() {
  const [phase, setPhase] = useState<Phase>("login");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [submitResponse, setSubmitResponse] = useState<SubmitResponse | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  /* ── Vérifier si l'utilisateur est déjà connecté au montage ── */

  useEffect(() => {
    checkAuth();
  }, []);

 async function checkAuth() {
  try {
    let res = await fetch(`${API}/api/auth/me`, { credentials: "include" });

    if (!res.ok) {
      // Tentative de refresh
      const refreshRes = await fetch(`${API}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshRes.ok) {
        res = await fetch(`${API}/api/auth/me`, { credentials: "include" });
      }
    }

    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      setPhase("upload");
    } else {
      setPhase("login");
    }
  } catch (err) {
    setPhase("login");
  } finally {
    setIsLoadingUser(false);
  }
}

  /* ── Auth ── */
  async function handleLogin(email: string, password: string) {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur de connexion");
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
    setUser(data.user);
    setPhase("upload");
  }

  async function handleLogout() {
    await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" });
    setUser(null);
    setQuestions([]);
    setQuizId(null);
    setSubmitResponse(null);
    setPhase("login");
  }

  /* ── Génération du quiz ── */
  async function handleGenerate(config: QuizConfig) {
    setPhase("loading");
    try {
      const res = await fetch(`${API}/api/quiz/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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

      // Le backend renvoie { id, questions: [...] }
      // Les questions n'ont PAS de champ answer/explanation
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
      alert(e.message || "Erreur de génération. Vérifie que ton cours contient suffisamment de contenu.");
      setPhase("upload");
    }
  }

  /* ── Soumission des réponses au backend ── */
  async function handleQuizFinish(answers: SubmitAnswer[]) {
  if (!quizId) return;
  setPhase("submitting");
  try {
    const res = await fetch(`${API}/api/quiz/${quizId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ answers }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur lors de la correction");

    // Le backend renvoie le quiz complet avec questions[] + answers[]
    // On reconstruit la structure SubmitResponse attendue par ResultsPhase
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

  /* ── Retry les mauvaises réponses ── */
  function handleRetryWrong(wrongIds: string[]) {
    const wrongQuestions = questions.filter((q) => wrongIds.includes(q.id));
    if (wrongQuestions.length === 0) return;
    setQuestions(wrongQuestions);
    setSubmitResponse(null);
    setPhase("quiz");
  }

  /* ── Pages auth / dashboard / admin ── */
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

  /* ── Steps bar ── */
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
      {phase === "quiz" && (
        <QuizPhase questions={questions} onFinish={handleQuizFinish} />
      )}
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