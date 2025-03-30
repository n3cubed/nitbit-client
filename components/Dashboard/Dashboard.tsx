"use client"
import styles from './Dashboard.module.css';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef} from "react-zoom-pan-pinch";
import { useState, useRef, useEffect } from "react";
import Node from "./Node";
import CoreComponent, { Core } from "./Core";
import { Brick } from "./Brick";
import SideWidget from "./SideWidget";
import { SideWidgetContext } from './SideWidget'
import stylesNode from './Node.module.css';

import * as RAPIER from '@dimforge/rapier2d-compat';

let sim: RAPIER.World;

let cores: Core[] = [
  new Core('Reddit', 'https://www.reddit.com/.rss?limit=15', 'https://www.reddit.com/'),
  new Core('r/selfhosted', 'https://www.reddit.com/r/selfhosted.rss?limit=10', 'https://www.reddit.com/r/selfhosted/'),
  new Core('r/rust', 'https://www.reddit.com/r/rust.rss?limit=15', 'https://www.reddit.com/r/rust/'),
  // new Core('Mastodon (@qaz)', 'https://hub.nitbit.dev/@qaz.rss', 'https://hub.nitbit.dev/'),
  new Core('Veritasium (YouTube)', 'https://www.youtube.com/feeds/videos.xml?channel_id=UCHnyfMqiRRG1u-2MsSQLbXA', 'https://www.youtube.com/@veritasium'),
  new Core('Hacker News Front Page', 'https://hnrss.org/frontpage', 'https://news.ycombinator.com/'),
  new Core('Hacker News Front Page 2', 'https://news.ycombinator.com/rss', 'https://news.ycombinator.com/'),
  // new Core('Dimden', 'https://dimden.dev/rss.xml', 'https://dimden.dev/'),
  new Core('purple', 'https://purplesyringa.moe/blog/feed.rss', 'https://purplesyringa.moe/blog'),
  new Core('Jeff Geerling', 'https://www.jeffgeerling.com/blog.xml', 'https://www.jeffgeerling.com/blog'),
  new Core('Paul Graham: Essays', 'http://www.aaronsw.com/2002/feeds/pgessays.rss', 'https://paulgraham.com/articles.html'),
  new Core('Hedraweb', 'https://hedraweb.blogspot.com/feeds/posts/default', 'https://hedraweb.blogspot.com/'),
  new Core('Wikipedia Featured', 'https://en.wikipedia.org/w/api.php?action=featuredfeed&feed=featured&feedformat=rss', 'https://en.wikipedia.org/wiki/Main_Page'),
  new Core('Quanta Magazine', 'https://www.quantamagazine.org/feed/', 'https://www.quantamagazine.org/'),
];


const init = async () => {
  await RAPIER.init()
  let integrationParams = new RAPIER.IntegrationParameters();
  integrationParams.dt = 1/30; // 1/60
  integrationParams.maxCcdSubsteps = 50; // 50
  integrationParams.normalizedAllowedLinearError = 0.001; // 0.001; 0.00001 (accuracy)
  // integrationParams.contact_erp = 0.2; // 0.2; 0.0001 (accuracy)
  integrationParams.minIslandSize = 128; // 128
  integrationParams.numAdditionalFrictionIterations = 4; // 4
  integrationParams.numInternalPgsIterations = 1; // 1
  integrationParams.numSolverIterations = 4; // 4; 50 (accuracy, most important)
  integrationParams.normalizedPredictionDistance = 0.002; // 0.002; 0.00001 (accuracy)

  const gravity = { x: 0.0, y: 0.0 };
  sim = new RAPIER.World(gravity, integrationParams.raw);
  cores.forEach((core)=>core.setWorld(sim));
}

