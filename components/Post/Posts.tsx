import styles from './Posts.module.css';
import Title from '../Title/Title';
import PostPreview from './PostPreview';
import CategoricalSymbol from '../CategoricalSymbol/CategoricalSymbol';
import { Section } from './postParser'
import { parsedPosts } from './parsedPosts'

const Posts: React.FC = () => {
  return (
    <div className={styles.posts}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div>
          <Title>POSTS</Title>
        </div>
        <div style={{ position: 'absolute', right: '60px ', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ margin: '0 5px'}}>
            <CategoricalSymbol for='Release'></CategoricalSymbol>
          </div>
          <div style={{ margin: '0 5px'}}>
            <CategoricalSymbol for='Devlog'></CategoricalSymbol>
          </div>
          <div style={{ margin: '0 5px'}}>
            <CategoricalSymbol for='Notes'></CategoricalSymbol>
          </div>
        </div>
      </div>
      {parsedPosts.map((post, index) => {
        return <PostPreview key={index} post={post}></PostPreview>
      })}
    </div>
  );
};

export default Posts;
