import { useEffect, useState, useRef } from "react";
import styles from "./RgbStrip.module.css";

type ColorMode = "rainbow" | "volume" | "flash" | "none";

interface RgbStripProps {
  ledCount?: number;
  sensitivity?: number;
  animationSpeed?: number;
  colorMode: ColorMode;
  flashColor?: string; // For flash mode
  backgroundColor?: string; // Background color for LEDs
  effectBrightness?: number; // добавляем
  backgroundBrightness?: number;
  smoothness?: number;
}

export default function RgbStrip({
  ledCount = 30,
  sensitivity = 0.8,
  animationSpeed = 1,
  colorMode,
  flashColor = "#00ffff", // Default cyan flash
  backgroundColor = "#333333", // Default dark gray background
  effectBrightness = 1, // по умолчанию 100%
  backgroundBrightness = 1, // по умолчанию 100%
  smoothness = 0.5,
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
    if (!isActive || colorMode === "none") return;

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
    smoothness,
  ]);

  const getRainbowOffset = () => rainbowOffsetRef.current;

  const getLedStyle = (index: number) => {
    if (colorMode === "none") {
      // Если режим none, делаем фон прозрачным и полностью невидимым
      return {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        opacity: 1,
        transition: "none",
      };
    }

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
      opacity: backgroundBrightness,
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

        effectColor = `hsla(${centerHue}, 100%, ${50 * effectBrightness}%, 1)`;
        shadow = `0 0 10px 5px hsla(${centerHue}, 100%, ${
          50 * effectBrightness
        }%, 0.7)`;
        break;
      }

      case "volume": {
        const centerIndex = Math.floor(ledCount / 2);
        const distanceFromCenter = Math.abs(index - centerIndex);

        isLedActive = distanceFromCenter < activeLeds;
        if (isLedActive) {
          const gradientFactor = distanceFromCenter / (ledCount / 2);
          const rValue = Math.round(255 * gradientFactor * effectBrightness);
          const gValue = Math.round(
            255 * (1 - gradientFactor) * effectBrightness
          );

          effectColor = `rgb(${rValue}, ${gValue}, 0)`;
          shadow = `0 0 ${10 * intensity}px ${
            5 * intensity
          }px rgba(${rValue}, ${gValue}, 0, ${intensity * 0.7})`;
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
          effectColor = `rgb(${r * effectBrightness}, ${
            g * effectBrightness
          }, ${b * effectBrightness})`;
          shadow = `
            0 0 20px 10px rgb(${r * effectBrightness}, ${
            g * effectBrightness
          }, ${b * effectBrightness}),
            0 0 10px 5px rgb(${r * effectBrightness}, ${
            g * effectBrightness
          }, ${b * effectBrightness})
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

  return <div className={styles.rgbStrip}>{leds}</div>;
}
