'use client'
import { useState, useEffect } from 'react';

const useWindowHeight = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowHeight;
};

export interface Filter {
  category?: string,
  date?: [Date, Date],
}

let filterBy: Filter = {}, setFilterBy: any;

export const getFilterBy = () => {
  return { filterBy, setFilterBy };
}

export const useFilterBy = () => {
  [filterBy, setFilterBy] = useState<Filter>({});
};

let additionalPosts: number = 0, setAdditionalPosts: any;
export const getAdditionalPosts = () => {
  return { additionalPosts, setAdditionalPosts };
}

export const useAdditionalPosts = () => {
  [additionalPosts, setAdditionalPosts] = useState(0);
};

let repoLink: string = "https://github.com/n3cubed", setRepoLink: any;
export const getRepoLink = () => {
  return { repoLink, setRepoLink };
};

export const useRepoLink = () => {
  [repoLink, setRepoLink] = useState("https://github.com/n3cubed");
};