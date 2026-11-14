import { useTranslation } from "react-i18next";
import styles from "./WorkerProgressBar.module.css";
import type { WorkerProgress } from "./useWorkerProgress";

export function WorkerProgressBar({ progress }: { progress: WorkerProgress }) {
  const { t } = useTranslation();
  const label =
    progress.stage === "starting" ? t("chat-widget-starting") : progress.label;

  return (
    <div className={styles.progressBar}>
      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-valuenow={progress.percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={styles.progressFill}
          style={{ width: `${progress.percent}%` }}
        />
      </div>
      <div className={styles.progressLabel}>{label}</div>
    </div>
  );
}

