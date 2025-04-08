import { Stack, Box, Typography } from "@mui/material";
import SettingItem from "../components/SettingItem/SettingItem";
import ColorPicker from "../components/ColorPicker/ColorPicker";
import PercentageSlider from "../components/PercentageSlider/PercentageSlider";
import { useState } from "react";

interface SettingsProps {
  mode: string;
}

function Settings({ mode }: SettingsProps) {
  const [stripColor, setStripColor] = useState("#aabbcc");
  return (
    <>
      <Box
        sx={{
          width: 700,
          height: 110,
          borderRadius: 1,
          bgcolor: stripColor,
        }}
      ></Box>
      <Box
        display="grid"
        gridTemplateColumns="200px 1fr"
        gridTemplateRows="auto auto auto"
        gridTemplateAreas={`"title ." "mode ." ". settings"`} // делим области на left и right
        gap={1}
      >
        <Typography style={{ gridArea: "title" }}>Настройки</Typography>
        <Typography style={{ gridArea: "mode" }}>{mode}</Typography>
        <Stack style={{ gridArea: "settings" }}>
          <SettingItem label="Чувствительность">
            <PercentageSlider />
          </SettingItem>
          <SettingItem label="Основная яркость">
            <PercentageSlider />
          </SettingItem>
          <SettingItem label="Яркость фона">
            <PercentageSlider />
          </SettingItem>
          <SettingItem label="Плавность">
            <PercentageSlider />
          </SettingItem>
          <SettingItem label="Цвет фона">
            <ColorPicker
              stripColor={stripColor}
              setStripColor={setStripColor}
            />
          </SettingItem>
        </Stack>
      </Box>
    </>
  );
}

export default Settings;
