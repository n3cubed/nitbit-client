import Link from 'next/link'
import styles from './IconDisplayHref.module.css'
import Image from 'next/image'
import { IconProps } from '../Icon/Icon'
import Icon from '../Icon/Icon'

const IconDisplayHref: React.FC<IconProps> = ({ name, alt, href }) => {
  const display_href = href?.replace("https://", "");
  return (
    <div>
      <Icon href={href} alt={alt} name={name} >
        {display_href}
      </Icon>
    </div>
  )
}

export default IconDisplayHref;
      // <Link href={href} className={styles['icon-display-href']}>
      //   <Image src={'../../public/icons/' + name} alt={alt}/>
      // </Link>