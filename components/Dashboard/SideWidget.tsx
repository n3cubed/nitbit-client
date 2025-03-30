import { useState, useEffect, createContext, useContext, MouseEventHandler, } from "react";
import styles from "./Node.module.css";
import { Brick, getEmbedCode } from "./Brick";

interface SideWidgetContextProps {
  brick: Brick | null;
  setBrick: (brick: Brick | null) => void;
}

export const SideWidgetContext = createContext<SideWidgetContextProps>({
  brick: null,
  setBrick: () => {}
});

export const useSideWidgetContent = () => useContext(SideWidgetContext);


const SideWidget: React.FC = () => {
  const [close, setClose] = useState(true);
  const { brick, setBrick } = useSideWidgetContent();

  const content = brick?.content;
  const seen = brick?.seen;

  const title = content?.title;
  const description = content?.contentSnippet;
  const contentHTML = content?.content;
  const guid = content?.guid;
  const link = content?.link || content?.id || "#";
  const author = content?.author || content?.creator || null;
  const pubDate = content?.isoDate || content?.pubDate || null;
  const formattedDate = pubDate ? new Date(pubDate).toLocaleString() : "idk when";
  const comments = content?.comments;

  const embedUrl = getEmbedCode(link);

  const onClose = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    setBrick(null);
    setClose(true);
  }

  const unsetSeen = (e: React.MouseEvent) => {
    brick?.unsetSeen();
    onClose(e);
  }

  useEffect(() => {
    console.log(brick?.content)
    if (brick) setClose(false);
  }, [brick]);

  return (
    <>
      <div className={`${styles['widget-container']} ${close ? styles.close : ""}`} onClick={onClose}>
        <div className={styles.widget}>
          {title && (link ? <a className={styles.title} href={link} target="_blank" rel="noopener noreferrer">
            {title}
          </a> : <>{title}</>)}
          {author && <div className={styles.author}>by {author}</div>}
          {pubDate && <div className={styles.date}>{formattedDate}</div>}
          {contentHTML && <div dangerouslySetInnerHTML={{ __html: contentHTML }} className={styles.content} /> }
          {/* {description && <div className={styles['description-container']}>
            <p>{description}</p>
          </div>} */}

          {/* Show Embed if available */}
          {embedUrl && (
            <div className={styles['embed-container']}>
              <iframe
                src={embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.embed}
                // onLoad={((o)=>{o.style.height=o.contentWindow.document.body.scrollHeight+"px"})(this)}
                seamless={true}
                onLoad={(e) => {
                  const iframe = e.target as HTMLIFrameElement;
                  iframe.style.height = iframe.contentWindow!.document.body.scrollHeight + "px";
                }}
              ></iframe>
            </div>
          )}
          {seen && <button className={styles['unseen-button']} onClick={unsetSeen}>unset seen</button>}
        </div>
      </div>
    </>
  );
};

export default SideWidget;