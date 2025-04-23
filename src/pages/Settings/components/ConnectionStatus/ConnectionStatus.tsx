import styles from "./ConnectionStatus.module.css";

function ConnectionStatus() {
  return (
    <div className={styles.container}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="31"
        height="31"
        viewBox="0 0 31 31"
        fill="none"
      >
        <circle cx="15.5" cy="15.5" r="15.5" fill="#F2F4FE" />
      </svg>
      <span className={styles.status}>Не подключен</span>
    </div>
  );
}

export default ConnectionStatus;
