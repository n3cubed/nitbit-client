'use client'

import { useParams } from 'next/navigation';
import Post from '../../../components/Post/Post'

function PostPage() {
  const params = useParams();
  const { slug } = params;

  return (
    <div>
      <Post name={`${slug}`}></Post>
    </div>
  );
}

export default PostPage;