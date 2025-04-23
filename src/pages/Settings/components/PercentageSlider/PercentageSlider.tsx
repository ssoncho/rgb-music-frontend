import styles from "./PercentageSlider.module.css";

import { Slider } from "@mui/material";
import { useState } from "react";

function PercentageSlider() {
  const [percentage, setPercentage] = useState(50);
  const [inputValue, setInputValue] = useState("50");

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const numValue = newValue as number;
    setPercentage(numValue);
    setInputValue(numValue.toString());
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // позволяем пустое значение
    setInputValue(value);

    if (value === "") return;

    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      setValidatedPercentage(numericValue);
    }
  };

  const setValidatedPercentage = (value: number) => {
    const clampedValue = Math.max(0, Math.min(100, value));
    setPercentage(clampedValue);
    setInputValue(clampedValue.toString());
  };

  return (
    <div className={styles.container}>
      <Slider
        value={percentage}
        step={1}
        min={0}
        max={100}
        onChange={handleSliderChange}
        color="secondary"
      />
      <input
        type="number"
        className={styles.percentageInput}
        value={inputValue}
        onChange={handleInputChange}
        inputMode="numeric"
        aria-label="Number input"
      />
    </div>
  );
}

export default PercentageSlider;
