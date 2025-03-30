import Node from "./Node";
import * as RAPIER from '@dimforge/rapier2d-compat';
import styles from './Node.module.css';
import BrickComponent, { Brick } from './Brick'
import { useEffect, useRef, useState } from 'react';
import { getRectilinearHull, addRectToHull, Point, AttachmentPoint, Hull} from './convexHull';

interface CoreStorage {
  source: string;
  position: Point;
}


export class Core extends Node {
  name: string;
  hull!: Hull;
  source: string;
  bricks: Brick[];
  setBricks!: (bricks: Brick[]) => void;
  site: string;

  constructor(name: string, source: string, site: string) {
    super({ mass: 10, linearDamping: 50 });
    this.name = name;
    this.source = source;
    this.bricks = [];
    this.getFeed();
    this.site = site
  }

  init() {
    const core: CoreStorage = JSON.parse(localStorage.getItem(this.source) || '{}');
    super.init(core.position);
  }

  savePosition(newPosition: Point) {
    const core: CoreStorage = { source: this.source, position: newPosition }
    localStorage.setItem(this.source, JSON.stringify(core));
  }

  setWorld(world: RAPIER.World) {
    super.setWorld(world);
    this.bricks.forEach(brick=>brick.setWorld(world))
  }

  async getFeed() {
    try {
      let response = await fetch(`/api/rss?url=${encodeURIComponent(this.source)}`);
      if (!response.ok) throw new Error('Failed to fetch RSS');

      const feed = (await response.json()).rss;
      console.log(feed);

      // Sort items from newest to oldest
      const sortedItems: any[] = feed.items.sort((a: any, b: any) => {
        const aDate = new Date(a?.isoDate || a?.pubDate || 0).getTime();
        const bDate = new Date(b?.isoDate || b?.pubDate || 0).getTime();
        return bDate - aDate;
      });

      sortedItems.forEach(item => {
        this.addBrick(
          new Brick(
            item,
            ((brick: Brick) => this.placeBrick(brick, true)).bind(this),
            (() => this.rigidBody.translation()).bind(this)
          )
        );
      });
    } catch (error) {
      if (this.element) this.element.classList.add(styles.failed);
      console.error(error);
    }
  }

  private initPlace() {
    const center = this.rigidBody.translation();
    const points: Point[] = [];

    const gap = 50
    points.push({x: center.x + this.halfExtents.x + gap, y: center.y + this.halfExtents.y + gap});
    points.push({x: center.x - this.halfExtents.x - gap, y: center.y - this.halfExtents.y - gap});

    this.hull = getRectilinearHull(points, center, [])

    // for (let brick of this.bricks) {
    // let i = 0;
    // let a = setInterval(()=>{
    //   let brick = this.bricks[i];
    //   const brickPos = this.placeBrick(brick, center, points)
    //   points.push({x: brickPos.x + brick.width, y: brickPos.y });
    //   points.push({x: brickPos.x, y: brickPos.y - brick.height });
    //   i++
    //   if (i >= this.bricks.length) {
    //     clearInterval(a);
    //   }
    // }, 20)
    // }
  }

  getAllPoints() {
    if (!this._isInit()) return;
    const points: Point[] = []
    let { topRight, bottomLeft } = this.topRightAndBottomLeft()!;
    points.push(topRight, bottomLeft);
    for (let brick of this.bricks) {
      let { topRight, bottomLeft } = brick.topRightAndBottomLeft()!;
      points.push(topRight, bottomLeft);
    }
    return points
  }

  public addBrick(brick: Brick) {
    this.bricks.push(brick);
    // if (this.element) {
    //   this.setBricks([...this.bricks])
    // }
    if (this.world) {
      brick.setWorld(this.world);
    }
  }

  private placeBrick(brick: Brick, usePrevious?: boolean) {
    if (!this._isInit()) return;
    if (!brick._isInit()) return;
    if (usePrevious && !this.hull) this.initPlace()
    const points = usePrevious ? this.hull.points : this.getAllPoints()!;
    const center = this.rigidBody.translation();
    const brickPos = addRectToHull(brick.width, brick.height, this.hull)
    brick.setPos(brickPos);
    this.hull.points.push({x: brickPos.x + brick.width, y: brickPos.y });
    this.hull.points.push({x: brickPos.x, y: brickPos.y - brick.height });
    this.hull = getRectilinearHull(points, center, this.hull.concaveCache)
    const centerBrick = {x: brickPos.x + brick.width / 2, y: brickPos.y - brick.height / 2}
    this.anchorWithSpring(this.rigidBody, brick.rigidBody, centerBrick, center);
  }

  private anchorWithSpring(parent: RAPIER.RigidBody, body: RAPIER.RigidBody, brickPos: RAPIER.Vector, parentPos: RAPIER.Vector) {
    if (!this._isInit()) return;
    const jointdata = RAPIER.JointData.spring(0, 50, 5, new RAPIER.Vector2(0, 0), new RAPIER.Vector2(brickPos.x - parentPos.x, brickPos.y - parentPos.y));
    const spring = this.world.createImpulseJoint(jointdata, body, parent, false);
    return spring;
  }

  public update() {
    super.update()
    this.bricks.forEach(brick=>brick.update())
  }
}

// e.g. <CoreC
const CoreComponent: React.FC<{core: Core}> = ({ core }) => {
  // const position = core.elementPosition();
  const ref = useRef<HTMLDivElement>(null);
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [hueRot, setHueRot] = useState(200);

  useEffect(()=>{
    setHueRot(Math.floor(Math.random() * 360));
    const coreElement = ref.current;
    // const handleClick = () => {
    //   if (coreElement) {
        // setBricks([...core.bricks])
    //   }
    // }

    if (coreElement) {
      core.setElement(coreElement);
      core.setBricks = setBricks;
      // coreElement.addEventListener('pointerdown', handleClick, { once: true })
    }

    // return () => {
    //   if (coreElement) {
    //     coreElement.removeEventListener('pointerdown', handleClick)
    //   }
    // }
  }, [core])

    const handleEnlargedPointerDown = (e: React.PointerEvent) => {
    // Stop the event on the enlarged element.
    e.stopPropagation();
    // Optionally prevent default if needed.
    e.preventDefault();
    if (ref.current) {
      // Create a new pointer event using the original event's properties.
      const newEvent = new PointerEvent(e.type, e.nativeEvent);
      // Dispatch it on the parent element (i.e. core's main element).
      ref.current.dispatchEvent(newEvent);
    }
  };


  return (
    <div>
      <div ref={ref} style={{backgroundColor: "color-mix(in srgb, var(--high-contrast) 50%, rgb(79, 219, 79) 50%)", filter: `hue-rotate(${hueRot}deg)`}} className={styles.core}>
        <div className={styles['enlarged-name']} onPointerDown={handleEnlargedPointerDown}>
          {core.name}
        </div>
        {core.name}
      </div>
      { bricks.map((brick, i)=><BrickComponent key={i} brick={brick}></BrickComponent>)}
    </div>
  )
}

export default CoreComponent;