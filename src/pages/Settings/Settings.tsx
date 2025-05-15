import styles from "./Settings.module.css";

import ConnectionStatus from "../../components/ConnectionStatus/ConnectionStatus";
import SettingItem from "./components/SettingItem/SettingItem";
import ColorPicker from "./components/ColorPicker/ColorPicker";
import PercentageSlider from "./components/PercentageSlider/PercentageSlider";
import RgbStrip from "../../components/RgbStrip/RgbStrip";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
  const settings = state?.settings || {};

  useEffect(() => {
    if (!mode || !["rainbow", "volume", "flash"].includes(mode)) {
      console.log(mode);
      navigate("/");
    }
  }, [mode, navigate]);

  const [sensitivity, setSensitivity] = useState(settings.sensitivity || 50);
  const [mainBrightness, setMainBrightness] = useState(
    settings.brightness || 50
  );
  const [backgroundBrightness, setBackgroundBrightness] = useState(
    settings.bgBrightness || 50
  );
  const [smoothing, setSmoothing] = useState(settings.smoothing || 50);
  const [backgroundColor, setBackgroundColor] = useState(
    settings.bgColor || "#fff"
  );
  const [flashColor, setFlashColor] = useState(settings.color || "#fff");

  return (
    <div className={styles.container}>
      <h1>Настройка</h1>
      <ConnectionStatus></ConnectionStatus>
      <RgbStrip
        ledCount={30}
        sensitivity={1}
        animationSpeed={1.2}
        colorMode={mode}
        flashColor={flashColor}
        backgroundColor={backgroundColor}
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
    </div>
  );
}

export default Settings;
