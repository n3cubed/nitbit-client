import { posts, parsedPosts } from '@/components/Post/parsedPosts'

import Post from '@/components/Post/Post'

export async function generateStaticParams() {
  return posts.map((postname) => ({
    slug: postname
  }));
}

const PostPage: React.FC<{ params: { slug: string }}> = ({ params }) => {
  let post = parsedPosts.filter((parsedPost) => parsedPost.properties.postName === params.slug)[0];
  let postComponent = post.generateComponent();

  return (
    <Post post={postComponent}></Post>
  );
}

export default PostPage;