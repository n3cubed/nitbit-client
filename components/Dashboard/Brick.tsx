import { timeAgoDate } from "@/utils/time";
import Node from "./Node";
import styles from './Node.module.css';
import { useEffect, useRef, useState, useContext } from 'react';

export class Brick extends Node {
  content: { [key: string]: any };
  width!: number;
  height!: number;
  placeBrick: (brick: Brick) => void;
  seen: boolean;
  id: string | null;
  getInitialPosition: () => {x:number, y:number}

  constructor(
    content: { [key: string]: any },
    placeBrick: (brick: Brick) => void,
    getInitialPosition: () => {x:number, y:number}
  ) {
    super();
    this.content = content;
    this.placeBrick = placeBrick;
    this.id = content.guid || content.id || content.link || content.title.slice(0, 10);
    if (this.id && typeof window !== 'undefined') this.seen = localStorage.getItem(this.id) === '1';
    else this.seen = false;
    this.width = this.getWidth();
    this.getInitialPosition = getInitialPosition;
  }

  private getWidth() {
    const { title, contentSnippet } = this.content;
    const titleLength = title ? title.length : 0;
    const snippetLength = contentSnippet ? contentSnippet.length : 0;
    // Sum the lengths
    const totalChars = titleLength + snippetLength;
    // Cap the maximum count used for scaling (adjust as needed)
    const cappedChars = Math.min(totalChars, 350);
    // Linearly scale from 100px (0 chars) to 600px (100 or more chars)
    const baseWidth = 150 + (cappedChars / 350) * 450;
    // Add randomization: offset between +base/10 -base/10
    const randomOffset = Math.random() * baseWidth / 5 - baseWidth / 10;
    const width = Math.max(150, Math.min(baseWidth + randomOffset, 600));
    return width;
  }

  protected init() {
    super.init(this.getInitialPosition());
    this.placeBrick(this);
  }

  public setSeen() {
    if (!this.id) return;
    if (!this.seen && this.element) {
      this.seen = true;
      localStorage.setItem(this.id, '1');
      this.element.classList.add(styles.seen)
    }
  }

  public unsetSeen() {
    if (!this.id) return;
    if (this.seen && this.element) {
      this.seen = false;
      localStorage.setItem(this.id, '0');
      this.element.classList.remove(styles.seen)
    }
  }
}


// author
// content
// contentSnippet
// id
// isoDate
// link
// pubDate
// title

export const getEmbedCode = (url: string): string | null => {
  try {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    const redditMatch = url.match(/reddit\.com\/r\/.*\/comments\/(\w+)/);
    if (redditMatch) {
      return `https://www.redditmedia.com${new URL(url).pathname}?ref_source=embed&ref=share&embed=true`;
    }

    const mastodonMatch = url.match(/(.*\/@.*\/\d+).*/);
    if (mastodonMatch) {
      return `${mastodonMatch[1]}/embed`;
    }

    return null;
  } catch (error) {
    console.error("Error generating embed URL:", error);
    return null;
  }
};

const BrickComponent: React.FC<{ brick: Brick }> = ({ brick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const initialPositionRef = useRef(brick.getInitialPosition());

  // Compute the recency-based intensity.
  const pubDate = brick.content.isoDate || brick.content.pubDate || null;
  const publicationTime = new Date(pubDate).getTime();
  const now = Date.now();
  const diff = now - publicationTime;
  // One week in milliseconds:
  const oneDay = 24 * 60 * 60 * 1000;
  // Normalized intensity: 1 for just now, 0 for one day or older.
  const intensity = Math.pow(1 - Math.min(diff / oneDay, 1),2) || 0;
  // Store the computed red color once using a ref.
  const redColorRef = useRef(
    `color-mix(in srgb, var(--high-contrast) ${100 * (1 - intensity)}%, rgb(255, 150, 150) ${100 * intensity}%)`
  )

  useEffect(() => {
    if (ref.current) {
      brick.setElement(ref.current);
    }
  }, []);

  const { content, seen } = brick;
  const title = content.title;
  const description = content.contentSnippet;
  const contentHTML = content.content;
  const link = content.link || content.id || "#";
  const author = content.author ? `by ${content.author}` : undefined;
  const formattedDate = timeAgoDate(new Date(pubDate));
  const comments = content.comments;
  const embedUrl = getEmbedCode(link);

  return (
    <div
      ref={ref}
      style={{
        width: brick.width,
        transform: `translate(${initialPositionRef.current.x}px, ${initialPositionRef.current.y}px)`,
        backgroundColor: brick.seen ? "" : redColorRef.current
      }}
      className={`${styles.brick} ${seen ? styles.seen : ""}`}
    >
      {title && (link ? <a className={styles.title} href={link} target="_blank" rel="noopener noreferrer">
        {title}
      </a> : <>{title}</>)}
      {/* {contentHTML && <div dangerouslySetInnerHTML={{ __html: contentHTML }} className={styles.content} /> } */}
      {pubDate && <div className={styles.date}>{formattedDate}</div>}
      {description && <div className={styles['description-container']}>
        <div>{description}</div>
      </div>}
      {/* {comments && <a href={
        comments.startsWith("http") ? comments : link + "#comments"
      } target="_blank" rel="noopener noreferrer" className={styles.comments}>
        Comments
      </a>} */}
    </div>
  );
};

export default BrickComponent;