import React, { ReactNode } from 'react';

type buttonHandler = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const sizes = {
  sm: '1.5rem',
  md: '1.75rem',
};

type BaseProps = {
  children: ReactNode;
  hotkey?: string;
  className?: string;
  title?: string;
  rounded?: boolean;
} & buttonHandler;

const ButtonBase = ({
  onClick,
  hotkey,
  children,
  className,
  rounded,
  title,
}: BaseProps) => {
  return (
    <div
      className={`${className} relative ${
        rounded ? 'rounded-full' : 'rounded-lg'
      } hover:text-rose-600 active:bg-zinc-500/25`}
    >
      <button className='w-full p-3' onClick={onClick} title={title}>
        {children}
      </button>
      {hotkey && (
        <span className='pointer-events-none absolute bottom-0 right-1 text-xs font-bold uppercase'>
          {hotkey}
        </span>
      )}
    </div>
  );
};

export default ButtonBase;
export { sizes };
export type { BaseProps, buttonHandler };
