import { posts, parsedPosts } from '@/components/Post/parsedPosts'

import Post from '@/components/Post/Post'

export async function generateStaticParams() {
  return posts.map((postname) => ({
    slug: postname
  }));
}

const PostPage: React.FC<{ params: { slug: string }}> = ({ params }) => {
  let post = parsedPosts.filter((parsedPost) => parsedPost.properties.postName === params.slug)[0];
  let repoLink;
  if (post.properties.urls) {
    repoLink = post.properties.urls.filter(({ name, alt, href }: { name: string, alt: string, href: string }) => alt.includes('repo'))[0];
    repoLink = repoLink.href;
  } else {
    repoLink = undefined;
  }

  let postComponent = post.generateComponent();

  return (
    <Post post={postComponent} repoLink={repoLink}></Post>
  );
}

export default PostPage;