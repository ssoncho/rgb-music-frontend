import { useNavigate } from "react-router-dom";
import styles from "./ModeButton.module.css";

interface ModeButtonProps {
  label: string;
  mode: "rainbow" | "volume" | "flash";
}
function ModeButton({ label, mode }: ModeButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    const state = {
      mode,
    };

    navigate(`/settings?mode=${mode}`, { state });
  };
  return (
    <button className={styles.modeButton} onClick={handleClick}>
      <span className={styles.function}>Функция</span>
      <span className={styles.mode}>{label}</span>
    </button>
  );
}

export default ModeButton;