init();

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const coreContainerRef = useRef<HTMLDivElement>(null)
  const selectedNodeRef = useRef<Node | null>();
  const initialPositionRef = useRef<{x: number, y: number} | null>();
  const mousePositionRef = useRef<{x: number, y: number}>();
  const hasMoved = useRef<boolean>(false);
  const [ brick, setBrick ] = useState< Brick | null>(null);
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

  const handleUp = (e: PointerEvent) => {
    const ctarget = e.currentTarget;
    if (ctarget instanceof HTMLElement) {
      ctarget.releasePointerCapture(e.pointerId);
    }
    let node = selectedNodeRef.current
    node?.setMass(1);
    node?.setVel({x: 0, y: 0});
    node?.lower();
    if (node instanceof Core) {
      const position = node.elementPosition();
      if (position) node.savePosition(position);
      if (!hasMoved.current) {
        if (node.bricks[0]?.isInit) {
          window.open(node.site, '_blank');
        } else {
          node.setBricks(node.bricks)
          node.element.classList.add(stylesNode.open);
          zoomToNode(node);
        }
      }
    } else if (node instanceof Brick && !hasMoved.current) {
      node.setSeen();
      setBrick(node);
    }
    selectedNodeRef.current = null;
  }

  const handleDown = (e: PointerEvent, cores: Core[]) => {
    if (e.target instanceof HTMLAnchorElement) {
      return;
    }

    if (e.button !== 0) return;
    const element = e.target; // the node
    if (element instanceof HTMLElement) {
      const node =
        cores.find(core => element === core.element) ||
        cores.flatMap(core => core.bricks).find(brick => element === brick.element);
      if (node) {
        hasMoved.current = false;
        node.setMass(10);
        node.raise();
        selectedNodeRef.current = node;
        initialPositionRef.current = { x: e.offsetX, y: e.offsetY } // relative to the node
        const elementPosition = selectedNodeRef.current.elementPosition();
        if (elementPosition) {
          mousePositionRef.current = {
            x: e.offsetX + elementPosition.x,
            y: e.offsetY + elementPosition.y,
          }
        }
      }
    }

    const ctarget = e.currentTarget;
    if (ctarget instanceof HTMLElement) {
      ctarget.setPointerCapture(e.pointerId);
    }
  }

  const handleMove = (e: PointerEvent) => {
    if (!selectedNodeRef.current) return;
    mousePositionRef.current = { x: e.offsetX, y: e.offsetY }
    hasMoved.current = true;
  }



  useEffect(() => {
    const coreContainer = coreContainerRef.current;
    if (!coreContainer) return;

    const downHandler = (e: PointerEvent) => handleDown(e, cores);
    const moveHandler = (e: PointerEvent) => handleMove(e);
    const upHandler = (e: PointerEvent) => handleUp(e);

    coreContainer.addEventListener("pointerdown", downHandler);
    coreContainer.addEventListener("pointermove", moveHandler);
    coreContainer.addEventListener("pointerup", upHandler);

    const updateSimulation = () => {
      if (cores.length === 0) return;

      if (selectedNodeRef.current) {
        const elementPosition = selectedNodeRef.current.elementPosition();
        if (elementPosition) {
          const vel = {
            x: (mousePositionRef.current!.x - initialPositionRef.current!.x - elementPosition.x) * 5,
            y: (mousePositionRef.current!.y - initialPositionRef.current!.y - elementPosition.y) * 5
          };
          selectedNodeRef.current.setVel(vel);
        }
      }
      if (sim) {
        sim.step();
        for (let core of cores) {
          core.update();
        }
      }
    };

    const updateInterval = setInterval(() => {
      updateSimulation();
    }, 1/30 * 1000);

    setLoading(false);

    return () => {
      coreContainer.removeEventListener("pointerdown", downHandler);
      coreContainer.removeEventListener("pointermove", moveHandler);
      coreContainer.removeEventListener("pointerup", upHandler);
      clearInterval(updateInterval);
    };
  }, []);

  const zoomToNode = (node: Node) => {
    if (transformComponentRef.current) {
      const { zoomToElement } = transformComponentRef.current;
      zoomToElement(node.element, 1);
    }
  };

  return (
    <SideWidgetContext.Provider value={{ brick, setBrick }}>
      <div className={styles.dashboard}>
        { loading && <div className={ styles.loading }>Loading dashboard...</div> }
        <TransformWrapper
          centerOnInit={true}
          initialPositionX={500}
          initialPositionY={500}
          limitToBounds={false}
          initialScale={0.15}
          minScale={0.15}
          doubleClick={{disabled: true}}
          panning={{excluded: ['disabled']}}
          ref={transformComponentRef}
        >
          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ transition: "transform 30ms linear"}} contentClass='disabled' wrapperClass={styles.wrapper}>
            <div ref={coreContainerRef}>
              {cores.map((core, i)=>
                <CoreComponent key={i} core={core}></CoreComponent>
              )}
            </div>
          </TransformComponent>
        </TransformWrapper>
        <SideWidget/>
      </div>

    </SideWidgetContext.Provider>
  )
}

export default Dashboard;
