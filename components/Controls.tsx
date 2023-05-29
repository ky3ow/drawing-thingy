import { ChangeEventHandler, MouseEventHandler } from 'react';
import { Shape, ToolControlProps, generateArrw, generateCirc, generateLine, generateRect } from '../helper/tools';
import Toolbar from './Toolbar';
import ButtonBase from './base/ButtonBase';

const Controls = ({
  tool,
  setter,
  elements,
  setElements,
  ctx
}: ToolControlProps & {
  elements: Shape[];
  ctx: CanvasRenderingContext2D | null | undefined;
  setElements: (el: Shape[]) => void;
}) => {
  const saveToJSON: MouseEventHandler<HTMLButtonElement> = (e) => {
    const file = new Blob([JSON.stringify(elements)], {type: 'json'})
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = "canvas.json";
    link.click();
  }
  const loadFromJSON: ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if(!files) {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
      const jsonString = (e.target?.result);
      if(typeof jsonString === 'string' && ctx) {
        const elArr = (JSON.parse(jsonString) as Shape[]).map(el => {
          let newEl: Shape | null = null
          switch(el.type) {
            case 'rect': {
              newEl = generateRect(el.start, ctx, el.styles);
              break;
            }
            case 'circ': {
              newEl = generateCirc(el.start, ctx, el.styles);
              break;
            }
            case 'line': {
              newEl = generateLine(el.start, ctx, el.styles);
              break;
            }
            case 'arrw': {
              newEl = generateArrw(el.start, ctx, el.styles);
              break;
            }
          }
          if(newEl) newEl.transform(newEl.start, el.end);
          return newEl;
        });
        setElements(elArr.filter((el): el is Shape => el !== null));
      }
    })
    reader.readAsText(files[0]);
  };
  return (
    <>
      <div className='grow'>
        <Toolbar direction='col' tool={tool} setter={setter} />
      </div>
      <input className='hidden' accept=".json" onChange={loadFromJSON} type="file" name="load" id="load" />
      <label className='cursor-pointer hover:text-rose-600' htmlFor="load">Завантажити</label>
      <ButtonBase onClick={saveToJSON}>Зберегти</ButtonBase>
    </>
  );
};

export default Controls;
