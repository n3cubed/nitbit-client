"use client"

import styles from './Posts.module.css';
import Title from '../Title/Title';
import PostPreview from './PostPreview';
import CategoricalSymbol from '../CategoricalSymbol/CategoricalSymbol';
import { getAllPostProperties } from '@/utils/parsedPosts'
import { useState, useEffect, useRef } from 'react';
import { useFilter } from '@/components/ContextProvider';
import { Section, Post } from '@/utils/postParser';
import { toDate } from '@/utils/time';
import Icon from '@/components/Icon/Icon';

export interface Filter {
  category: string | null,
}

let p: { [ item: string ]: any }[] = [];
let all: { [ item: string ]: any }[] = [];

const Posts: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const postsRef = useRef<HTMLDivElement>(null);
  const { filterBy, setFilterBy } = useFilter();
  // const [ updateState, setUpdateState ] = useState({});
  const [ ps, setPs ] = useState<{ [ item: string ]: any }[]>(p);

  const getPosts = async () => {
    if (!all.length) {
      all = await getAllPostProperties();
      filterAndSort();
    }
  }

  const filterAndSort = () => {
    let f = all.filter((props) => {
      if (filterBy.category && props.category !== filterBy.category) return false;
      return true;
    });
    p = f.sort((a, b) => { return toDate(b.lastUpdated).getTime() - toDate(a.lastUpdated).getTime() })
    setPs(p);
  }

  const handleCategoryClick = (clickedCategory: string) => {
    let newCategory = clickedCategory === filterBy.category ? null : clickedCategory;
    setFilterBy({ ...filterBy, category: newCategory });
  };

  useEffect(() => {
    filterAndSort()
    getPosts();
  }, [filterBy])

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
            className={styles.categories}
            style={{
              position: "relative",
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
          {ps.length === 0 ? (
            <div className={styles.nothing}>null</div>
          ) : (
            ps.map((props, index) => (
              <PostPreview key={index} properties={props}></PostPreview>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;
