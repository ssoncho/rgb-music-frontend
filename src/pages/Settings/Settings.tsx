import styles from "./Settings.module.css";

import ConnectionStatus from "../../components/ConnectionStatus/ConnectionStatus";
import SettingItem from "./components/SettingItem/SettingItem";
import ColorPicker from "./components/ColorPicker/ColorPicker";
import PercentageSlider from "./components/PercentageSlider/PercentageSlider";
import RgbStrip from "../../components/RgbStrip/RgbStrip";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../config/api";
import Header from "../../components/Header/Header";

const translations: { [id: string]: string } = {
  rainbow: "Радуга",
  volume: "Громкость",
  flash: "Мигание",
};

function Settings() {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const mode = state?.mode || "";

  const [notification, setNotification] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");

  const [sensitivity, setSensitivity] = useState(50);
  const [mainBrightness, setMainBrightness] = useState(50);
  const [backgroundBrightness, setBackgroundBrightness] = useState(50);
  const [smoothing, setSmoothing] = useState(50);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [flashColor, setFlashColor] = useState("#ffffff");

  useEffect(() => {
    if (!mode || !["rainbow", "volume", "flash"].includes(mode)) {
      console.log(mode);
      navigate("/modes");
      return;
    }

    const checkConnection = async () => {
      try {
        const response = await api.get("/connection");
        setIsConnected(response.data.isConnected);
        return response.data.isConnected;
      } catch (err) {
        console.error("Ошибка проверки подключения:", err);
        setIsConnected(false);
        return false;
      }
    };

    const fetchSettings = async () => {
      try {
        const response = await api.get(`/${mode}`);
        const data = response.data;

        setSensitivity(data.sensitivity ?? 50);
        setMainBrightness(data.brightness ?? 50);
        setSmoothing(data.smoothing ?? 50);

        if (mode === "flash") {
          setFlashColor(data.color || "#ffffff");
        } else {
          setBackgroundBrightness(data.bgBrightness ?? 50);
          setBackgroundColor(data.bgColor || "#ffffff");
        }

        setLoading(false);
      } catch (error) {
        console.error("Ошибка при получении настроек:", error);
        navigate("/modes");
      }
    };

    const init = async () => {
      const connected = await checkConnection();
      if (connected) {
        await fetchSettings();
      } else {
        setLoading(false);
      }
    };

    init();
  }, [mode, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    try {
      const response = await api.get("/connection");
      if (!response.data.isConnected) {
        setIsConnected(false);
        setError("Контроллер отключился.");
        return;
      }

      setError("");

      let payload: any = {
        sensitivity,
        brightness: mainBrightness,
        smoothing,
      };

      if (mode === "flash") {
        payload.color = flashColor;
      } else {
        payload.bgBrightness = backgroundBrightness;
        payload.bgColor = backgroundColor;
      }

      await api.patch(`/${mode}`, payload);
      setNotification("Настройки успешно сохранены!");
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error("Ошибка сохранения настроек:", err);
      setError("Ошибка при отправке настроек.");
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className="spinner-wrapper">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.headerRow}>
        <button className={styles.backButton} onClick={handleBack}>
          ← Назад
        </button>
      </div>

      <h1>Настройка</h1>
      <ConnectionStatus isConnected={isConnected} />
      <RgbStrip
        ledCount={30}
        sensitivity={1}
        animationSpeed={1.2}
        colorMode={mode}
        flashColor={flashColor}
        backgroundColor={backgroundColor}
        effectBrightness={mainBrightness / 100}
        backgroundBrightness={backgroundBrightness / 100}
        smoothness={smoothing / 100}
      />
      <h2>Функция</h2>
      <span className={styles.mode}>{translations[mode]}</span>

      <div className={styles.settings}>
        <SettingItem label="Чувствительность %">
          <PercentageSlider setting={sensitivity} setSetting={setSensitivity} />
        </SettingItem>

        <SettingItem label="Основная яркость %">
          <PercentageSlider
            setting={mainBrightness}
            setSetting={setMainBrightness}
          />
        </SettingItem>

        {["rainbow", "volume"].includes(mode) && (
          <SettingItem label="Яркость фона %">
            <PercentageSlider
              setting={backgroundBrightness}
              setSetting={setBackgroundBrightness}
            />
          </SettingItem>
        )}

        <SettingItem label="Плавность %">
          <PercentageSlider setting={smoothing} setSetting={setSmoothing} />
        </SettingItem>

        {["rainbow", "volume"].includes(mode) && (
          <SettingItem label="Цвет фона">
            <ColorPicker
              stripColor={backgroundColor}
              setStripColor={setBackgroundColor}
            />
          </SettingItem>
        )}

        {["flash"].includes(mode) && (
          <SettingItem label="Цвет вспышки">
            <ColorPicker
              stripColor={flashColor}
              setStripColor={setFlashColor}
            />
          </SettingItem>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button
        className={styles.saveButton}
        onClick={handleSave}
        disabled={!isConnected}
      >
        Сохранить настройки
      </button>

      {notification && (
        <div className={styles.notification}>{notification}</div>
      )}
    </div>
  );
}

export default Settings;
