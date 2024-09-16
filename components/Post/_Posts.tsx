import styles from './Posts.module.css';
import Title from '../Title/Title';
import PostPreview from './PostPreview';
import CategoricalSymbol from '../CategoricalSymbol/CategoricalSymbol';
import { parsedPosts } from './parsedPosts'
import { useState, useEffect, memo, useRef } from 'react';
import { useWindowHeight } from '@/utils/window';
import LoadMore from '@/components/LoadMore/LoadMore';

interface Filter {
  category?: string,
  date?: [Date, Date],
}

const _Posts2: React.FC = memo(() => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  const [filterBy, setFilterBy] = useState<Filter>({});
  const [isMounted, setIsMounted] = useState<boolean>(false);

  //
  useEffect(() => {
    const handleResize = () => {
      if (componentRef.current) {
        const rect = componentRef.current.getBoundingClientRect();
        const top = rect.top;
        setHeight(window.innerHeight - top);
      }
    };
    handleResize();

    window.addEventListener('resize', handleResize);

    const storedFilter = sessionStorage.getItem('filterBy');
    if (storedFilter) {
      setFilterBy(JSON.parse(storedFilter));
    }
    setIsMounted(true);

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    if (isMounted) {
      sessionStorage.setItem('filterBy', JSON.stringify(filterBy));
    }
  }, [filterBy, isMounted]);

  const handleCategoryClick = (clickedCategory: string) => {
    let newCategory = clickedCategory === filterBy.category ? undefined : clickedCategory;
    setFilterBy((prevFilter) => ({
      ...prevFilter,
      category: newCategory
    }));
  };


  const filteredSortedPosts = parsedPosts.filter((post) => {
    const category = filterBy.category;
    return category ? (post.properties.category === filterBy.category ? post : null) : post
  })

  const renderPosts = () => {
    let posts = [];
    if (filteredSortedPosts.length === 0) {
      for (let i = 0; i < (height - 200) / 61; i++) {
        posts.push(<div key={i} className={styles.nothing}>NULL</div>)
      }
    } else {
      posts = filteredSortedPosts.map((post, index) => {
        return <PostPreview key={index} post={post}></PostPreview>
      })
      posts.push(
        <div style={{ margin: '50px auto', }}>
          <LoadMore />
        </div>
      )
    }
    return posts;
  }

  return (
    <div ref={componentRef} className={styles.posts}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <div style={{ flexGrow: 1, }}>
          <Title>POSTS</Title>
        </div>
        <div style={{ position: 'relative', right: '0px ', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {
          ['Release', 'Devlog', 'Notes'].map((category, index) => {
            return (
              <div key={index} style={{ margin: "0 5px" }}>
                <CategoricalSymbol
                  for={category}
                  dark={ !isMounted ? true : filterBy.category ? filterBy.category !== category : false }
                  onClick={() => handleCategoryClick(category)}
                ></CategoricalSymbol>
              </div>
            );
          })
        }
        </div>
      </div>
      { isMounted && renderPosts()}
    </div>
  );

});

export default _Posts2;
