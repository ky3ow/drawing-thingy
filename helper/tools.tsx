import { BsFillCursorFill, BsFillEraserFill } from 'react-icons/bs';
import { GiPaintBrush } from 'react-icons/gi';
import { BiCircle, BiRectangle } from 'react-icons/bi';
import { HiArrowNarrowLeft } from 'react-icons/hi';
import { AiOutlineLine } from 'react-icons/ai';
import { sizes } from '../components/base/ButtonBase';
import nextId from 'react-id-generator';
import {
  drawArrowHead,
  drawCircle,
  drawLine,
  drawRect,
  getDistance,
  getSnapPoint,
} from './geometry';

type ToolControlProps = {
  tool: ToolState;
  setter: (tool: ToolState) => void;
};

type ToolState =
  | undefined
  | 'cursor'
  | 'brush'
  | 'rectangle'
  | 'circle'
  | 'arrow'
  | 'line'
  | 'eraser'
  | 'text';

type Vector = {
  x: number;
  y: number;
};

type Point = {
  x: number;
  y: number;
};

type Coordinates = {
  start: Point;
  end: Point;
};

type Styles = {
  strokeStyle: string;
  fillStyle: string;
  width: number;
  lineCap: CanvasLineCap;
};

type Stylable = {
  styles: Styles;
  applyStyles: () => void;
  setStyles: (styles: Styles) => void;
};

type Selectable = {
  selected: boolean;
  cursorOffset: Vector;
  setOffset: (point: Point) => void;
  showSelection: () => void;
};

type Position =
  | 'tl'
  | 't'
  | 'tr'
  | 'l'
  | 'bl'
  | 'b'
  | 'br'
  | 'r'
  | 'start'
  | 'end'
  | 'in'
  | null;

type Shape = {
  readonly id: string;
  context: CanvasRenderingContext2D;
  render: () => void;
  move: (point: Point) => void;
  checkIntersection: (point: Point) => Position;
  transform: (start: Point, end: Point) => void;
  normalize: () => void;
  type: 'rect' | 'circ' | 'line' | 'arrw' | undefined;
} & Coordinates &
  Stylable &
  Selectable;

type ShapeGeneratorFunction = (
  point: Point,
  context: CanvasRenderingContext2D,
  styles: Styles
) => Shape;

interface Tool {
  title: ToolState;
  icon: JSX.Element;
  hotkey?: string;
  type: 'shape' | 'util' | 'selection';
}

interface ShapeTool extends Tool {
  type: 'shape';
  generateShape: ShapeGeneratorFunction;
}

interface UtilTool extends Tool {
  type: 'util';
  action: () => void;
}

interface MoveTool extends Tool {
  type: 'selection';
  // selected: Shape | undefined;
  // selectOffset: Vector;
  // selectElementAtPosition: (point: Point) => Shape | undefined;
  // setElements: (elements: Shape[]) => void;
  // setOffset: (point: Point) => void;
  // move: (point: Point) => void;
}

type ShapeGenerator = (
  point: Point,
  context: CanvasRenderingContext2D,
  styles: Styles,
  type: 'rect' | 'circ' | 'line' | 'arrw' | undefined
) => Shape;

const isNear = (
  x: number,
  x1: number,
  y: number,
  y1: number,
  offset: number
) => {
  return Math.abs(x - x1) <= offset && Math.abs(y - y1) <= offset;
};

const generateRect: ShapeGeneratorFunction = (point, context, styles) => {
  const defaultProps = generate2dShape(point, context, styles, 'rect');
  return {
    ...defaultProps,
    render() {
      this.applyStyles();
      // 2 : 4 : 12 // 0.5 0.25 0.08 0
      const rounding = 0;
      const { start, end } = this;
      drawRect({ start, end }, this.context, rounding);
      this.showSelection();
    },
  };
};

const generateCirc: ShapeGeneratorFunction = (point, context, styles) => {
  const defaultProps = generate2dShape(point, context, styles, 'circ');
  return {
    ...defaultProps,
    render() {
      this.applyStyles();
      this.context.beginPath();
      const { start, end } = this;
      const rx = Math.abs(end.x - start.x) / 2;
      const ry = Math.abs(end.y - start.y) / 2;
      const ix = end.x > start.x ? 1 : -1;
      const iy = end.y > start.y ? 1 : -1;
      this.context.ellipse(
        start.x + rx * ix,
        start.y + ry * iy,
        rx,
        ry,
        0,
        0,
        2 * Math.PI
      );
      this.context.fill();
      this.context.stroke();
      this.context.closePath();
      this.showSelection();
    },
  };
};

