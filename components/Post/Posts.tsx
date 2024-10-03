import styles from './Posts.module.css';
import Title from '../Title/Title';
import PostPreview from './PostPreview';
import CategoricalSymbol from '../CategoricalSymbol/CategoricalSymbol';
import { parsedPosts } from './parsedPosts'
import { useState, useEffect, useRef } from 'react';
import { getFilterBy, Filter, getAdditionalPosts } from '@/utils/states';
import { toDate } from '@/utils/time';
import Icon from '@/components/Icon/Icon';


const Posts: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const postsRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(400);
  const { filterBy, setFilterBy } = getFilterBy();
  const { additionalPosts, setAdditionalPosts } = getAdditionalPosts();
  const [ updateState, setUpdateState ] = useState({});
  const [ scrollSpeed, setScrollSpeed ] = useState(0);
  const [ loadMoreTranslateY, setLoadMoreTranslateY ] = useState(0);
  const timeSinceLoadMoreRef = useRef(0);

  // height
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && postsRef.current){
        // console.log(containerRef.current.clientHeight, postsRef.current.offsetTop);
        setHeight(containerRef.current.clientHeight - postsRef.current.offsetTop + containerRef.current.offsetTop);
      }
    };
    handleResize();

    window.addEventListener('resize', handleResize);
    const resizeInterval = setInterval(handleResize, 200);

    let startScrollTime = 0
    let deltaScroll = 0
    let startTouchY = 0;
    let endScroll = true;
    let moveTimeout: NodeJS.Timeout;
    function endScrollAction() {
      startScrollTime = 0;
      deltaScroll = 0;
      setScrollSpeed(0);
      endScroll = true
    }

    const handleScrollMouse = (event: WheelEvent) => {
      const currentTime = Date.now()
      if (endScroll) {
        endScroll = false;
        startScrollTime = currentTime - 1
      }
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        endScrollAction()
      }, 200)
      const deltaT = currentTime - startScrollTime
      deltaScroll += event.deltaY

      if (deltaT > 1 && deltaScroll >= 0) {
        const speed = deltaScroll / deltaT / 2.5
        setScrollSpeed(speed);
        // console.log('speed:', speed);
      }
    };

    const handleScrollTouch = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        const touch = event.touches[0];
        if (endScroll) {
          endScroll = false;
          startScrollTime = Date.now() - 1
          startTouchY = touch.clientY;
        }
        // clearTimeout(moveTimeout);
        // moveTimeout = setTimeout(() => {
        //   endScrollAction()
        //   window.removeEventListener('touchmove', handleTouchMove);
        //   window.removeEventListener('wheel', handleTouchEnd);
        // }, 1000)

        const handleTouchMove = (event: TouchEvent) => {
          // const deltaT = Date.now() - startScrollTime
          const touch = event.touches[0];
          deltaScroll = startTouchY - touch.clientY
          setScrollSpeed(deltaScroll / 40);
          // if (deltaT > 1 && deltaScroll >= 0) {
          //   setScrollSpeed(deltaScroll / deltaT * 1.2);
          //   console.log('speed:', deltaScroll / deltaT * 1.2);
          // }
        }
        const handleTouchEnd = () => {
          endScrollAction()
          window.removeEventListener('touchmove', handleTouchMove);
          window.removeEventListener('wheel', handleTouchEnd);
        }
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
      }
    };


    window.addEventListener('wheel', handleScrollMouse);
    window.addEventListener('touchstart', handleScrollTouch);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(resizeInterval);
      window.removeEventListener('wheel', handleScrollMouse);
      window.removeEventListener('touchstart', handleScrollTouch);
    }
  }, []);

  function isScrolledToBottom(element: HTMLElement) {
    return Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1
  }
  function scrollToBottom(element: HTMLElement) {
    element.scrollTop = element.scrollHeight
  }

  useEffect(() => {
    const currentTime = Date.now()
    if (
      containerRef.current
      && isScrolledToBottom(containerRef.current)
      && currentTime - timeSinceLoadMoreRef.current > 200
    ) {
      // console.log({scrollSpeed})
      setLoadMoreTranslateY(Math.max(-scrollSpeed * 14, -40));
      if (scrollSpeed > 3) {
        timeSinceLoadMoreRef.current = currentTime;
        setTimeout(()=> {
          setLoadMoreTranslateY(0);
          setAdditionalPosts((prev: number) => prev + 3);
        }, 200)
      }
    }
  }, [scrollSpeed, setAdditionalPosts])

  const handleCategoryClick = (clickedCategory: string) => {
    let newCategory = clickedCategory === filterBy.category ? undefined : clickedCategory;
    const newFilter = {
      ...filterBy,
      category: newCategory
    };
    setFilterBy(newFilter);
    setUpdateState({});
    setAdditionalPosts(0);
  };


  const filteredSortedPosts = (() => {
    const filteredPosts = parsedPosts.filter((post) => {
      const category = filterBy.category;
      return category ? (post.properties.category === filterBy.category ? post : null) : post
    })
    return filteredPosts.sort((a, b) => { return toDate(b.properties.lastUpdated).getTime() - toDate(a.properties.lastUpdated).getTime() })
  })();


  let posts = [];
  if (filteredSortedPosts.length === 0) {
    for (let i = 0; i < (height - 50) / 63 - 1; i++) {
      posts.push(<div key={i} className={styles.nothing}>null</div>)
    }
  } else {
    for (let i = 0; i < (height - 50) / 149 - 1 + additionalPosts; i++) {
      let post = filteredSortedPosts.shift();
      if (post) posts.push(<PostPreview key={i} post={post}></PostPreview>);
      else break;
    }
  }

  return (
    <div ref={containerRef} className={styles["posts-container"]}>
      <div style={{ padding: '0 10px 0 50px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: 'max-content' }}>
        <div
          className={styles['posts-header']}
          // style={{ width: `${postsRef.current ? postsRef.current.scrollWidth : 100}px`}}
        >
          <div style={{ flexGrow: 1 }}>
            <Title>POSTS</Title>
          </div>
          <div
            style={{
              position: "relative",
              right: "0px ",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {["Release", "Devlog", "Notes"].map((category, index) => {
              return (
                <div key={index} style={{ margin: "0 5px" }}>
                  <CategoricalSymbol
                    for={category}
                    dark={
                      filterBy.category ? filterBy.category !== category : false
                    }
                    onClick={() => handleCategoryClick(category)}
                  ></CategoricalSymbol>
                </div>
              );
            })}
          </div>
        </div>
        <div ref={postsRef} className={styles.posts}>
          {posts}
        </div>
      </div>
      {filteredSortedPosts.length > 0 && (
        <div
          key="loadmore"
          className={styles['load-more-container']}
          style={{
            transform: `translateX(-50%) translateY(${loadMoreTranslateY}px)`,
          }}
        >
          <div className={styles['load-more']}>
            <Icon
              name='angle-down-solid.svg'
              alt='loading...'
              width={24}
              >
            </Icon>
          </div>
        </div>
      )}
    </div>
  );

};

export default Posts;
