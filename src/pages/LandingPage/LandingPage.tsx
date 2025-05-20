import Header from "../../components/Header/Header";
import styles from "./LandingPage.module.css";
import mainImage from "../../assets/images/main.png";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/modes`);
  };
  return (
    <>
      <Header />
      <div className={styles.contentWrapper}>
        <div className={styles.textSection}>
          <h1 className={styles.mainHeading}>
            Настрой свою подсветку <br /> уже
            <span className={styles.highlight}> сейчас!</span>
          </h1>
          <button className={styles.ctaButton} onClick={handleClick}>
            Перейти <span className={styles.arrow}>→</span>
          </button>
        </div>
        <div className={styles.illustrationSection}>
          <img
            src={mainImage}
            alt="Иллюстрация рабочего места с компьютером и подсветкой"
            className={styles.illustration}
          />
        </div>
      </div>
    </>
  );
}
