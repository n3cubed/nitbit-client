'use client'
import { useFilterBy, useAdditionalPosts, useRepoLink, getRepoLink } from '@/utils/states'
import { Section } from '@/components/Post/postParser'
import Path from '@/components/Path/Path'
import Icon from '@/components/Icon/Icon'

export default function PostsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useFilterBy();
  useAdditionalPosts();
  useRepoLink();
  const { repoLink, setRepoLink } = getRepoLink();

  return (
    <>
      {children}
      <div className='toolbar'>
        <div style={{ padding: '0 20px' }}>
          <Path></Path>
        </div>
        <div style={{ padding: '0 20px' }}>
          <Icon name='github.svg' alt='github' href={ repoLink } width={30} />
        </div>
      </div>
    </>
  )
}