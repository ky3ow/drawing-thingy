import React, { useEffect } from 'react';
import { tools, ToolControlProps } from '../helper/tools';
import ToolButton from './base/ToolButton';

type Adaptive = {
  direction?: 'row' | 'col';
};

const Toolbar = ({
  tool,
  setter,
  direction = 'row',
}: Adaptive & ToolControlProps) => {
  useEffect(() => {
    const changeTool = (e: KeyboardEvent) => {
      const newTool = tools.find((tool) => tool.hotkey === e.key);
      if (newTool === undefined) return;
      setter(newTool.title);
    };

    window.addEventListener('keypress', changeTool);

    return () => {
      window.removeEventListener('keypress', changeTool);
    };
  });

  return (
    <ul
      className={`grid ${
        direction === 'row' ? 'grid-flow-col' : 'grid-flow-row'
      } gap-2 lg:grid-cols-2`}
    >
      {tools.map(({ title, icon, hotkey }) => {
        return (
          <li key={title} className='flex justify-center'>
            <ToolButton
              className='w-full'
              active={tool === title}
              onClick={() => setter(title)}
              hotkey={hotkey}
              title={title}
            >
              {icon}
            </ToolButton>
          </li>
        );
      })}
    </ul>
  );
};

export default Toolbar;
