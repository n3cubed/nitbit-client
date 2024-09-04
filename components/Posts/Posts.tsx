import styles from './Posts.module.css';
import Title from '../Title/Title';
import PostPreview from '../PostPreview/PostPreview';
import CategoricalSymbol from '../CategoricalSymbol/CategoricalSymbol';

const Posts: React.FC = () => {
  const urls = [
    {
      name: 'link.svg',
      alt: 'nitbit.dev',
      href: 'https://nitbit.dev',
    },
  ];
  return (
    <div className={styles.posts}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div>
          <Title>POSTS</Title>
        </div>
        <div style={{ position: 'absolute', right: '60px ', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ margin: '0 3px'}}>
            <CategoricalSymbol for='Release'></CategoricalSymbol>
          </div>
          <div style={{ margin: '0 3px'}}>
            <CategoricalSymbol for='Devlog'></CategoricalSymbol>
          </div>
          <div style={{ margin: '0 3px'}}>
            <CategoricalSymbol for='Notes'></CategoricalSymbol>
          </div>
        </div>
      </div>
      <PostPreview
        title='nitbit'
        postName='nitbit'
        category='Release'
        lastUpdated='updated 2 months ago'
        urls={urls}
        summary='A website made for experimental things.'
        content='something'
      ></PostPreview>
    </div>
  );
};

export default Posts;
