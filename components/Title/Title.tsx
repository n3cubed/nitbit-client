import styles from "./Title.module.css";

const Title: React.FC<{ children: string }> = ({ children }) => {
  return <div className={styles.title}>{children}</div>;
};

export default Title;
