import { ReactNode } from "react";
import { Stack, Typography } from "@mui/material";

interface SettingItemProps {
  label: string;
  children: ReactNode;
}

function SettingItem({ label, children }: SettingItemProps) {
  return (
    <Stack
      direction="row"
      spacing={6}
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography>{label}</Typography>
      {children}
    </Stack>
  );
}

export default SettingItem;
