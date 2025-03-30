import { getPostBySlug, getPostSlugs, getNames } from '@/utils/parsedPosts';
import { notFound } from 'next/navigation';
import Post from '@/components/Post/Post';

export async function generateStaticParams() {
  return (await getNames()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }>}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return {
      title: 'Not Found',
      description: 'Post not found'
    };
  }
  return {
    title: post.properties.title + " | nitbit",
    description: post.properties.summary || post.properties.title,
  };
}
const PostPage: React.FC<{ params: Promise<{ slug: string }>}> = async ({ params }) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return notFound();

  let repoLink;
  if (post.properties.urls) {
    repoLink = post.properties.urls.filter(
      ({ name, alt, href }: { name: string, alt: string, href: string }) => alt.includes('repo')
    )[0];
    repoLink = repoLink?.href;
  }

  return (
    <>
      <Post post={post.component} repoLink={repoLink} />
    </>
  );
};

export default PostPage;