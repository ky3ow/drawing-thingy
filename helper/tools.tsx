import { BsCartX, BsFillCursorFill, BsFillEraserFill } from 'react-icons/bs';
import { GiPaintBrush } from 'react-icons/gi';
import { BiCircle, BiRectangle } from 'react-icons/bi';
import { HiArrowNarrowLeft } from 'react-icons/hi';
import { AiOutlineLine } from 'react-icons/ai';
import { sizes } from '../components/base/ButtonBase';
import { isContext } from 'vm';

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
  render: (context: CanvasRenderingContext2D, special?: boolean) => void;
  specialRender?: boolean;
} & Coords;

type Renderer = (coords: Coords) => Shape;

type tool = {
  title: ToolState;
  icon: JSX.Element;
  hotkey?: string;
  action: Renderer | (() => void);
};

const isShape = (e: Shape | void): e is Shape => {
  return (e as Shape)?.render !== undefined;
};

const tools: readonly tool[] = [
  {
    title: 'cursor',
    icon: <BsFillCursorFill size={sizes.md} className='-scale-x-100' />,
    hotkey: 'v',
    action: {},
  },
  {
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
    title: 'rectangle',
    icon: <BiRectangle size={sizes.md} title='rectangle' />,
    hotkey: 'r',
    action: ({ x1, x2, y1, y2 }) => {
      return {
        x1,
        x2,
        y1,
        y2,
        render(context) {
          let width = x2 - x1;
          let height = y2 - y1;
          if (this.specialRender) {
            height = height > 0 ? Math.abs(width) : -Math.abs(width);
          }
          context.strokeRect(x1, y1, width, height);
        },
      };
    },
  },
  {
    title: 'circle',
    icon: <BiCircle size={sizes.md} title='circle' />,
    hotkey: 'c',
    action: ({ x1, x2, y1, y2 }) => {
      return {
        x1,
        x2,
        y1,
        y2,
        render(context) {
          context.beginPath();
          const x = (x1 + x2) / 2;
          const y = (y1 + y2) / 2;
          const rx = Math.abs(x1 - x2) / 2;
          const ry = this.specialRender ? rx : Math.abs(y1 - y2) / 2;
          context.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI);
          context.stroke();
          context.closePath();
        },
      };
    },
  },
  {
    title: 'arrow',
    icon: (
      <HiArrowNarrowLeft size={sizes.md} title='Arrow' className='-rotate-45' />
    ),
    hotkey: 'a',
    action: ({ x1, x2, y1, y2 }) => {
      return {
        x1,
        x2,
        y1,
        y2,
        render(context) {
          const coords = !this.specialRender
            ? { x: x2, y: y2 }
            : Math.abs(x2 - x1) > Math.abs(y2 - y1)
            ? { x: x2, y: y1 }
            : { x: x1, y: y2 };
          context.beginPath();
          context.moveTo(x1, y1);
          const { x, y } = coords;
          context.lineTo(x, y);
          context.stroke();

          const headLen = Math.min(
            Math.sqrt((x - x1) ** 2 + (y - y1) ** 2) * 0.3,
            60
          );
          const angle = Math.atan2(y - y1, x - x1);

          context.beginPath();
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
    title: 'line',
    icon: <AiOutlineLine size={sizes.md} title='Line' className='-rotate-45' />,
    hotkey: 'l',
    action: ({ x1, x2, y1, y2 }) => {
      return {
        x1,
        x2,
        y1,
        y2,
        render(context) {
          const coords = !this.specialRender
            ? { x: x2, y: y2 }
            : Math.abs(x2 - x1) > Math.abs(y2 - y1)
            ? { x: x2, y: y1 }
            : { x: x1, y: y2 };
          context.beginPath();
          context.moveTo(x1, y1);
          const { x, y } = coords;
          context.lineTo(x, y);
          context.stroke();
          context.closePath();
        },
      };
    },
  },
  {
    title: 'eraser',
    icon: <BsFillEraserFill size={sizes.md} title='Eraser' />,
    hotkey: 'e',
    action: {},
  },
  {
    title: 'text',
    icon: <div className='text-[1.75rem] leading-7'>A</div>,
    hotkey: 't',
    action: {},
  },
];

export type { tool, ToolState, ToolControlProps, Shape };
export { tools, isShape };
