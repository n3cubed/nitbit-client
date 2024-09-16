import styles from './Post.module.css';
import React from 'react';
import { IconProps } from '../Icon/Icon';
import { timeAgo } from '@/utils/time';
import Image from 'next/image';

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
        parseItem: () => React.ReactNode,
        item: string | Section,
        index: number
      ) => React.ReactNode
    ): React.ReactNode => {
      return (
        <>
          {this.content.map((item, index) => {
            function parseItem() {
              if (typeof item === "string") return <>{item}</>;
              else return item.generateComponent();
            }
            const result = itemCallback
              ? itemCallback(parseItem, item, index)
              : parseItem();
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
        return <p>{buildChildren()}</p>

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
          <ol className={styles["o-list"]}>
            {buildChildren((parseItem, item, index) => {
              return <li>{parseItem()}</li>;
            })}
          </ol>
        );
      case Tag.UList:
        return (
          <ul className={styles["u-list"]}>
            {buildChildren((parseItem, item, index) => {
              return <li>{parseItem()}</li>;
            })}
          </ul>
        );
      // case Tag.Reveal:
      // case Tag.RevealButton:
      // case Tag.RevealContent:
      case Tag.CosmeticImage:
        return (
          <span className={`${styles['cosmetic-image']} ${this.properties.large ? styles['large'] : ''}`}>
          &nbsp;
            <img
              src={`/assets/media/posts/nitbit/${this.properties.name}`}
              alt={this.properties.alt}
            ></img>
          &nbsp;
            <img
              className={styles.enlarged}
              src={`/assets/media/posts/nitbit/${this.properties.name}`}
              alt={this.properties.alt}
            ></img>
            {buildChildren()}
          </span>
        );
      case Tag.Distinct:
        return <span className={styles.distinct}>{buildChildren()}</span>;
      case Tag.Hyperlink:
        return (
          <a className="hyperlink" href={this.properties.url}>
            {buildChildren()}
          </a>
        );
    }
  }
}

enum Tag {
  Body,
  P,
  Note,
  Exhibit,
  OList,
  UList,
  Reveal,
  RevealButton,
  RevealContent,
  CosmeticImageLarge,
  CosmeticImage,
  Distinct,
  Hyperlink,
  Code,
}

function countIndents(line: string): number {
  const leadingSpaces = line.match(/^\s*/)?.[0].length || 0;
  return Math.floor(leadingSpaces / 2);
}

export function parseRawPost(input: string): Section {
  const result = new Section(Tag.Body, [], {});

  const tagRegex = /\{([^}]*)\}/;

  let stack: Section[] = [];
  let currentSection: Section = result;
  let currentSectionIndent: number = -1;

  const lines = input.trim().split("\n");

  for (let [index, line] of lines.entries()) {
    const currentIndent = countIndents(line);
    // console.log(line)
    line = line.trim();

    if (line.startsWith("*")) {
      const [key, ...rest] = line.slice(2).split(": ");
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

    if (currentIndent > currentSectionIndent + 1)
      throw new Error(
        `No tag found on line ${index + 1} at indent ${
          currentSectionIndent + 1
        }`
      );

    const match = line.match(tagRegex);
    if (match) {
      const tag = match[1];
      if (!(tag in Tag)) throw new Error(`No tag defined for ${tag}`);

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
      currentSection.content.push(line);
    }
  }
  // console.dir(result)
  return result;
}
