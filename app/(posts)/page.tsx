'use client';

import MainButton from '@/components/MainButton/MainButton';
import ActivityGraph from '@/components/ActivityGraph/ActivityGraph';
import Icon from '@/components/Icon/Icon';
import Logo from '@/components/Logo/Logo';
import Posts from '@/components/Post/Posts';
import styles from './page.module.css';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Jason from '@/components/events/Jason';
import Head from 'next/head';

const Home: React.FC = () => {
  const router = useRouter()
  const [isExpandPosts, setIsExpandPosts] = useState(false);
  const [upperHomeHeight, setUpperHomeHeight] = useState(0);

  const upperHomeRef = useRef<HTMLDivElement>(null);

  // if (typeof window !== 'undefined') {
  //   const storedTheme = localStorage.getItem('theme') as Theme;
  //   document.body.classList.add(themes[storedTheme]);
  // }

  useEffect(() => {
    if (upperHomeRef.current) {
      setUpperHomeHeight(upperHomeRef.current.clientHeight);
    }
  }, [upperHomeRef])

  const handleExpandPosts = () => {
    setIsExpandPosts(true);
    router.prefetch('/posts');
    setTimeout(()=>{
      router.push('/posts');
    }, 1000)
  };

  return (
    <>
      <div
        ref={upperHomeRef}
        className={`${isExpandPosts ? styles['expanded'] : ''} ${styles['upper-home'] }`}
        style={{marginTop: isExpandPosts ? `${-upperHomeHeight}px` : undefined }}
      >
        <div className={styles['main-buttons']}>
          <MainButton type='Dashboard' />
          <MainButton type='Posts'  />
          <MainButton type='Wip' />
        </div>

        <ActivityGraph />
        <div style={{ flexGrow: 1, marginLeft: '20px', marginRight: '50px' }}>
        </div>

        <div
          onClick={handleExpandPosts}
          className={`${styles['expand-posts']} ${
            isExpandPosts ? styles['expanded'] : ''
          }`}
          style={{
            position: 'absolute',
            bottom: '-85px',
            right: '20px',
            zIndex: 7,
          }}
        >
          <Icon name='arrow-up-right-light.svg' alt='expand' width={20}></Icon>
        </div>

        {/* <Jason></Jason> */}


        {/* <div style={{ position: 'relative', paddingRight: '20px' }}>
          <Logo />
        </div> */}
      </div>
      <Posts />
    </>
  );
}

export default Home;
