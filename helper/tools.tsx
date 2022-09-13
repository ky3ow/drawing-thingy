import { BsFillCursorFill, BsFillEraserFill } from 'react-icons/bs';
import { GiPaintBrush } from 'react-icons/gi';
import { BiCircle, BiRectangle } from 'react-icons/bi';
import { HiArrowNarrowLeft } from 'react-icons/hi';
import { AiOutlineLine } from 'react-icons/ai';
import { sizes } from '../components/base/ButtonBase';
import nextId from 'react-id-generator';

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

type Coords = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

type Shape = {
  id: string;
  render: (context: CanvasRenderingContext2D, special?: boolean) => void;
  move: (x: number, y: number) => void;
  transform: (x: number, y: number) => void;
  checkIntersection: (x: number, y: number) => boolean;
  cursorOffset: { x: number; y: number };
  setOffset: (x: number, y: number) => void;
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
  generateShape: (x: number, y: number) => Shape;
}

interface UtilTool extends Tool {
  type: 'util';
  action: () => void;
}

interface MoveTool extends Tool {
  type: 'selection';
}

const getSnapCoords = ({ x1, x2, y1, y2 }: Coords) => {
  return Math.abs(x2 - x1) > Math.abs(y2 - y1)
    ? { x: x2, y: y1 }
    : { x: x1, y: y2 };
};

const renderLine = (
  { x1, x2, y1, y2 }: Coords,
  context: CanvasRenderingContext2D,
  specialRender?: boolean
) => {
  const coords = specialRender
    ? getSnapCoords({ x1, x2, y1, y2 })
    : { x: x2, y: y2 };
  context.beginPath();
  context.moveTo(x1, y1);
  const { x, y } = coords;
  context.lineTo(x, y);
  context.stroke();
  context.closePath();
};

const generateDefaultShape = (x: number, y: number): Shape => {
  return {
    id: nextId(),
    x1: x,
    x2: x,
    y1: y,
    y2: y,
    cursorOffset: { x: 0, y: 0 },
    render(context) {
      throw new Error('render not implemented');
    },
    move(x, y) {
      const width = this.x2 - this.x1;
      const height = this.y2 - this.y1;
      this.x1 = x - this.cursorOffset?.x;
      this.y1 = y - this.cursorOffset?.y;
      this.x2 = this.x1 + width;
      this.y2 = this.y1 + height;
    },
    transform(x, y) {
      this.x2 = x;
      this.y2 = y;
    },
    checkIntersection(x, y) {
      throw new Error('intersection not implemented');
    },
    setOffset(x, y) {
      this.cursorOffset = { x: x - this.x1, y: y - this.y1 };
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
    generateShape: (x, y) => {
      const defaultProps = generateDefaultShape(x, y);
      return {
        ...defaultProps,
        render(context) {
          const width = this.x2 - this.x1;
          let height = this.y2 - this.y1;
          if (this.specialRender) {
            height = height > 0 ? Math.abs(width) : -Math.abs(width);
          }
          context.strokeRect(this.x1, this.y1, width, height);
        },
        checkIntersection(x, y) {
          const minX = Math.min(this.x1, this.x2);
          const maxX = Math.max(this.x1, this.x2);
          const minY = Math.min(this.y1, this.y2);
          const maxY = Math.max(this.y1, this.y2);
          return x >= minX && x <= maxX && y >= minY && y <= maxY;
        },
      };
    },
  },
  {
    type: 'shape',
    title: 'circle',
    icon: <BiCircle size={sizes.md} title='circle' />,
    hotkey: 'c',
    generateShape: (x, y) => {
      const defaultProps = generateDefaultShape(x, y);
      return {
        ...defaultProps,
        render(context) {
          context.beginPath();
          const rx = Math.abs(this.x1 - this.x2) / 2;
          const ry = !this.specialRender ? Math.abs(this.y1 - this.y2) / 2 : rx;
          const x = this.x1 > this.x2 ? this.x1 - rx : this.x1 + rx;
          const y = this.y1 > this.y2 ? this.y1 - ry : this.y1 + ry;
          context.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI);
          context.stroke();
          context.closePath();
        },
        checkIntersection(x, y) {
          const minX = Math.min(this.x1, this.x2);
          const maxX = Math.max(this.x1, this.x2);
          const minY = Math.min(this.y1, this.y2);
          const maxY = Math.max(this.y1, this.y2);
          return x >= minX && x <= maxX && y >= minY && y <= maxY;
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
    generateShape: (x, y) => {
      const defaultProps = generateDefaultShape(x, y);
      return {
        ...defaultProps,
        render(context) {
          const coords = this.specialRender
            ? getSnapCoords({
                x1: this.x1,
                x2: this.x2,
                y1: this.y1,
                y2: this.y2,
              })
            : { x: this.x2, y: this.y2 };
          context.beginPath();
          context.moveTo(this.x1, this.y1);
          const { x, y } = coords;
          context.lineTo(x, y);
          context.stroke();

          // headLen - distance between two points by formula * so  me ratio
          const headLen = Math.min(
            Math.sqrt((x - this.x1) ** 2 + (y - this.y1) ** 2) * 1,
            50
          );
          const angle = Math.atan2(y - this.y1, x - this.x1);

          context.beginPath();
          /*
           * (half of arrow head explained)
           *  xa - x arrowhead, ya - y             ____________
           *  c - arrowhead length                / |\  alpha
           *                                    / l|r\
           *                                  /   |  \
           *            b                   /    |    \
           *   ________________(x,y)       /    |      \
           *      |       t  /            /    |        \
           *      |        /                  |
           *      |      /                   |
           *    a |    /  c           alpha |
           *      |  /               ______|
           *      |/                    alpha - line angle
           *    (xa, ya)                lArrowhead = alpha + l
           *                            rArrowHead = alpha - r
           *
           *    xa = b       cos t = b / c ====> b = c * cos t
           *    ya = a       sin t = a / c ====> a = c * sin t
           */
          context.moveTo(
            x - headLen * Math.cos(angle - Math.PI / 6),
            y - headLen * Math.sin(angle - Math.PI / 6)
          );
          context.lineTo(x, y);
          context.lineTo(
            x - headLen * Math.cos(angle + Math.PI / 6),
            y - headLen * Math.sin(angle + Math.PI / 6)
          );
          context.stroke();
          context.closePath();
        },
      };
    },
  },
  {
    type: 'shape',
    title: 'line',
    icon: <AiOutlineLine size={sizes.md} title='Line' className='-rotate-45' />,
    hotkey: 'l',
    generateShape: (x, y) => {
      const defaultProps = generateDefaultShape(x, y);
      return {
        ...defaultProps,
        render(context) {
          renderLine(
            { x1: this.x1, x2: this.x2, y1: this.y1, y2: this.y2 },
            context,
            this.specialRender
          );
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

export type { Tool, ToolState, ToolControlProps, Shape };
export { tools };
