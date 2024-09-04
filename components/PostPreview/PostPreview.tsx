import Icon from '../Icon/Icon'
import styles from './PostPreview.module.css'
import { IconProps } from '../Icon/Icon'
import Link from 'next/link'
import CategoricalSymbol from '../CategoricalSymbol/CategoricalSymbol'

interface PostProps{
  title: string,
  postName: string,
  category: string,
  lastUpdated: string,
  urls: IconProps[],
  summary: string,
  content: string
}

const PostPreview: React.FC<PostProps> = ({ title, category, postName, lastUpdated, urls, summary}) => {
  return (
    <div className={styles['post-preview']}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Link href={`./posts/${postName}`} className={styles['post-preview-title']}>
          <div>
            {title}
          </div>
        </Link>
        <div style={{ position: 'absolute', left: '-2.5em' }}>
          <CategoricalSymbol for={category} small={true}></CategoricalSymbol>
        </div>
      </div>

      <div className={styles['post-preview-date']}>
        {lastUpdated}
      </div>
      {urls.map((url, index) => (
        <Icon key={index} name={url.name} alt={url.alt} href={url.href} doDisplayHref={true}></Icon>
      ))}
      <div className={styles['post-preview-summary']}>
        {summary}
      </div>
    </div>
  )
}

export default PostPreview;
