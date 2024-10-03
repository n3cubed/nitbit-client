'use client'
import "@/styles/nord.css";
// import { Section } from './postParser'
import styles from './Post.module.css'
import hljs from 'highlight.js/lib/common';
import { useEffect } from "react";
const Post: React.FC<{ post: React.ReactNode }> = ({ post }) => {
	// const postComponent = post;

	useEffect(() => {
		hljs.highlightAll();
	});


	return (
		// <div className={styles.post}>
		<>
			{post}
		</>
		// </div>


	)
}

export default Post;