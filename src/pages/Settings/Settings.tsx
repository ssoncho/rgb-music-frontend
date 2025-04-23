import styles from "./Settings.module.css";

import ConnectionStatus from "./components/ConnectionStatus/ConnectionStatus";
import SettingItem from "./components/SettingItem/SettingItem";
import ColorPicker from "./components/ColorPicker/ColorPicker";
import PercentageSlider from "./components/PercentageSlider/PercentageSlider";
import { useState } from "react";

interface SettingsProps {
  mode: string;
}

function Settings({ mode }: SettingsProps) {
  const [stripColor, setStripColor] = useState("#aabbcc");
  return (
    <div className={styles.container}>
      <h1>Настройка</h1>
      <ConnectionStatus></ConnectionStatus>
      <div
        className={styles.strip}
        style={{ backgroundColor: stripColor }}
      ></div>
      <h2>Функция</h2>
      <span className={styles.mode}>{mode}</span>
      <div className={styles.settings}>
        <SettingItem label="Чувствительность %">
          <PercentageSlider />
        </SettingItem>
        <SettingItem label="Основная яркость %">
          <PercentageSlider />
        </SettingItem>
        <SettingItem label="Яркость фона %">
          <PercentageSlider />
        </SettingItem>
        <SettingItem label="Плавность %">
          <PercentageSlider />
        </SettingItem>
        <SettingItem label="Цвет фона">
          <ColorPicker stripColor={stripColor} setStripColor={setStripColor} />
        </SettingItem>
      </div>
    </div>
  );
}

export default Settings;
