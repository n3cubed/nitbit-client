import styles from './Icon.module.css'
import Image from 'next/image'
import Link from 'next/link'

export interface IconProps {
  name: string,
  alt: string,
  href?: string,
  width?: number,
  doDisplayHref?: boolean,
}

const Icon: React.FC<IconProps & { children?: string }> = ({ name, alt, href, width, doDisplayHref, children }) => {
  const iconWidth = width ? `${width}px` : '1em';

  const IconComponent = require(`../../public/assets/icons/${name}`).default;
  const icon = <IconComponent className={styles.icon} style={{ width: iconWidth }} />;

  if (href) {
    return (
        <Link href={href} className={`${doDisplayHref ? styles.display : ''}`}>
          {icon}
          {doDisplayHref ? href.replace("https://", "") : null}
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
