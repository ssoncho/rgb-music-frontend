import styles from "./SettingItem.module.css";

import { ReactNode } from "react";

interface SettingItemProps {
  label: string;
  children: ReactNode;
}

function SettingItem({ label, children }: SettingItemProps) {
  return (
    <div className={styles.setting}>
      <span className={styles.name}>{label}</span>
      {children}
    </div>
  );
}

export default SettingItem;
