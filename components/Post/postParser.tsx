import styles from './Post.module.css';
import React from 'react';
import { IconProps } from '../Icon/Icon';
import { timeAgo } from '@/utils/time';
import Image from 'next/image';

let postNameLabel: string;

export class Section {
  tag: Tag;
  content: Array<string | Section>;
  properties: { [key: string]: any };


  constructor(
    tag: Tag,
    content: Array<string | Section> = [],
    properties: { [key: string]: string }
  ) {
    this.tag = tag;
    this.content = content;
    this.properties = properties;
  }

  generateComponent(): React.ReactNode {
    // console.log(this.tag)
    const buildChildren = (
      itemCallback?: (
        parseItem: (item: string | Section) => React.ReactNode,
        item: string | Section,
        index: number
      ) => React.ReactNode
    ): React.ReactNode => {
      return (
        <>
          {this.content.map((item, index) => {
            function parseItem(item: string | Section) {
              if (typeof item === "string") {
                return   <span style={{ whiteSpace: 'pre-wrap' }}>{item}</span>;
              }
              else return item.generateComponent();
            }
            const result = itemCallback
              ? itemCallback(parseItem, item, index)
              : parseItem(item);
            return <React.Fragment key={index}>{result}</React.Fragment>;
          })}
        </>
      );
    };

    switch (this.tag) {
      case Tag.Body:
        const {
          title,
          postName,
          category,
          lastUpdated,
          links,
          summary,
          author,
        } = this.properties;
        postNameLabel = postName
        const lastUpdatedAgo = timeAgo(lastUpdated);
        return (
          <div className={styles["article"]}>
            <div className={styles["article-header"]}>
              <div className={styles["article-title"]}>{title}</div>
              <div className={styles["details"]}>
                <div className={styles["last-updated"]}>
                  {lastUpdatedAgo}
                  <div className={styles["last-updated-date"]}>
                    {lastUpdated}
                  </div>
                </div>
                <div className={styles["author"]}>{author}</div>
              </div>
            </div>
            {buildChildren()}
          </div>
        );

      case Tag.P:
        return <p className={styles.p}>{buildChildren()}</p>
      case Tag.P2:
        return <p className={styles.p2}>{buildChildren()}</p>

      case Tag.Note:
        return (
          <>
            <span className={styles["note-reference"]}></span>
            <div className={styles.note}>{buildChildren()}</div>
          </>
        );
      case Tag.Exhibit:
        return <div className={styles.exhibit}>{buildChildren()}</div>;
      case Tag.OList:
        return (
          <ol start={this.properties.start} className={styles["o-list"]}>
            {buildChildren((parseItem, item, index) => {
              item = typeof item === 'string' ? item.trim() : item
              return <li className={styles.li}>{parseItem(item)}</li>;
            })}
          </ol>
        );
      case Tag.UList:
        return (
          <ul className={styles["u-list"]}>
            {buildChildren((parseItem, item, index) => {
              item = typeof item === 'string' ? item.trim() : item
              return <li>{parseItem(item)}</li>;
            })}
          </ul>
        );
      // case Tag.Reveal:
      // case Tag.RevealButton:
      // case Tag.RevealContent:
      case Tag.InlineImage:
        return (
          <span className={`${styles['inline-image']} ${this.properties.large ? styles['large'] : ''}`}>
          &nbsp;
            <Image
              src={`/assets/media/posts/${postNameLabel}/${this.properties.name}`}
              alt={this.properties.alt}
              width={300}
              height={300}
            ></Image>
          &nbsp;
            <Image
              className={styles.enlarged}
              src={`/assets/media/posts/${postNameLabel}/${this.properties.name}`}
              alt={this.properties.alt}
              width={300}
              height={300}
            ></Image>
            {buildChildren()}
          </span>
        );
      case Tag.Image:
        return (
          <Image
            className={styles.image}
            src={`/assets/media/posts/${postNameLabel}/${this.properties.name}`}
            alt={this.properties.alt}
            width={300}
            height={300}
            style={{ width: this.properties.width, height: 'auto' }}
          >
          </Image>

        )
      case Tag.Video:
        return (
          <div>
            <video className={styles.video} controls>
              <source src={`/assets/media/posts/${postNameLabel}/${this.properties.name}`}/>
              Your browser cannot show this video.
            </video>
          </div>
        )
      case Tag.VideoExt:
        return (
          <iframe
            className={styles['video-ext']}
            width="300"
            height="300"
            src={`https://www.youtube.com/embed/${this.properties.id}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
          />
        )
      case Tag.Distinct:
        return <span className={styles.distinct}>{buildChildren()}</span>
      case Tag.Hyperlink:
        console.log(this.properties.urls[0].alt)
        return (
          <>
            &nbsp;
            <a className={styles.hyperlink} href={this.properties.urls[0].href}>
              {this.properties.urls[0].alt}{buildChildren()}
            </a>
            &nbsp;
          </>
        );
      case Tag.Code:
        // const lang = this.properties.lang;
        return (
          <div className={styles['code-container']}>
            <pre className={styles.code}>
              <code>{buildChildren()}</code>
            </pre>
            <div className={styles['code-background']}></div>
          </div>
        );
      case Tag.CodeWide:
        // const lang = this.properties.lang;
        return (
          <div className={`${styles['code-container']} ${styles.wide}`}>
            <pre className={styles.code}>
              <code>{buildChildren()}</code>
            </pre>
            <div className={`${styles['code-background']} ${styles.wide}`}></div>
          </div>
        );
      case Tag.InlineCode:
        return <code className={styles['inline-code']}>{buildChildren()}</code>
      case Tag.Italics:
        return <i>{buildChildren()}</i>
      case Tag.Bold:
        return <b>{buildChildren()}</b>
      case Tag.Group:
        return <div className={styles.group}>{buildChildren()}</div>
    }
  }
}

enum Tag {
  Body,
  P,
  P2,
  Note,
  Exhibit,
  OList,
  UList,
  Reveal,
  RevealButton,
  RevealContent,
  InlineImageLarge,
  InlineImage,
  Image,
  Video,
  VideoExt,
  Distinct,
  Hyperlink,
  Code,
  CodeWide,
  InlineCode,
  Italics,
  Bold,
  Group,

}

function countIndents(line: string): number {
  const leadingSpaces = line.match(/^\s*/)?.[0].length || 0;

  return Math.floor(leadingSpaces / 2);
}


function parseString(input: string): Array<string | Section> {
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const italicsRegex = /\*([^*]+)\*/g;
  const codeRegex = /\`([^`]+)\`/g;
  const distinctRegex = /\!\*([^`]+)\*\!/g;

