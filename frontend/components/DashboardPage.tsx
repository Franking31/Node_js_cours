"use client";
import { useState, useEffect } from "react";
import { UserProfile, QuizHistoryItem, QuestionType } from "@/lib/types";
import styles from "../modules/DashboardPage.module.css";
import { API } from "@/lib/config";

interface Props {
  user: UserProfile;
  onUserUpdate: (u: UserProfile) => void;
  onBack: () => void;
  onLogout: () => void;
}

type Tab = "profile" | "history";

const LETTERS = ["A", "B", "C", "D"];

export default function DashboardPage({ user, onUserUpdate, onBack, onLogout }: Props) {
  const [tab, setTab] = useState<Tab>("profile");

  /* ── Profil ── */
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /* ── Historique ── */
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizHistoryItem | null>(null);
  /* ── Charger l'historique au montage ── */
  useEffect(() => {
    if (tab === "history") fetchHistory();
  }, [tab]);

  async function fetchHistory() {
    setHistoryLoading(true);
    try {
      const res = await fetch(`${API}/api/quiz/me`, { credentials: "include" });
      const data = await res.json();
      if (res.ok) setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setHistoryLoading(false);
    }
  }

  /* ── Sauvegarder le profil ── */
  async function handleSave() {
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      const body: any = { name, email };
      if (newPassword.trim()) body.password = newPassword;

      const res = await fetch(`${API}/api/user/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onUserUpdate({ ...user, name: data.user.name, email: data.user.email });
      setNewPassword("");
      setProfileMsg({ type: "ok", text: "Profil mis à jour avec succès ✓" });
    } catch (e: any) {
      setProfileMsg({ type: "err", text: e.message || "Erreur lors de la mise à jour" });
    } finally {
      setProfileLoading(false);
    }
  }

  /* ── Supprimer le compte ── */
  async function handleDeleteAccount() {
    try {
      const res = await fetch(`${API}/api/user/me`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      onLogout();
    } catch (e: any) {
      setProfileMsg({ type: "err", text: e.message });
    }
  }

  /* ── Supprimer un quiz de l'historique ── */
  async function handleDeleteQuiz(quizId: string) {
    try {
      const res = await fetch(`${API}/api/quiz/${quizId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      setHistory((h) => h.filter((q) => q.id !== quizId));
      if (selectedQuiz?.id === quizId) setSelectedQuiz(null);
    } catch {
      alert("Erreur lors de la suppression du quiz.");
    }
  }

  const typeLabel = (t: QuestionType) =>
    t === "qcm" ? "QCM" : t === "vf" ? "Vrai/Faux" : "Ouvert";

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <i className="ti ti-arrow-left" aria-hidden="true" /> Retour
        </button>
        <div className={styles.headerTitle}>
          <div className={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1>{user.name}</h1>
            <span className={`${styles.roleBadge} ${user.role === "ADMIN" ? styles.roleAdmin : styles.roleStudent}`}>
              {user.role === "ADMIN" ? "Administrateur" : "Étudiant"}
            </span>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={onLogout}>
          <i className="ti ti-logout" aria-hidden="true" /> Déconnexion
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === "profile" ? styles.tabActive : ""}`}
          onClick={() => setTab("profile")}
        >
          <i className="ti ti-user" aria-hidden="true" /> Mon profil
        </button>
        <button
          className={`${styles.tab} ${tab === "history" ? styles.tabActive : ""}`}
          onClick={() => setTab("history")}
        >
          <i className="ti ti-history" aria-hidden="true" /> Historique des quiz
        </button>
      </div>

      {/* ── Tab Profil ── */}
      {tab === "profile" && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Informations personnelles</h2>

          {profileMsg && (
            <div className={`${styles.msg} ${profileMsg.type === "ok" ? styles.msgOk : styles.msgErr}`}>
              <i className={`ti ${profileMsg.type === "ok" ? "ti-circle-check" : "ti-alert-circle"}`} aria-hidden="true" />
              {profileMsg.text}
            </div>
          )}

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Prénom</label>
              <div className={styles.inputWrap}>
                <i className="ti ti-user" aria-hidden="true" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ton prénom"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Adresse e-mail</label>
              <div className={styles.inputWrap}>
                <i className="ti ti-mail" aria-hidden="true" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="toi@exemple.com"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Nouveau mot de passe <span className={styles.optional}>(laisser vide pour ne pas changer)</span></label>
              <div className={styles.inputWrap}>
                <i className="ti ti-lock" aria-hidden="true" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handleSave}
              disabled={profileLoading}
            >
              {profileLoading ? (
                <><span className={styles.spinner} /> Enregistrement…</>
              ) : (
                <><i className="ti ti-device-floppy" aria-hidden="true" /> Enregistrer</>
              )}
            </button>
          </div>

          {/* ── Zone danger ── */}
          <div className={styles.dangerZone}>
            <h3><i className="ti ti-alert-triangle" aria-hidden="true" /> Zone de danger</h3>
            <p>La suppression de ton compte est irréversible. Toutes tes données seront effacées.</p>
            {!showDeleteConfirm ? (
              <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => setShowDeleteConfirm(true)}>
                <i className="ti ti-trash" aria-hidden="true" /> Supprimer mon compte
              </button>
            ) : (
              <div className={styles.confirmBox}>
                <p>Es-tu sûr(e) ? Cette action est <strong>irréversible</strong>.</p>
                <div className={styles.confirmActions}>
                  <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleDeleteAccount}>
                    Oui, supprimer
                  </button>
                  <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setShowDeleteConfirm(false)}>
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab Historique ── */}
      {tab === "history" && (
        <div className={styles.historyLayout}>
          {/* Liste */}
          <div className={styles.historyList}>
            <h2 className={styles.sectionTitle}>Mes quiz</h2>

            {historyLoading && (
              <div className={styles.loadingRow}>
                <span className={styles.spinner} /> Chargement…
              </div>
            )}

            {!historyLoading && history.length === 0 && (
              <div className={styles.emptyState}>
                <i className="ti ti-notes-off" aria-hidden="true" />
                <p>Aucun quiz généré pour l'instant.</p>
              </div>
            )}

            {history.map((quiz) => (
              <div
                key={quiz.id}
                className={`${styles.quizCard} ${selectedQuiz?.id === quiz.id ? styles.quizCardActive : ""}`}
                onClick={() => setSelectedQuiz(quiz)}
              >
                <div className={styles.quizCardInfo}>
                  <span className={styles.quizCardTitle}>{quiz.course.title}</span>
                  <span className={styles.quizCardMeta}>
                    {quiz.course.subject} · {quiz.course.level} · {quiz.questionCount} questions
                  </span>
                  <span className={styles.quizCardDate}>
                    {new Date(quiz.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </span>
                  <div className={styles.typePills}>
                    {quiz.types.map((t) => (
                      <span key={t} className={styles.typePill}>{typeLabel(t)}</span>
                    ))}
                  </div>
                </div>
                <button
                  className={styles.deleteQuizBtn}
                  onClick={(e) => { e.stopPropagation(); handleDeleteQuiz(quiz.id); }}
                  title="Supprimer ce quiz"
                >
                  <i className="ti ti-trash" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>

          {/* Détail */}
          <div className={styles.historyDetail}>
            {!selectedQuiz ? (
              <div className={styles.emptyState}>
                <i className="ti ti-hand-click" aria-hidden="true" />
                <p>Sélectionne un quiz pour voir les questions et réponses.</p>
              </div>
            ) : (
              <>
                <div className={styles.detailHeader}>
                  <div>
                    <h2>{selectedQuiz.course.title}</h2>
                    <p>{selectedQuiz.course.subject} · {selectedQuiz.course.level}</p>
                  </div>
                  <button className={styles.closeDetailBtn} onClick={() => setSelectedQuiz(null)}>
                    <i className="ti ti-x" aria-hidden="true" />
                  </button>
                </div>

                <div className={styles.questionList}>
                  {selectedQuiz.questions.map((q, i) => (
                    <div key={q.id} className={styles.questionItem}>
                      <div className={styles.questionHeader}>
                        <span className={styles.qNumber}>Q{i + 1}</span>
                        <span className={`${styles.qTypeBadge} ${
                          q.type === "qcm" ? styles.badgeQcm :
                          q.type === "vf" ? styles.badgeVf : styles.badgeOuvert
                        }`}>{typeLabel(q.type)}</span>
                      </div>
                      <p className={styles.qText}>{q.question}</p>

                      {q.options && q.options.length > 0 && (
                        <div className={styles.qOptions}>
                          {q.options.map((opt, oi) => (
                            <div
                              key={oi}
                              className={`${styles.qOption} ${
                                LETTERS[oi] === q.answer.trim().toUpperCase()
                                  ? styles.qOptionCorrect : ""
                              }`}
                            >
                              <span className={styles.qOptionLetter}>{LETTERS[oi]}</span>
                              {opt.replace(/^[A-D]\.\s*/, "")}
                              {LETTERS[oi] === q.answer.trim().toUpperCase() && (
                                <i className="ti ti-check" style={{ marginLeft: "auto" }} aria-hidden="true" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {(q.type === "vf" || q.type === "ouvert") && (
                        <div className={styles.qAnswer}>
                          <strong>Réponse :</strong> {q.answer}
                        </div>
                      )}

                      <div className={styles.qExplanation}>
                        <i className="ti ti-info-circle" aria-hidden="true" />
                        {q.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}