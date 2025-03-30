import Posts from "@/components/Post/Posts";

export const metadata = {
  title: "Posts | nitbit",
  description: "Explore all posts on nitbit",
};

const PostsPage: React.FC = () => {
  return (
    <>
      <Posts />
    </>
  )
};

export default PostsPage;