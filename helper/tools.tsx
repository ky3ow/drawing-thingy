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
  },
  {
    title: 'brush',
    icon: <GiPaintBrush size={sizes.md} className='-scale-x-100' />,
    hotkey: 'b',
  },
  {
    title: 'rectangle',
    icon: <BiRectangle size={sizes.md} title='rectangle' />,
    hotkey: 'r',
  },
  {
    title: 'circle',
    icon: <BiCircle size={sizes.md} title='circle' />,
    hotkey: 'c',
  },
  {
    title: 'arrow',
    icon: (
      <HiArrowNarrowLeft size={sizes.md} title='Arrow' className='-rotate-45' />
    ),
    hotkey: 'a',
  },
  {
    title: 'line',
    icon: <AiOutlineLine size={sizes.md} title='Line' className='-rotate-45' />,
    hotkey: 'l',
  },
  {
    title: 'eraser',
    icon: <BsFillEraserFill size={sizes.md} title='Eraser' />,
    hotkey: 'e',
  },
  {
    title: 'text',
    icon: <div className='text-[1.75rem] leading-7'>A</div>,
    hotkey: 't',
  },
];

export type { tool, ToolState, ToolControlProps };
export { tools };