const generateArrw : ShapeGeneratorFunction = (point, context, styles) => {
      const defaultProps = generate1dShape(point, context, styles, 'arrw');
      return {
        ...defaultProps,
        render() {
          this.applyStyles();
          const { start, end } = this;
          drawLine({ start, end }, this.context);

          // headLen - distance between two points by formula * some ratio
          const headLen = Math.min(
            Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2) * 1,
            50
          );
          drawArrowHead({ start, end }, this.context, headLen, Math.PI / 6);
          this.showSelection();
        },
      };
    }

    const generateLine : ShapeGeneratorFunction = (point, context, styles) => {
      const defaultProps = generate1dShape(point, context, styles, 'line');
      return {
        ...defaultProps,
        render() {
          this.applyStyles();
          const { start, end } = this;
          drawLine({ start, end }, this.context);
          this.showSelection();
        },
      };
    }

const generateDefaultShape: ShapeGenerator = (
  point,
  context,
  styles,
  type = undefined
) => {
  return {
    id: nextId(),
    start: { ...point },
    end: { ...point },
    selected: false,
    context,
    styles,
    type,
    normalize() {
      throw new Error('normalizing coordinates not implemented');
    },
    applyStyles() {
      const context = this.context;
      const { fillStyle, lineCap, strokeStyle, width } = this.styles;
      context.strokeStyle = strokeStyle;
      context.fillStyle = fillStyle;
      context.lineWidth = width;
      context.lineCap = lineCap;
    },
    setStyles(styles) {
      this.styles = styles;
    },
    cursorOffset: { x: 0, y: 0 },
    setOffset({ x, y }) {
      this.cursorOffset = { x: x - this.start.x, y: y - this.start.y };
    },
    render() {
      throw new Error('render not implemented');
    },
    move({ x, y }) {
      const width = this.end.x - this.start.x;
      const height = this.end.y - this.start.y;
      this.start.x = x - this.cursorOffset?.x;
      this.start.y = y - this.cursorOffset?.y;
      this.end.x = this.start.x + width;
      this.end.y = this.start.y + height;
    },
    transform(start, end) {
      const { x: x0, y: y0 } = start;
      const { x, y } = end;
      this.start.x = x0;
      this.start.y = y0;
      this.end.x = x;
      this.end.y = y;
    },
    checkIntersection({ x, y }) {
      throw new Error('intersection not implemented');
    },
    showSelection() {
      throw new Error('showSelection not implemented');
    },
  };
};

const generate2dShape: ShapeGenerator = (point, context, styles, type) => {
  return {
    ...generateDefaultShape(point, context, styles, type),
    normalize() {
      const minX = Math.min(this.start.x, this.end.x);
      const maxX = Math.max(this.start.x, this.end.x);
      const minY = Math.min(this.start.y, this.end.y);
      const maxY = Math.max(this.start.y, this.end.y);
      this.start = { x: minX, y: minY };
      this.end = { x: maxX, y: maxY };
    },
    checkIntersection(point) {
      const OFFSET = 10;
      const { start, end } = this;
      if (isNear(point.x, start.x, point.y, start.y, OFFSET)) return 'tl';
      if (isNear(point.x, end.x, point.y, start.y, OFFSET)) return 'tr';
      if (isNear(point.x, start.x, point.y, end.y, OFFSET)) return 'bl';
      if (isNear(point.x, end.x, point.y, end.y, OFFSET)) return 'br';
      const middleX = (start.x + end.x) / 2;
      if (isNear(point.x, middleX, point.y, start.y, OFFSET)) return 't';
      if (isNear(point.x, middleX, point.y, end.y, OFFSET)) return 'b';
      const middleY = (start.y + end.y) / 2;
      if (isNear(point.x, start.x, point.y, middleY, OFFSET)) return 'l';
      if (isNear(point.x, end.x, point.y, middleY, OFFSET)) return 'r';
      if (
        point.x >= start.x &&
        point.x <= end.x &&
        point.y >= start.y &&
        point.y <= end.y
      )
        return 'in';
      return null;
    },
    showSelection() {
      const selectionRad = 5;
      const { start, end } = this;
      const width = end.x - start.x;
      const height = end.y - start.y;
      if (this.selected) {
        const ctx = this.context;
        const styles = this.styles;
        ctx.fillStyle = '#BF40BF';
        ctx.strokeStyle = '#BF40BF';
        ctx.lineWidth = 5;
        drawCircle(ctx, start.x, start.y, selectionRad);
        drawCircle(ctx, end.x, start.y, selectionRad);
        drawCircle(ctx, end.x, end.y, selectionRad);
        drawCircle(ctx, start.x, end.y, selectionRad);
        drawCircle(ctx, (start.x + end.x) / 2, start.y, selectionRad);
        drawCircle(ctx, (start.x + end.x) / 2, end.y, selectionRad);
        drawCircle(ctx, start.x, (start.y + end.y) / 2, selectionRad);
        drawCircle(ctx, end.x, (start.y + end.y) / 2, selectionRad);
        ctx.setLineDash([1]);
        ctx.lineWidth = styles.width;
        ctx.strokeStyle = styles.strokeStyle;
        ctx.fillStyle = styles.fillStyle;
      }
    },
  };
};

