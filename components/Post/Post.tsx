import { Section } from './postParser'

const Post: React.FC<{ post: Section }> = ({ post }) => {
	const postComponent = post.generateComponent();

	return <>{postComponent}</>
}

export default Post;