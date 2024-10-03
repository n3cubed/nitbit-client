'use client'
import { useFilterBy, useAdditionalPosts } from '@/utils/states'
import Path from '@/components/Path/Path'
import Icon from '@/components/Icon/Icon'

export default function PostsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useFilterBy();
  useAdditionalPosts();
  return (
    <>
      {children}
    </>
  )
}