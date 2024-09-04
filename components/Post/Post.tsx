import { parseRawPost } from './postParser'

const Post: React.FC<{ name: string }> = ({ name }) => {
	const rawContent = require(`../../posts/${name}.txt`).default
	const post = parseRawPost(rawContent);

	const postComponent = post.body.generateComponent();

	return <>{postComponent}</>
}

export default Post;