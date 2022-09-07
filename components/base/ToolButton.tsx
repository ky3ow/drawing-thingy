import React, { useEffect } from 'react';
import ButtonBase, { BaseProps, buttonHandler } from './ButtonBase';

type Selectable = {
  active?: boolean;
};

type Props = BaseProps & Selectable;

const ToolButton = ({
  onClick,
  hotkey,
  children,
  active,
  className,
  title,
}: Props) => {
  return (
    <ButtonBase
      className={`${
        active
          ? 'bg-rose-600 text-white hover:text-white active:bg-rose-700'
          : 'bg-inherit'
      } ${className}`}
      onClick={onClick}
      hotkey={hotkey}
      title={title}
    >
      {children}
    </ButtonBase>
  );
};

export type ToolProps = buttonHandler & Selectable;
export default ToolButton;
