import { Stack, Slider, Typography } from "@mui/material";
import { useState } from "react";

function PercentageSlider() {
  const [percentage, setPercentage] = useState(50);
  const handlePercentageChange = (
    _event: Event,
    newValue: number | number[]
  ) => {
    setPercentage(newValue as number);
  };

  return (
    <Stack
      width={200}
      direction={"row"}
      spacing={2}
      sx={{ alignItems: "center" }}
    >
      <Slider
        value={percentage}
        step={1}
        min={0}
        max={100}
        onChange={handlePercentageChange}
      />
      <Typography>{percentage}%</Typography>
    </Stack>
  );
}

export default PercentageSlider;
