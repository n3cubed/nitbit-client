'use client'
import { useFilterBy, useAdditionalPosts } from '@/utils/states'

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