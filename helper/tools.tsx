import { BsFillCursorFill, BsFillEraserFill } from 'react-icons/bs';
import { GiPaintBrush } from 'react-icons/gi';
import { BiCircle, BiRectangle } from 'react-icons/bi';
import { HiArrowNarrowLeft } from 'react-icons/hi';
import { AiOutlineLine } from 'react-icons/ai';
import { sizes } from '../components/base/ButtonBase';
import nextId from 'react-id-generator';
import { drawArrowHead, drawLine, drawRect } from './geometry';

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
type Coords = {
  x0: number;
  x: number;
  y0: number;
  y: number;
};

type Styles = {
  strokeStyle: string;
  fillStyle: string;
  width: number;
  lineCap: CanvasLineCap;
};

type Shape = {
  readonly id: string;
  context: CanvasRenderingContext2D;
  render: (special?: boolean) => void;
  move: (point: Point) => void;
  checkIntersection: (point: Point) => boolean;
  transform: (point: Point) => void;
  getNormalCoords: () => Coords;
  normalize: () => void;
  cursorOffset: Vector;
  setOffset: (point: Point) => void;
  styles: Styles;
  setStyles: (styles: Styles) => void;
  applyStyles: () => void;
  selected: boolean;
  drawBoundingRect: () => void;
  specialRender?: boolean;
} & Coords;

interface Tool {
  title: ToolState;
  icon: JSX.Element;
  hotkey?: string;
  type: 'shape' | 'util' | 'selection';
}

interface ShapeTool extends Tool {
  type: 'shape';
  generateShape: (
    point: Point,
    context: CanvasRenderingContext2D,
    styles: Styles
  ) => Shape;
}

interface UtilTool extends Tool {
  type: 'util';
  action: () => void;
}

interface MoveTool extends Tool {
  type: 'selection';
  selected: Shape | undefined;
  selectOffset: Vector;
  selectElementAtPosition: (point: Point) => Shape | undefined;
  setElements: (elements: Shape[]) => void;
  setOffset: (point: Point) => void;
  move: (point: Point) => void;
}

const getSnapCoords = ({ x0, x, y0, y }: Coords) => {
  return Math.abs(x - x0) > Math.abs(y - y0)
    ? { x: x, y: y0 }
    : { x: x0, y: y };
};

