import { useCallback, useRef, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";

import useClickOutside from "../../hooks/useClickOutside";

import "./ColorPicker.css";
import { Stack } from "@mui/material";

interface ColorPickerProps {
  stripColor: string;
  setStripColor: React.Dispatch<React.SetStateAction<string>>;
}

function ColorPicker({ stripColor, setStripColor }: ColorPickerProps) {
  const [color, setColor] = useState(stripColor);
  const handleColorChange = (newColor: string) => {
    setStripColor(newColor);
    setColor(newColor);
  };

  const popover = useRef<HTMLDivElement | null>(null);
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  return (
    <Stack
      width={200}
      direction={"row"}
      spacing={1}
      sx={{ alignItems: "center" }}
    >
      <div className="picker">
        <div
          className="swatch"
          style={{ backgroundColor: color }}
          onClick={() => toggle(true)}
        />

        {isOpen && (
          <div className="popover" ref={popover}>
            <HexColorPicker color={color} onChange={handleColorChange} />
          </div>
        )}
      </div>
      <HexColorInput color={color} onChange={handleColorChange} />
    </Stack>
  );
}

export default ColorPicker;
