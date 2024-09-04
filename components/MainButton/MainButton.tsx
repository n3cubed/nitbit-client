import styles from './MainButton.module.css'
import Link from 'next/link'

interface ButtonProps {
  color: string;
  text: string;
  href: string;
}

const MainButton: React.FC<ButtonProps> = ({ color, text, href }) => {
  const buttonStyle = { backgroundColor: color };

  return (
    <Link href={href} className={styles['main-button']}>
      <div className={styles['main-button-small']} style={buttonStyle} />
      <div className={styles['main-button-large']} style={buttonStyle}>
        {text}
      </div>
    </Link>
  );
}

export default MainButton;