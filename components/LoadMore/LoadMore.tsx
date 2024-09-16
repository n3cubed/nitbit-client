import styles from './LoadMore.module.css'

const LoadMore: React.FC<{ doLoadMore: boolean, loadMoreAction: () => void }> = ({ doLoadMore, loadMoreAction }) => {
    if (doLoadMore) loadMoreAction();
    return <div className={styles['load-more']}>More</div>
}

export default LoadMore