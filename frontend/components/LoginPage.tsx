"use client";
import { useState } from "react";
import styles from "../modules/LoginPage.module.css";

interface Props {
  onLogin: (email: string, password: string) => Promise<void>;
  onGoRegister: () => void;
}

export default function LoginPage({ onLogin, onGoRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError("Merci de remplir tous les champs.");
      return;
    }
    setLoading(true);
    try {
      await onLogin(email.trim(), password);
    } catch (e: any) {
      setError(e?.message ?? "Identifiants incorrects. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div className={styles.page}>
      {/* Background orbs */}
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

        <h2 className={styles.title}>Bon retour 👋</h2>
        <p className={styles.subtitle}>Connecte-toi pour continuer à apprendre</p>

        {error && (
          <div className={styles.errorBanner}>
            <i className="ti ti-alert-circle" aria-hidden="true" />
            {error}
          </div>
        )}

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

        <div className={styles.fieldGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Mot de passe</label>
            <button className={styles.forgotLink} tabIndex={0}>
              Mot de passe oublié ?
            </button>
          </div>
          <div className={styles.inputWrap}>
            <i className="ti ti-lock" aria-hidden="true" />
            <input
              className={styles.input}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              autoComplete="current-password"
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
        </div>

        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className={styles.spinner} />
              Connexion…
            </>
          ) : (
            <>
              <i className="ti ti-login" aria-hidden="true" />
              Se connecter
            </>
          )}
        </button>

        <p className={styles.switchText}>
          Pas encore de compte ?{" "}
          <button className={styles.switchLink} onClick={onGoRegister}>
            Créer un compte
          </button>
        </p>
      </div>
    </div>
  );
}