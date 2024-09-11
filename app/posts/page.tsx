"use client";

import PostsComponent from "../../components/Post/Posts";

const Posts: React.FC = () => {
  return (
      <div style={{ position: 'relative', margin:'auto', right: '-30px' }}>
        <PostsComponent />
      </div>
  );
};

export default Posts;