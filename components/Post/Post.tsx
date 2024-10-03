'use client'
import "@/styles/nord.css";
import styles from './Post.module.css'
import hljs from 'highlight.js/lib/common';
import { useEffect, useState } from "react";
import { getRepoLink } from '@/utils/states'
const Post: React.FC<{ post: React.ReactNode, repoLink: string }> = ({ post, repoLink }) => {
	// const postComponent = post;
	const [ updateState, setUpdateState ] = useState({});

	useEffect(() => {
		hljs.highlightAll();
	});

	useEffect(()=>{
		const { repoLink: repoLinkState, setRepoLink } = getRepoLink();
		if (repoLink) {
			setRepoLink(repoLink);
			setUpdateState({});
			console.log(repoLink)
		} else {
			setRepoLink("https://github.com/n3cubed");
		}
    }, [repoLink]);

	return (
		<>
			{post}
		</>
	)
}

export default Post;