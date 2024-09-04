import styles from './Logo.module.css'
import Link from 'next/link'

const Logo: React.FC = () => {
  return (
    <Link href='/' className={styles.logo}>
      <div>{"nitbit"}</div>
    </Link>
  );
}

export default Logo;