const generate1dShape: ShapeGenerator = (point, context, styles, type) => {
  return {
    ...generateDefaultShape(point, context, styles, type),
    normalize() {
      return {
        start: this.start,
        end: this.end,
      };
    },
    checkIntersection(point) {
      const OFFSET = 4;
      const { start, end } = this;
      //    A      C      B
      //    *------*------*
      const AC = getDistance(start, point);
      const BC = getDistance(end, point);
      const AB = getDistance(start, end);
      if (isNear(point.x, start.x, point.y, start.y, OFFSET)) return 'start';
      if (isNear(point.x, end.x, point.y, end.y, OFFSET)) return 'end';
      if (AC + BC <= AB + styles.width + OFFSET) return 'in';
      return null;
    },
    showSelection() {
      const selectionRad = 5;
      const { start, end } = this;
      if (this.selected) {
        const ctx = this.context;
        const styles = this.styles;
        ctx.fillStyle = '#BF40BF';
        ctx.strokeStyle = '#BF40BF';
        ctx.lineWidth = 5;
        drawCircle(ctx, start.x, start.y, selectionRad);
        drawCircle(ctx, end.x, end.y, selectionRad);
        ctx.setLineDash([1]);
        ctx.lineWidth = styles.width;
        ctx.strokeStyle = styles.strokeStyle;
        ctx.fillStyle = styles.fillStyle;
      }
    },
  };
};

const tools: readonly (ShapeTool | UtilTool | MoveTool)[] = [
  {
    type: 'selection',
    title: 'cursor',
    icon: <BsFillCursorFill size={sizes.md} className='-scale-x-100' />,
    hotkey: 'v',
  },
  // {
  //   type: 'util',
  //   title: 'brush',
  //   icon: <GiPaintBrush size={sizes.md} className='-scale-x-100' />,
  //   hotkey: 'b',
  //   action: {
  //     // start: (context, x, y) => {
  //     //   context.beginPath();
  //     //   context.moveTo(x, y);
  //     // },
  //     // run: (context, x, y) => {
  //     //   context.lineTo(x, y);
  //     //   context.stroke();
  //     // },
  //   },
  // },
  {
    type: 'shape',
    title: 'rectangle',
    icon: <BiRectangle size={sizes.md} title='rectangle' />,
    hotkey: 'r',
    generateShape: generateRect,
  },
  {
    type: 'shape',
    title: 'circle',
    icon: <BiCircle size={sizes.md} title='circle' />,
    hotkey: 'c',
    generateShape: generateCirc
  },
  {
    type: 'shape',
    title: 'arrow',
    icon: (
      <HiArrowNarrowLeft size={sizes.md} title='Arrow' className='-rotate-45' />
    ),
    hotkey: 'a',
    generateShape: generateArrw,
  },
  {
    type: 'shape',
    title: 'line',
    icon: <AiOutlineLine size={sizes.md} title='Line' className='-rotate-45' />,
    hotkey: 'l',
    generateShape: generateLine,
  },
  {
    type: 'util',
    title: 'eraser',
    icon: <BsFillEraserFill size={sizes.md} title='Eraser' />,
    hotkey: 'e',
    action: () => {},
  },
];

const defaultStyles: Styles = {
  strokeStyle: '#fff',
  fillStyle: 'transparent',
  width: 5,
  lineCap: 'round',
};

export type {
  Tool,
  ToolState,
  ToolControlProps,
  Shape,
  Styles,
  Coordinates,
  Point,
  Position,
};
export { tools, defaultStyles, generateRect, generateCirc, generateArrw, generateLine };
