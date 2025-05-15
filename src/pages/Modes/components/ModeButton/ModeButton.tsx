import { useNavigate } from "react-router-dom";
import styles from "./ModeButton.module.css";
import { ModeSettings } from "../../../../types/settings";

interface ModeButtonProps {
  label: string;
  mode: "rainbow" | "volume" | "flash";
  settings?: ModeSettings;
}
function ModeButton({ label, mode, settings }: ModeButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    const state = {
      mode,
      settings: settings || {}, // Передаем настройки или пустой объект
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
