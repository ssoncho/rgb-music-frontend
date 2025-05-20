import styles from "./Modes.module.css";

import ConnectionStatus from "../../components/ConnectionStatus/ConnectionStatus";
import RgbStrip from "../../components/RgbStrip/RgbStrip";
import ModeButton from "./components/ModeButton/ModeButton";
import Header from "../../components/Header/Header";

import { useEffect, useState } from "react";
import api from "../../config/api";
import { ModeSettings } from "../../types/settings";

function Modes() {
  const [settings, setSettings] = useState<ModeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [animationActive, setAnimationActive] = useState(true);

  const connect = async () => {
    try {
      const response = await api.patch("/connection", {
        url: "http://microcontroller-ip/33.32.11.32",
      });
      setIsConnected(response.data.isConnected);
      setError(null); // если успешно — очищаем ошибку

      if (response.data.isConnected) {
        const settingsResponse = await api.get("/current");
        setSettings(settingsResponse.data);
        setAnimationActive(true);
      }
    } catch (err) {
      console.error("Ошибка подключения:", err);
      setError("Не удалось подключиться к контроллеру");
    }
  };

  const disconnect = async () => {
    try {
      const response = await api.patch("/disconnection");
      setIsConnected(response.data.isConnected);
      setError(null);
      setAnimationActive(false);
    } catch (err) {
      console.error("Ошибка отключения:", err);
      setError("Не удалось отключиться от контроллера");
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const connectionResponse = await api.get("/connection");
        setIsConnected(connectionResponse.data.isConnected);

        if (connectionResponse.data.isConnected) {
          const settingsResponse = await api.get("/current");
          setSettings(settingsResponse.data);
        }
        setError(null);
      } catch (err) {
        console.error("Ошибка инициализации:", err);
        setError("Ошибка подключения к контроллеру");
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className="spinner-wrapper">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const currentMode = !settings
    ? "none"
    : settings.mode === 0
    ? "volume"
    : settings.mode === 1
    ? "rainbow"
    : "flash";

  const currentModeName =
    currentMode === "rainbow"
      ? "Радуга"
      : currentMode === "volume"
      ? "Громкость"
      : currentMode === "flash"
      ? "Мигание"
      : "";

  return (
    <div className={styles.container}>
      <Header />
      <h1>Настройка</h1>
      <ConnectionStatus isConnected={isConnected} />

      {!isConnected && (
        <button className={styles.connectButton} onClick={connect}>
          Подключиться
        </button>
      )}

      {isConnected && (
        <button className={styles.disconnectButton} onClick={disconnect}>
          Отключиться
        </button>
      )}

      {/* Блок с выводом ошибок */}
      {error && <div className={styles.error}>{error}</div>}

      {isConnected && currentModeName && (
        <h2 className={styles.currentModeTitle}>
          Текущий режим:{" "}
          <span className={styles.currentMode}>{currentModeName}</span>
        </h2>
      )}

      <RgbStrip
        ledCount={30}
        sensitivity={1}
        animationSpeed={0.8}
        colorMode={animationActive ? currentMode : "none"}
        flashColor={settings?.color}
        backgroundColor={settings?.bgColor}
        effectBrightness={settings ? settings.brightness / 100 : undefined}
        backgroundBrightness={
          settings && settings.bgBrightness
            ? settings.bgBrightness / 100
            : undefined
        }
        smoothness={settings ? settings.smoothing / 100 : undefined}
      />

      <div className={styles.modeButtonsContainer}>
        <ModeButton label="Радуга" mode="rainbow" />
        <ModeButton label="Громкость" mode="volume" />
        <ModeButton label="Мигание" mode="flash" />
      </div>
    </div>
  );
}

export default Modes;
