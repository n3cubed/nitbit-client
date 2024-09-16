"use client";
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import styles from './Path.module.css'
import React from 'react';

const Path: React.FC = () => {
  const pathname = usePathname();
  const routes = pathname.split('/').filter((route)=> route === '' ? null : route);

  return (
    <div className={styles.path}>
      <Link className={styles.distinct} href='/'>nitbit</Link>
      {routes.map((route, index) => {
        const fullRoute = routes.slice(0,index+1).join('/');
        return (
          <React.Fragment key={index}>
            <span className={styles.divider}>/</span>
            <Link href={`/${fullRoute}`}>{route}</Link>
          </React.Fragment>
        );
      })}
    </div>
  );

}


export default Path