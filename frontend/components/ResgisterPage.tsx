"use client";
import { useState } from "react";
import styles from "../modules/RegisterPage.module.css";

interface Props {
  onRegister: (name: string, email: string, password: string) => Promise<void>;
  onGoLogin: () => void;
}

type Level = "licence1" | "licence2" | "licence3" | "master1" | "master2";

const LEVELS: { value: Level; label: string }[] = [
  { value: "licence1", label: "Licence 1" },
  { value: "licence2", label: "Licence 2" },
  { value: "licence3", label: "Licence 3" },
  { value: "master1", label: "Master 1" },
  { value: "master2", label: "Master 2" },
];

export default function RegisterPage({ onRegister, onGoLogin }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  //const [level, setLevel] = useState<Level>("licence3");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Password strength */
  function getStrength(pwd: string): { score: number; label: string; color: string } {
    if (pwd.length === 0) return { score: 0, label: "", color: "transparent" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    const labels = ["", "Faible", "Moyen", "Bien", "Fort"];
    const colors = ["transparent", "#ef4444", "#f59e0b", "#22c55e", "#6366f1"];
    return { score, label: labels[score], color: colors[score] };
  }

  const strength = getStrength(password);

  function validate(): string | null {
    if (!name.trim()) return "Le prénom est requis.";
    if (!email.trim() || !email.includes("@")) return "Adresse e-mail invalide.";
    if (password.length < 8) return "Le mot de passe doit faire au moins 8 caractères.";
    if (password !== confirm) return "Les mots de passe ne correspondent pas.";
    return null;
  }

  async function handleSubmit() {
    const err = validate();
    if (err) { setError(err); return; }
    setError(null);
    setLoading(true);
    try {
      await onRegister(name.trim(), email.trim(), password);
    } catch (e: any) {
      setError(e?.message ?? "Une erreur s'est produite. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div className={styles.page}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <div className={styles.logo}>
            <i className="ti ti-brain" aria-hidden="true" />
          </div>
          <h1 className={styles.appName}>QuizAI</h1>
        </div>

        <h2 className={styles.title}>Crée ton compte 🚀</h2>
        <p className={styles.subtitle}>Lance-toi et commence à générer des quiz</p>

        {error && (
          <div className={styles.errorBanner}>
            <i className="ti ti-alert-circle" aria-hidden="true" />
            {error}
          </div>
        )}

        {/* Name */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Prénom</label>
          <div className={styles.inputWrap}>
            <i className="ti ti-user" aria-hidden="true" />
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ton prénom"
              autoComplete="given-name"
            />
          </div>
        </div>

        {/* Email */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Adresse e-mail</label>
          <div className={styles.inputWrap}>
            <i className="ti ti-mail" aria-hidden="true" />
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="toi@exemple.com"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Level */}
        {/* <div className={styles.fieldGroup}>
          <label className={styles.label}>Niveau d&apos;études</label>
          <div className={styles.inputWrap}>
            <i className="ti ti-school" aria-hidden="true" />
            <select
              className={`${styles.input} ${styles.select}`}
              value={level}
              onChange={(e) => setLevel(e.target.value as Level)}
            >
              {LEVELS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <i className={`ti ti-chevron-down ${styles.selectArrow}`} aria-hidden="true" />
          </div>
        </div> */}

        {/* Password */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Mot de passe</label>
          <div className={styles.inputWrap}>
            <i className="ti ti-lock" aria-hidden="true" />
            <input
              className={styles.input}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <button
              className={styles.eyeBtn}
              onClick={() => setShowPassword((s) => !s)}
              tabIndex={-1}
              aria-label={showPassword ? "Masquer" : "Afficher"}
            >
              <i className={`ti ${showPassword ? "ti-eye-off" : "ti-eye"}`} aria-hidden="true" />
            </button>
          </div>

          {/* Strength bar */}
          {password.length > 0 && (
            <div className={styles.strengthRow}>
              <div className={styles.strengthBar}>
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={styles.strengthSegment}
                    style={{ background: s <= strength.score ? strength.color : "rgba(255,255,255,0.08)" }}
                  />
                ))}
              </div>
              <span className={styles.strengthLabel} style={{ color: strength.color }}>
                {strength.label}
              </span>
            </div>
          )}
        </div>

        {/* Confirm */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Confirmer le mot de passe</label>
          <div className={styles.inputWrap}>
            <i className="ti ti-lock-check" aria-hidden="true" />
            <input
              className={`${styles.input} ${confirm && confirm !== password ? styles.inputError : ""}`}
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <button
              className={styles.eyeBtn}
              onClick={() => setShowConfirm((s) => !s)}
              tabIndex={-1}
              aria-label={showConfirm ? "Masquer" : "Afficher"}
            >
              <i className={`ti ${showConfirm ? "ti-eye-off" : "ti-eye"}`} aria-hidden="true" />
            </button>
          </div>
          {confirm && password && confirm !== password && (
            <p className={styles.fieldError}>
              <i className="ti ti-x" aria-hidden="true" /> Les mots de passe ne correspondent pas
            </p>
          )}
          {confirm && password && confirm === password && (
            <p className={styles.fieldOk}>
              <i className="ti ti-check" aria-hidden="true" /> Les mots de passe correspondent
            </p>
          )}
        </div>

        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className={styles.spinner} />
              Création du compte…
            </>
          ) : (
            <>
              <i className="ti ti-sparkles" aria-hidden="true" />
              Créer mon compte
            </>
          )}
        </button>

        <p className={styles.switchText}>
          Déjà un compte ?{" "}
          <button className={styles.switchLink} onClick={onGoLogin}>
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
}