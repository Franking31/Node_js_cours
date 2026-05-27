"use client";
import { useState, useEffect, Fragment } from "react";
import { UserProfile } from "@/lib/types";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import styles from "../modules/AdminPage.module.css";
import { API } from "@/lib/config";

interface Props {
  onBack: () => void;
  onLogout: () => void;
}

interface AdminUser extends UserProfile {
  createdAt: string;
  _count?: { quizzes: number };
}

export default function AdminPage({ onBack, onLogout }: Props) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);
  async function fetchUsers() {
  setLoading(true);
  try {
    const res = await fetchWithAuth(`${API}/api/admin/users`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setUsers(data);
  } catch (e: any) {
    setErrorMsg(e.message || "Erreur lors du chargement des utilisateurs");
  } finally {
    setLoading(false);
  }
}

  async function handleDelete(userId: string, userName: string) {
  setDeletingId(userId);
  setSuccessMsg(null);
  setErrorMsg(null);
  try {
    const res = await fetchWithAuth(`${API}/api/admin/users/${userId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setSuccessMsg(`L'utilisateur "${userName}" a été supprimé avec succès.`);
    setConfirmId(null);
    setTimeout(() => setSuccessMsg(null), 4000);
  } catch (e: any) {
    setErrorMsg(e.message || "Erreur lors de la suppression");
  } finally {
    setDeletingId(null);
  }
}

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <i className="ti ti-arrow-left" aria-hidden="true" /> Retour
        </button>
        <div className={styles.headerTitle}>
          <i className="ti ti-shield" aria-hidden="true" />
          <h1>Administration</h1>
        </div>
        <button className={styles.logoutBtn} onClick={onLogout}>
          <i className="ti ti-logout" aria-hidden="true" /> Déconnexion
        </button>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <i className="ti ti-users" aria-hidden="true" />
          <div>
            <span className={styles.statValue}>{users.length}</span>
            <span className={styles.statLabel}>Utilisateurs</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <i className="ti ti-school" aria-hidden="true" />
          <div>
            <span className={styles.statValue}>
              {users.filter((u) => u.role === "STUDENT").length}
            </span>
            <span className={styles.statLabel}>Étudiants</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <i className="ti ti-shield-check" aria-hidden="true" />
          <div>
            <span className={styles.statValue}>
              {users.filter((u) => u.role === "ADMIN").length}
            </span>
            <span className={styles.statLabel}>Admins</span>
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      {successMsg && (
        <div className={`${styles.alert} ${styles.alertSuccess}`}>
          <i className="ti ti-circle-check" aria-hidden="true" />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className={`${styles.alert} ${styles.alertError}`}>
          <i className="ti ti-alert-circle" aria-hidden="true" />
          {errorMsg}
        </div>
      )}

      {/* ── Barre de recherche ── */}
      <div className={styles.searchBar}>
        <i className="ti ti-search" aria-hidden="true" />
        <input
          type="text"
          placeholder="Rechercher par nom ou e-mail…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch("")}>
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* ── Tableau ── */}
        {loading ? (
        <div className={styles.loadingRow}>
            <span className={styles.spinner} /> Chargement…
        </div>
        ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>
            <i className="ti ti-users-minus" aria-hidden="true" />
            <p>Aucun utilisateur trouvé.</p>
        </div>
        ) : (
        <div className={styles.tableWrap}>
            <table className={styles.table}>
            <thead>
                <tr>
                <th>Utilisateur</th>
                <th>E-mail</th>
                <th>Rôle</th>
                <th>Inscrit le</th>
                <th>Quiz</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {filtered.map((u) => (
                <Fragment key={u.id}>
                    <tr className={confirmId === u.id ? styles.rowPending : ""}>
                    <td>
                        <div className={styles.userCell}>
                        <div className={styles.avatar}>{u.name.charAt(0).toUpperCase()}</div>
                        <span>{u.name}</span>
                        </div>
                    </td>
                    <td className={styles.emailCell}>{u.email}</td>
                    <td>
                        <span className={`${styles.roleBadge} ${u.role === "ADMIN" ? styles.roleAdmin : styles.roleStudent}`}>
                        {u.role === "ADMIN" ? "Admin" : "Étudiant"}
                        </span>
                    </td>
                    <td>
                        {new Date(u.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        })}
                    </td>
                    <td>{u._count?.quizzes ?? "—"}</td>
                    <td>
                        {u.role !== "ADMIN" && (
                        <button
                            className={styles.deleteBtn}
                            onClick={() => setConfirmId(u.id)}
                            disabled={deletingId === u.id}
                            title="Supprimer cet utilisateur"
                        >
                            <i className="ti ti-trash" aria-hidden="true" />
                            Supprimer
                        </button>
                        )}
                    </td>
                    </tr>

                    {/* Confirmation inline */}
                    {confirmId === u.id && (
                    <tr key={`${u.id}-confirm`} className={styles.confirmRow}>
                        <td colSpan={6}>
                        <div className={styles.confirmBox}>
                            <i className="ti ti-alert-triangle" aria-hidden="true" />
                            <span>
                            Supprimer <strong>{u.name}</strong> ? Cette action est irréversible et supprimera aussi tous ses quiz.
                            </span>
                            <div className={styles.confirmActions}>
                            <button
                                className={`${styles.btn} ${styles.btnDanger}`}
                                onClick={() => handleDelete(u.id, u.name)}
                                disabled={deletingId === u.id}
                            >
                                {deletingId === u.id ? (
                                <>
                                    <span className={styles.spinner} /> Suppression…
                                </>
                                ) : (
                                <>Confirmer</>
                                )}
                            </button>
                            <button
                                className={`${styles.btn} ${styles.btnSecondary}`}
                                onClick={() => setConfirmId(null)}
                            >
                                Annuler
                            </button>
                            </div>
                        </div>
                        </td>
                    </tr>
                    )}
                </Fragment>
                ))}
            </tbody>
            </table>
        </div>
        )}
    </div>
  );
}