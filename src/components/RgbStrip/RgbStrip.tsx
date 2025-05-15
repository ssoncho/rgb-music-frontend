import { useEffect, useState, useRef } from "react";
import styles from "./RgbStrip.module.css";

type ColorMode = "rainbow" | "volume" | "flash";

interface RgbStripProps {
  ledCount?: number;
  sensitivity?: number;
  animationSpeed?: number;
  colorMode: ColorMode;
  flashColor?: string; // For flash mode
  backgroundColor?: string; // Background color for LEDs
}

export default function RgbStrip({
  ledCount = 30,
  sensitivity = 0.8,
  animationSpeed = 1,
  colorMode,
  flashColor = "#00ffff", // Default cyan flash
  backgroundColor = "#333333", // Default dark gray background
}: RgbStripProps) {
  const [activeLeds, setActiveLeds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isPeaking, setIsPeaking] = useState(false);
  const [peakTimestamp, setPeakTimestamp] = useState(0);

  // Refs for mutable values that don't trigger rerender
  const rainbowOffsetRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const backgroundColorRef = useRef(backgroundColor);
  const lastPeakRef = useRef(0); // <-- сюда сохраняем lastPeak

  useEffect(() => {
    backgroundColorRef.current = backgroundColor;
  }, [backgroundColor]);

  useEffect(() => {
    if (!isActive) return;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (colorMode === "rainbow") {
        rainbowOffsetRef.current =
          (rainbowOffsetRef.current + deltaTime * 0.05 * animationSpeed) % 360;
      }

      const now = timestamp / 1000;
      const baseBeat = Math.sin(now * 2 * Math.PI * 0.8) * 0.5 + 0.5;
      const randomFactor = Math.random() * 0.3;

      let newPeak = baseBeat * sensitivity + randomFactor;
      newPeak = lastPeakRef.current * 0.3 + newPeak * 0.7;

      if (newPeak > lastPeakRef.current + 0.15 && newPeak > 0.7) {
        setIsPeaking(true);
        setPeakTimestamp(Date.now());
      }

      if (isPeaking && Date.now() - peakTimestamp > 150) {
        setIsPeaking(false);
      }

      lastPeakRef.current = newPeak;

      let newActiveLeds = 0;

      if (colorMode === "rainbow") {
        newActiveLeds = Math.floor(newPeak * (ledCount / 2));
      } else if (colorMode === "volume") {
        newActiveLeds = Math.floor(newPeak * (ledCount / 2));
      } else if (colorMode === "flash") {
        newActiveLeds = isPeaking ? ledCount : 0;
      }

      setActiveLeds(newActiveLeds);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    isActive,
    colorMode,
    sensitivity,
    ledCount,
    animationSpeed,
    isPeaking,
    peakTimestamp,
  ]);

  const getRainbowOffset = () => rainbowOffsetRef.current;

  const getLedStyle = (index: number) => {
    let isLedActive = false;
    let intensity = 0;

    if (colorMode === "rainbow") {
      const centerIndex = Math.floor(ledCount / 2);
      const distanceFromCenter = Math.abs(index - centerIndex);
      isLedActive = distanceFromCenter <= activeLeds;
      intensity = isLedActive
        ? 1 - (distanceFromCenter / (ledCount / 2)) * 0.5
        : 0;
    } else if (colorMode === "volume") {
      const centerIndex = Math.floor(ledCount / 2);
      const distanceFromCenter = Math.abs(index - centerIndex);
      isLedActive = distanceFromCenter <= activeLeds;
      intensity = isLedActive
        ? 1 - (distanceFromCenter / (ledCount / 2)) * 0.5
        : 0;
    } else if (colorMode === "flash") {
      isLedActive = index < activeLeds;
      intensity = isLedActive ? 1 - (index / ledCount) * 0.5 : 0;
    }

    const baseStyle = {
      backgroundColor: backgroundColorRef.current,
      opacity: 1,
    };

    if (!isLedActive && colorMode !== "flash") {
      return baseStyle;
    }

    let effectColor = "";
    let shadow = "";
    let extraStyles = {};

    switch (colorMode) {
      case "rainbow": {
        const centerIndex = Math.floor(ledCount / 2);
        const distanceFromCenter = Math.abs(index - centerIndex);
        const maxDistance = Math.max(centerIndex, ledCount - centerIndex);
        const normalizedDistance = distanceFromCenter / maxDistance;

        const centerHue = (normalizedDistance * 180 + getRainbowOffset()) % 360;

        effectColor = `hsla(${centerHue}, 100%, 50%, 1)`;
        shadow = `0 0 10px 5px hsla(${centerHue}, 100%, 50%, 0.7)`;
        break;
      }

      case "volume": {
        const centerIndex = Math.floor(ledCount / 2);

        if (index < centerIndex) {
          const redIntensity = 1 - (index / centerIndex) * 0.5;
          effectColor = `rgb(255, ${Math.round(
            50 + 100 * (1 - redIntensity)
          )}, 0)`;
          shadow = `0 0 ${10 * intensity}px ${
            5 * intensity
          }px rgba(255, ${Math.round(50 + 100 * (1 - redIntensity))}, 0, ${
            intensity * 0.7
          })`;
        } else {
          const greenIntensity =
            1 - ((index - centerIndex) / (ledCount - centerIndex)) * 0.5;
          effectColor = `rgb(${Math.round(
            50 + 100 * (1 - greenIntensity)
          )}, 255, 0)`;
          shadow = `0 0 ${10 * intensity}px ${
            5 * intensity
          }px rgba(${Math.round(50 + 100 * (1 - greenIntensity))}, 255, 0, ${
            intensity * 0.7
          })`;
        }
        break;
      }

      case "flash":
        if (isPeaking) {
          let r = 0,
            g = 0,
            b = 0;
          if (flashColor.startsWith("#")) {
            const hex = flashColor.slice(1);
            if (hex.length === 3) {
              r = parseInt(hex[0] + hex[0], 16);
              g = parseInt(hex[1] + hex[1], 16);
              b = parseInt(hex[2] + hex[2], 16);
            } else if (hex.length === 6) {
              r = parseInt(hex.slice(0, 2), 16);
              g = parseInt(hex.slice(2, 4), 16);
              b = parseInt(hex.slice(4, 6), 16);
            }
          }
          effectColor = `rgb(${r}, ${g}, ${b})`;
          shadow = `
            0 0 20px 10px rgb(${r}, ${g}, ${b}),
            0 0 10px 5px rgb(${r}, ${g}, ${b})
          `;
          extraStyles = {
            filter: `brightness(1.4) saturate(1.3)`,
            border: `1px solid rgb(${r}, ${g}, ${b})`,
          };
          return {
            backgroundColor: effectColor,
            boxShadow: shadow,
            opacity: 1,
            transition: "all 0.05s ease-in",
            ...extraStyles,
          };
        } else {
          return {
            backgroundColor: "transparent",
            opacity: 0,
            transition: "all 0.05s ease-in",
          };
        }
    }

    return {
      backgroundColor: effectColor,
      boxShadow: shadow,
      opacity: 1,
      transition: isPeaking ? "all 0.05s ease-in" : "all 0.1s ease-out",
      ...extraStyles,
    };
  };

  const leds = Array.from({ length: ledCount }).map((_, index) => (
    <div
      key={index}
      className={`${styles.led} ${
        isPeaking && colorMode === "flash" ? styles.flashing : ""
      }`}
      style={getLedStyle(index)}
    />
  ));

  return (
    <div className={styles.rgbStripContainer}>
      <div className={styles.rgbStrip}>{leds}</div>
      {/* Кнопка паузы убрана по твоему запросу */}
    </div>
  );
}
