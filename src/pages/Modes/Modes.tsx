import config from "../../config";

import styles from "./Modes.module.css";

import ConnectionStatus from "../../components/ConnectionStatus/ConnectionStatus";
import RgbStrip from "../../components/RgbStrip/RgbStrip";
import ModeButton from "./components/ModeButton/ModeButton";

import { useEffect, useState } from "react";
import axios from "axios";
import { Settings } from "../../types/settings";

function Modes() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/settings`);
        setSettings(response.data);
      } catch (err) {
        //setError("Ошибка при загрузке настроек");
        console.error("Error fetching settings:", err);

        const data = {
          mode: 0,
          vuGreenRed: {
            sensitivity: 70,
            brightness: 80,
            bgBrightness: 10,
            smoothing: 30,
            bgColor: "#000000",
          },
          vuRainbow: {
            sensitivity: 70,
            brightness: 80,
            bgBrightness: 10,
            smoothing: 30,
            bgColor: "#000000",
          },
          flash: {
            sensitivity: 80,
            brightness: 100,
            smoothing: 10,
            color: "#FFFFFF",
          },
          message: "Текущие настройки успешно получены",
          status: "success",
        };
        setSettings(data);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return <div className={styles.container}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  if (!settings) {
    return <div className={styles.container}>Настройки не загружены</div>;
  }

  // Определяем текущий режим
  const currentMode =
    settings.mode === 0 ? "volume" : settings.mode === 1 ? "rainbow" : "flash";

  return (
    <div className={styles.container}>
      <h1>Настройка</h1>
      <ConnectionStatus />
      <RgbStrip
        ledCount={30}
        sensitivity={
          currentMode === "volume"
            ? settings.vuGreenRed.sensitivity / 100
            : currentMode === "rainbow"
            ? settings.vuRainbow.sensitivity / 100
            : settings.flash.sensitivity / 100
        }
        animationSpeed={0.8}
        colorMode={currentMode}
        flashColor={settings.flash.color}
      />
      <div className={styles.modeButtonsContainer}>
        <ModeButton
          label="Радуга"
          mode="rainbow"
          settings={settings.vuRainbow}
        />
        <ModeButton
          label="Громкость"
          mode="volume"
          settings={settings.vuGreenRed}
        />
        <ModeButton label="Мигание" mode="flash" settings={settings.flash} />
      </div>
    </div>
  );
}

export default Modes;
