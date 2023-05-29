import { MouseEventHandler } from 'react';
import { Shape, ToolControlProps } from '../helper/tools';
import Toolbar from './Toolbar';
import ButtonBase from './base/ButtonBase';

const Controls = ({
  tool,
  setter,
  elements,
  setElements,
}: ToolControlProps & {
  elements: Shape[];
  setElements: (el: Shape[]) => void;
}) => {
  const saveToJSON: MouseEventHandler<HTMLButtonElement> = (e) => {
    const file = new Blob([JSON.stringify(elements)], {type: 'json'})
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = "canvas.json";
    link.click();
  }
  return (
    <>
      <div className='grow'>
        <Toolbar direction='col' tool={tool} setter={setter} />
      </div>
      {/* <ButtonBase onClick={}>Зберегти</ButtonBase> */}
      <ButtonBase onClick={saveToJSON}>Завантажити</ButtonBase>
    </>
  );
};

export default Controls;
