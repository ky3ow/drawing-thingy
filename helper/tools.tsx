import { ReactNode } from 'react';
import { BsFillCursorFill, BsFillEraserFill } from 'react-icons/bs';
import { GiPaintBrush } from 'react-icons/gi';
import { BiCircle, BiRectangle } from 'react-icons/bi';
import { HiArrowNarrowLeft } from 'react-icons/hi';
import { AiOutlineLine } from 'react-icons/ai';
import { sizes } from '../components/base/ButtonBase';

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

type tool = {
  title: ToolState;
  icon: ReactNode;
  hotkey?: string;
  action: {
    start: (canvas: CanvasRenderingContext2D, x: number, y: number) => void;
    draw: (canvas: CanvasRenderingContext2D, x: number, y: number) => void;
    end: (canvas: CanvasRenderingContext2D) => void;
  };
};

type ToolControlProps = {
  tool: ToolState;
  setter: (tool: ToolState) => void;
};

const tools: readonly tool[] = [
  {
    title: 'cursor',
    icon: <BsFillCursorFill size={sizes.md} className='-scale-x-100' />,
    hotkey: 'v',
    action: {
      start: () => {},
      draw: () => {},
      end: () => {},
    },
  },
  {
    title: 'brush',
    icon: <GiPaintBrush size={sizes.md} className='-scale-x-100' />,
    hotkey: 'b',
    action: {
      start: (canvas, x, y) => {
        canvas.beginPath();
        canvas.moveTo(x, y);
      },
      draw: (canvas, x, y) => {
        canvas.lineTo(x, y);
        canvas.stroke();
      },
      end: (canvas) => {
        canvas.closePath();
      },
    },
  },
  {
    title: 'rectangle',
    icon: <BiRectangle size={sizes.md} title='rectangle' />,
    hotkey: 'r',
    action: {
      start: () => {},
      draw: () => {},
      end: () => {},
    },
  },
  {
    title: 'circle',
    icon: <BiCircle size={sizes.md} title='circle' />,
    hotkey: 'c',
    action: {
      start: () => {},
      draw: () => {},
      end: () => {},
    },
  },
  {
    title: 'arrow',
    icon: (
      <HiArrowNarrowLeft size={sizes.md} title='Arrow' className='-rotate-45' />
    ),
    hotkey: 'a',
    action: {
      start: () => {},
      draw: () => {},
      end: () => {},
    },
  },
  {
    title: 'line',
    icon: <AiOutlineLine size={sizes.md} title='Line' className='-rotate-45' />,
    hotkey: 'l',
    action: {
      start: () => {},
      draw: () => {},
      end: () => {},
    },
  },
  {
    title: 'eraser',
    icon: <BsFillEraserFill size={sizes.md} title='Eraser' />,
    hotkey: 'e',
    action: {
      start: () => {},
      draw: () => {},
      end: () => {},
    },
  },
  {
    title: 'text',
    icon: <div className='text-[1.75rem] leading-7'>A</div>,
    hotkey: 't',
    action: {
      start: () => {},
      draw: () => {},
      end: () => {},
    },
  },
];

export type { tool, ToolState, ToolControlProps };
export { tools };
