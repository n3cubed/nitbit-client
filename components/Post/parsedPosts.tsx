import { parseRawPost } from './postParser';

export const posts = ['nitbit']

export const parsedPosts = posts.map((postname) => {
  const rawContent = require(`../../posts/${postname}.txt`).default;
  return parseRawPost(rawContent);
})


// import fs from 'fs';
// import path from 'path';
// import { parseRawPost } from './postParser';
// import { GetStaticProps } from 'next';

// const postsDirectory = path.join(process.cwd(), 'posts');

// export const getStaticProps: GetStaticProps = async () => {
//   const filenames = fs.readdirSync(postsDirectory);

//   const posts = filenames.map((filename) => {
//     const filePath = path.join(postsDirectory, filename);
//     const rawContent = fs.readFileSync(filePath, 'utf-8');

//     return {
//       title: filename.replace('.txt', ''),
//       content: parseRawPost(rawContent),
//     };
//   });

//   return {
//     props: {
//       posts,
//     },
//   };
// };