const generateDefaultShape = (
  { x, y }: Point,
  context: CanvasRenderingContext2D,
  styles: Styles
): Shape => {
  return {
    id: nextId(),
    x0: x,
    x,
    y0: y,
    y,
    selected: false,
    context,
    styles,
    getNormalCoords() {
      const x0 = Math.min(this.x0, this.x);
      const x = Math.max(this.x0, this.x);
      const y0 = Math.min(this.y0, this.y);
      const y = Math.max(this.y0, this.y);
      return { x0, x, y0, y };
    },
    normalize() {
      // DO NOT CALL INSIDE OTHER METHODS
      const { x0, x, y0, y } = this.getNormalCoords();
      this.x0 = x0;
      this.x = x;
      this.y0 = y0;
      this.y = y;
    },
    applyStyles() {
      const context = this.context;
      const { fillStyle, lineCap, strokeStyle, width } = this.styles;
      context.strokeStyle = strokeStyle;
      context.fillStyle = strokeStyle;
      context.lineWidth = width;
      context.lineCap = lineCap;
    },
    setStyles(styles) {
      this.styles = styles;
    },
    cursorOffset: { x: 0, y: 0 },
    setOffset({ x, y }) {
      this.cursorOffset = { x: x - this.x0, y: y - this.y0 };
    },
    render() {
      throw new Error('render not implemented');
    },
    move({ x, y }) {
      throw new Error('moving not implemented');
    },
    transform({ x, y }) {
      this.x = x;
      this.y = y;
    },
    checkIntersection({ x, y }) {
      throw new Error('intersection not implemented');
    },
    drawBoundingRect() {
      const width = this.x - this.x0;
      const height = this.y - this.y0;
      if (this.selected) {
        const ctx = this.context;
        const styles = this.styles;
        ctx.setLineDash([18]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = defaultStyles.strokeStyle;
        ctx.strokeRect(this.x0 - 10, this.y0 - 10, width + 20, height + 20);
        ctx.setLineDash([1]);
        ctx.lineWidth = styles.width;
        ctx.strokeStyle = styles.strokeStyle;
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
  {
    type: 'util',
    title: 'brush',
    icon: <GiPaintBrush size={sizes.md} className='-scale-x-100' />,
    hotkey: 'b',
    action: {
      // start: (context, x, y) => {
      //   context.beginPath();
      //   context.moveTo(x, y);
      // },
      // run: (context, x, y) => {
      //   context.lineTo(x, y);
      //   context.stroke();
      // },
    },
  },
  {
    type: 'shape',
    title: 'rectangle',
    icon: <BiRectangle size={sizes.md} title='rectangle' />,
    hotkey: 'r',
    generateShape: ({ x, y }, context, styles) => {
      const defaultProps = generateDefaultShape({ x, y }, context, styles);
      return {
        ...defaultProps,
        render() {
          this.applyStyles();
          this.drawBoundingRect();
          if (this.specialRender) {
            const height = this.y - this.y0;
            this.y =
              height > 0
                ? this.y0 + Math.abs(this.x - this.x0)
                : this.y0 - Math.abs(this.x - this.x0);
          }
          const { x0, x, y0, y } = this.getNormalCoords();
          // 2 : 4 : 12 // 0.5 0.25 0.08 0
          const r = Math.min(x - x0, y - y0) * 0;
          drawRect({ x0, x, y0, y }, this.context, r);
        },
        move({ x, y }) {
          const width = this.x - this.x0;
          const height = this.y - this.y0;
          this.x0 = x - this.cursorOffset?.x;
          this.y0 = y - this.cursorOffset?.y;
          this.x = this.x0 + width;
          this.y = this.y0 + height;
        },
        checkIntersection({ x: _x, y: _y }) {
          const { x0, x, y0, y } = this.getNormalCoords();
          return _x >= x0 && _x <= x && _y >= y0 && _y <= y;
        },
      };
    },
  },
  {
    type: 'shape',
    title: 'circle',
    icon: <BiCircle size={sizes.md} title='circle' />,
    hotkey: 'c',
    generateShape: ({ x, y }, context, styles) => {
      const defaultProps = generateDefaultShape({ x, y }, context, styles);
      return {
        ...defaultProps,
        render() {
          this.applyStyles();
          this.drawBoundingRect();
          this.context.beginPath();
          const rx = Math.abs(this.x0 - this.x) / 2;
          const ry = !this.specialRender ? Math.abs(this.y0 - this.y) / 2 : rx;
          const x = this.x0 > this.x ? this.x0 - rx : this.x0 + rx;
          const y = this.y0 > this.y ? this.y0 - ry : this.y0 + ry;
          this.context.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI);
          this.context.stroke();
          this.context.closePath();
        },
        move({ x, y }) {
          const width = this.x - this.x0;
          const height = this.y - this.y0;
          this.x0 = x - this.cursorOffset?.x;
          this.y0 = y - this.cursorOffset?.y;
          this.x = this.x0 + width;
          this.y = this.y0 + height;
        },
        checkIntersection({ x: _x, y: _y }) {
          const { x0, x, y0, y } = this.getNormalCoords();
          return _x >= x0 && _x <= x && _y >= y0 && _y <= y;
        },
      };
    },
  },
  {
    type: 'shape',
    title: 'arrow',
    icon: (
      <HiArrowNarrowLeft size={sizes.md} title='Arrow' className='-rotate-45' />
    ),
    hotkey: 'a',
    generateShape: ({ x, y }, context, styles) => {
      const defaultProps = generateDefaultShape({ x, y }, context, styles);
      return {
        ...defaultProps,
        render() {
          this.applyStyles();
          const { x, y } = this.specialRender
            ? getSnapCoords({ x0: this.x0, x: this.x, y0: this.y0, y: this.y })
            : { x: this.x, y: this.y };
          const [x0, y0] = [this.x0, this.y0];
          drawLine({ x0, x, y0, y }, this.context);

          // headLen - distance between two points by formula * some ratio
          const headLen = Math.min(
            Math.sqrt((x - x0) ** 2 + (y - y0) ** 2) * 1,
            50
          );
          drawArrowHead({ x0, x, y0, y }, this.context, headLen, Math.PI / 6);
        },
        normalize() {
          return;
        },
      };
    },
  },
  {
    type: 'shape',
    title: 'line',
    icon: <AiOutlineLine size={sizes.md} title='Line' className='-rotate-45' />,
    hotkey: 'l',
    generateShape: ({ x, y }, context, styles) => {
      const defaultProps = generateDefaultShape({ x, y }, context, styles);
      return {
        ...defaultProps,
        render() {
          this.applyStyles();
          const { x, y } = this.specialRender
            ? getSnapCoords({ x0: this.x0, x: this.x, y0: this.y0, y: this.y })
            : { x: this.x, y: this.y };
          const [x0, y0] = [this.x0, this.y0];
          drawLine({ x0, x, y0, y }, this.context);
        },
        normalize() {
          return;
        },
      };
    },
  },
  {
    type: 'util',
    title: 'eraser',
    icon: <BsFillEraserFill size={sizes.md} title='Eraser' />,
    hotkey: 'e',
    action: () => {},
  },
  {
    type: 'util',
    title: 'text',
    icon: <div className='text-[1.75rem] leading-7'>A</div>,
    hotkey: 't',
    action: () => {},
  },
];

const defaultStyles: Styles = {
  strokeStyle: '#fff',
  fillStyle: 'transparent',
  width: 5,
  lineCap: 'round',
};

export type { Tool, ToolState, ToolControlProps, Shape, Styles, Coords };
export { tools, defaultStyles };
