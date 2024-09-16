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
let additionalPosts: number = 0, setAdditionalPosts: any;

export const getFilterBy = () => {
  return { filterBy, setFilterBy };
}

export const useFilterBy = () => {
  [filterBy, setFilterBy] = useState<Filter>({});
};

export const getAdditionalPosts = () => {
  return { additionalPosts, setAdditionalPosts };
}

export const useAdditionalPosts = () => {
  [additionalPosts, setAdditionalPosts] = useState(0);
};