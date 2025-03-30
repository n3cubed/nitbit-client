import styles from './Node.module.css';
import { Point } from './convexHull';
import * as RAPIER from '@dimforge/rapier2d-compat';

export default class Node {
  public rigidBody!: RAPIER.RigidBody;
  public element!: HTMLElement;
  protected halfExtents!: RAPIER.Vector;
  protected world!: RAPIER.World;
  protected width!: number;
  protected height!: number;
  public isInit: boolean;
  public props: { [key: string]: any } = {};

  constructor(props: { [key: string]: any } = {}) {
    this.isInit = false;
    this.props = {
      restitution: props.restitution || 1.0,
      density: props.density || 0.0,
      friction: props.friction || 0.0,
      linearDamping: props.linearDamping || 5.0,
      ccd: props.ccd || false,
      mass: props.mass || 1.0
    };
  }

  public setWorld(world: RAPIER.World) {
    if (this.world) this.isInit = false;
    this.world = world;
  }

  public setElement(element: HTMLElement) {
    if (this.element) this.isInit = false;
    this.element = element;
    this.width = element.offsetWidth;
    this.height = element.offsetHeight;
  }

  public _isInit() {
    if (this.isInit) return true;
    else if (this.world && this.element) {
      this.init()
      this.isInit = true;
      this.element.style.visibility = "visible"
      return true
    } else return false;
  }

  protected init(initialPosition?: Point) {
    this.initPhysics(initialPosition)
  }

  /**
   * should only be invoked after element renders
   */
  private initPhysics(initialPosition?: Point) {
    const element = this.element;
    if (!element) {
      throw new Error('Element not set');
    };

    const w = this.width;
    const h = this.height;
    // const x = element.clientLeft + w / 2;
    // const y = element.clientTop + h / 2;
    const x = (initialPosition?.x || element.clientLeft) + w / 2;
    const y = (initialPosition?.y || element.clientTop) + h / 2;

    const restitution = this.props.restitution;
    const density = this.props.density;
    const friction = this.props.friction;
    const linearDamping = this.props.linearDamping;
    const ccd = this.props.ccd;
    const mass = this.props.mass

    const colliderDesc = RAPIER.ColliderDesc
      .cuboid(w/2, h/2)
      .setRestitution(restitution)
      .setDensity(density)
      .setFriction(friction);

    const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(x, y)
      .setAdditionalMass(mass)
      .lockRotations()
      .setLinearDamping(linearDamping)
      .setCcdEnabled(ccd);

    const rigidBody = this.world.createRigidBody(rigidBodyDesc);
    // const collider = this.world.createCollider(colliderDesc, rigidBody);
    this.rigidBody = rigidBody;
    this.element = element;
    this.halfExtents = {x: w/2,y: h/2};
    this.isInit = true;
  }

  /**
   * Updates style
  */
  public update() {
    if (!this._isInit() || this.rigidBody.isSleeping() || this.element.offsetParent === null) return;
    const translation = this.rigidBody.translation();
    this.element.style.transform = 'translate(' + (translation.x - this.halfExtents.x) + 'px, ' + (translation.y - this.halfExtents.y) + 'px)';
  }

  public raise() {
    if (!this._isInit()) return;
    this.element.classList.add(styles.raise)
  }

  public lower() {
    if (!this._isInit()) return;
    this.element.classList.remove(styles.raise);
  }

  public setMass(mass: number) {
    if (!this._isInit()) return;
    this.rigidBody.setAdditionalMass(mass, true);
  }

  public setVel(v: RAPIER.Vector) {
    if (!this._isInit()) return;
    this.rigidBody.setLinvel(v, true);
  }

  public setPos(p: RAPIER.Vector) {
    if (!this._isInit()) return;
    this.rigidBody.setNextKinematicTranslation({
      x: p.x + this.halfExtents.x,
      y: p.y - this.halfExtents.y
    });
  }

  public translation() {
    if (!this._isInit()) return;
    return this.rigidBody.translation();
  }

  public elementPosition() {
    if (!this._isInit()) return;
    const translation = this.rigidBody.translation();
    return {
      x: translation.x - this.halfExtents.x,
      y: translation.y - this.halfExtents.y
    };
  }

  public topRightAndBottomLeft() {
    if (!this._isInit()) return;
    const translation = this.rigidBody.translation();
    return {
      topRight: { x: translation.x + this.halfExtents.x, y: translation.y + this.halfExtents.y },
      bottomLeft: { x: translation.x - this.halfExtents.x, y: translation.y - this.halfExtents.y }
    };
  }
}
