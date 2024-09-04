import styles from './Post.module.css'

interface Post {
  title: string
  postName: string
  category: string
  lastUpdated: string
  links: string[]
  summary: string
  body: Section
}

class Section {
  tag: Tag;
  content: Array<string | Section>;
  properties: { [key: string]: string };

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
    const generateComponentInner = (section: Section, itemCallback?: (parseItem: () => React.ReactNode, item: string | Section, index: number) => React.ReactNode): React.ReactNode => {
      return (
        <>
          {
            section.content.map((item, index) => {
              function parseItem() {
                if (typeof item === 'string')
                  return <p key={index}>{item}</p>
                else
                  item.generateComponent()
              }
              itemCallback ? itemCallback?.(parseItem, item, index) : parseItem();
            }
          )}
        </>
      );
    };

    switch (this.tag) {
      case Tag.Body:
        const { title, postName ,category, lastUpdated, links, summary, author } = this.properties;
        return (
          <div className={styles['article']}>
            <div className={styles['article-header']}>
              <div className={styles['article-title']}>{title}</div>
              <div className={styles['details']}>
                <div className={styles['last-updated']}>{lastUpdated}</div>
                <div className={styles['author']}>{author}</div>
              </div>
            </div>
            {generateComponentInner(this)}
          </div>
        );
      case Tag.Note:
        return <span>{generateComponentInner(this)}</span>;
      case Tag.Exhibit:
        return <span>{generateComponentInner(this)}</span>;
      case Tag.OList:
        return (
          <ol>
            {
              generateComponentInner(
                this,
                (parseItem, item, index) => {
                  return <li>{index}{parseItem()}</li>
                }
              )
            }
          </ol>
        )
      case Tag.UList:
      case Tag.Reveal:
      case Tag.RevealButton:
      case Tag.RevealContent:
      case Tag.CosmeticImage:
      case Tag.Distinct:
      case Tag.Hyperlink:

    }
  }
}

enum Tag {
  Body,
  Note,
  Exhibit,
  OList,
  UList,
  Reveal,
  RevealButton,
  RevealContent,
  CosmeticImage,
  Distinct,
  Hyperlink,
};

function countIndents(line: string): number {
  const leadingSpaces = line.match(/^\s*/)?.[0].length || 0;
  return Math.floor(leadingSpaces / 2);
}

export function parseRawPost(input: string): Post {

  const result = {
    title: '',
    postName: '',
    category: '',
    lastUpdated: '',
    links: [''],
    summary: '',
    body: new Section(Tag.Body, [], {})
  }

  const tagRegex = /\{([^}]*)\}/;

  let stack: Section[] = []
  let currentSection: Section = result.body;
  let currentIndent: number = 0;
  let previousIndent: number = 0;

  const lines = input.trim().split('\n');

  for (let [index, line] of lines.entries()) {
    currentIndent = countIndents(line);
    line = line.trim();

    if (line.startsWith('*')) {
      const [key, ...rest] = line.slice(2).split(': ');
      const value = rest.join(': ');
      currentSection.properties[key] = value

      // if (key === 'title') result.title = value;
      // else if (key === 'post_name') result.postName = value;
      // else if (key === 'last_modified') result.lastUpdated = value;
      // else if (key === 'category') result.category = value;
      // else if (key === 'link') result.links.push(value);
      // else if (key === 'summary') result.summary = value;
      continue
    }

    if (currentIndent < previousIndent) {
      const diff = previousIndent - currentIndent - 1;
      stack.splice(-diff, diff);
      currentSection = stack.pop() as Section;
    }

    const match = line.match(tagRegex);
    if (match) {
      const tag = match[1];
      if (!(tag in Tag))
        throw new Error(`No tag defined for ${tag}`)
      if (currentIndent > previousIndent + 1)
        throw new Error(`No tag found on line ${index+1} at indent ${previousIndent+1}`)
      if (currentIndent === previousIndent + 1)
        stack.push(currentSection)

      const newSection: Section = new Section(Tag[tag as keyof typeof Tag], [], {})
      currentSection.content.push(newSection)
      currentSection = newSection
    } else {
      currentSection.content.push(line)
    }

    previousIndent = currentIndent;
  }
  return result
}