  const result: Array<string | Section> = [];

  // Combine all regexes to identify any tag in the input
  const combinedRegex = new RegExp(`${boldRegex.source}|${italicsRegex.source}|${codeRegex.source}|${distinctRegex.source}`, 'g');
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Iterate through all matches
  while ((match = combinedRegex.exec(input)) !== null) {
    // Add the plain text before the tag (if any)
    if (match.index > lastIndex) {
      result.push(input.slice(lastIndex, match.index));
    }

    // Identify the type of tag and push to result
    let tag, content;
    if (match[1]) {
      tag = Tag.Bold
      content = match[1];
      // Bold match
    } else if (match[2]) {
      // Italics match
      tag = Tag.Italics
      content = match[2];
    } else if (match[3]) {
      // Code match
      tag = Tag.InlineCode
      content = match[3];
    } else if (match[4]) {
      // Code match
      tag = Tag.Distinct
      content = match[4];
    }
    if (tag && content) {
      const newSection: Section = new Section(
        tag,
        [content],
        {}
      );
      result.push(newSection);
    }

    lastIndex = combinedRegex.lastIndex;
  }

  // Add any remaining plain text after the last tag
  if (lastIndex < input.length) {
    result.push(input.slice(lastIndex));
  } else {
    result.push('');
  }

  return result;
}

export function parseRawPost(input: string): Section {
  const result = new Section(Tag.Body, [], {});

  const tagRegex = /^§([^]*)/;

  let stack: Section[] = [];
  let currentSection: Section = result;
  let currentSectionIndent: number = -1;

  const lines = input.trim().split("\n");

  for (let [index, line] of lines.entries()) {
    const currentIndent = countIndents(line);
    // console.log(line)


    let trimmedLine = line.trim()

    if (trimmedLine.startsWith("*")) {
      const [key, ...rest] = trimmedLine.slice(2).split(": ");
      if (key && rest) {
        const value = rest.join(": ");
        if (key === "url") {
          const urlProps = value.split(", ");
          const url: IconProps = {
            name: urlProps[0],
            alt: urlProps[1],
            href: urlProps[2],
          };
          currentSection.properties["urls"] = (
            currentSection.properties["urls"] || []
          ).concat(url);
        } else currentSection.properties[key] = value;
      }
      continue;
    }

    // console.log({currentIndent})
    if (currentIndent <= currentSectionIndent) {
      const diff = currentSectionIndent - currentIndent;
      // console.log({diff})

      stack.splice(-diff, diff);
      currentSection = stack.pop() as Section;

      currentSectionIndent = currentIndent - 1;
    }


    let match = trimmedLine.match(tagRegex);
    if (match) {
      if (currentIndent > currentSectionIndent + 1)
        throw new Error(
          `No tag found on line ${index + 1} at indent ${
            currentSectionIndent + 1
          }`
        );
      let tag = match[1];
      if (!(tag in Tag)) throw new Error(`No tag defined for ${tag} on line ${index + 1}`);

      if (currentIndent === currentSectionIndent + 1)
        stack.push(currentSection);

      const newSection: Section = new Section(
        Tag[tag as keyof typeof Tag],
        [],
        {}
      );
      currentSection.content.push(newSection);
      currentSection = newSection;

      currentSectionIndent = currentIndent;
    } else {
      line = line.substring((currentSectionIndent + 1) * 2);
      line = line.replace(/\r$/, '');

      // add \n for block of text
      let prevContent = currentSection.content.at(-1);
      if (typeof prevContent === 'string') {
        line = '\n' + line;
      }
      let contents = parseString(line);
      currentSection.content = currentSection.content.concat(contents);
    }
  }
  // console.dir(result)
  return result;
}