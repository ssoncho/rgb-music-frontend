import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import cubeIcon from "../../assets/icons/cube-icon.png";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={cubeIcon} className={styles.icon} alt="Cube icon" />
          <span className={styles.logoText}>
            <span className={styles.logoTextWhite}>Кубик</span>
            <span className={styles.logoTextYellow}>Рубика</span>
          </span>
        </div>

        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            Главная
          </Link>
          <Link to="/modes" className={styles.navLink}>
            Настройки
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
