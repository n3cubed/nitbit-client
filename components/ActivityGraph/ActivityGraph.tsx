import styles from './ActivityGraph.module.css'


const ActivityGraph: React.FC = () => {
    return (
        <div style={{  zIndex:'-1', position:'absolute', width: '100vw', overflow:'hidden'}}>
            <div style={{position:'relative', left:'60px',display:'flex', justifyContent: 'center', height: "max-content", padding: '4px 0', background: "repeating-linear-gradient(45deg, black, black 10px, yellow 10px, yellow 20px)"}}>
                <span  style={{ borderRadius: '5px', padding: '0 40px', backgroundColor: 'yellow'}}>Under construction</span>
            </div>
        </div>
    );
}



export default ActivityGraph;