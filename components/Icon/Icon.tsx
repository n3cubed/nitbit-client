import styles from './Icon.module.css'
import Image from 'next/image'
import Link from 'next/link'

export interface IconProps {
  name: string,
  alt: string,
  href?: string,
  width?: number,
  doDisplayAlt?: boolean,
}

const Icon: React.FC<IconProps & { children?: string }> = ({ name, alt, href, width, doDisplayAlt, children }) => {
  const iconWidth = width ? `${width}px` : '1em';

  const IconComponent = require(`../../public/assets/icons/${name}`).default;
  const icon = <IconComponent className={styles.icon} style={{ width: iconWidth }} />;

  if (href) {
    return (
        <Link href={href} className={`${doDisplayAlt ? styles.display : ''}`}>
          {icon}
          <span>{doDisplayAlt ? alt : null}</span>
        </Link>
      );
    }
  else
    return (
      <>
        {icon}
      </>
    );
}

export default Icon;
