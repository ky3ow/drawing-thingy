import { Shape, Styles } from '../helper/tools';
import ButtonBase from './base/ButtonBase';

const createOnClick = (
  prop: string,
  newStyle: string,
  styles: Styles,
  setStyles: (styles: Styles) => void,
  update: (styles: Styles) => void
) => {
  return () => {
    const newStyles = {
      ...styles,
      [prop]: newStyle,
    };
    setStyles(newStyles);
    update(newStyles);
  };
};

const ExtraControls = ({
  clear,
  styles,
  setStyles,
  update,
}: {
  clear: () => void;
  styles: Styles;
  setStyles: (styles: Styles) => void;
  update: (styles: Styles) => void;
}) => {
  return (
    <>
      <ButtonBase
        onClick={() => {
          clear();
        }}
      >
        <b>Очистити</b>
      </ButtonBase>
      <p className='text-center'>Контур</p>
      <ButtonBase
        onClick={createOnClick(
          'strokeStyle',
          '#fff',
          styles,
          setStyles,
          update
        )}
      >
        <div className='outline outline-white bg-white p-4'></div>
      </ButtonBase>

      <ButtonBase
        onClick={createOnClick(
          'strokeStyle',
          'rgb(59 130 246)',
          styles,
          setStyles,
          update
        )}
      >
        <div className='outline outline-blue-500 bg-blue-500 p-4'></div>
      </ButtonBase>
      <ButtonBase
        onClick={createOnClick(
          'strokeStyle',
          'rgb(245 158 11)',
          styles,
          setStyles,
          update
        )}
      >
        <div className='outline outline-amber-500 bg-amber-500 p-4'></div>
      </ButtonBase>
      <ButtonBase
        onClick={createOnClick(
          'strokeStyle',
          'rgb(34 197 94)',
          styles,
          setStyles,
          update
        )}
      >
        <div className='outline outline-green-500 bg-green-500 p-4'></div>
      </ButtonBase>
      <ButtonBase
        onClick={createOnClick(
          'strokeStyle',
          'rgb(217 70 239)',
          styles,
          setStyles,
          update
        )}
      >
        <div className='outline outline-fuchsia-500 bg-fuchsia-500 p-4'></div>
      </ButtonBase>
      <ButtonBase
        onClick={createOnClick(
          'strokeStyle',
          'rgb(244 63 94)',
          styles,
          setStyles,
          update
        )}
      >
        <div className='outline outline-rose-500 bg-rose-500 p-4'></div>
      </ButtonBase>
      <p className='text-center'>Фон</p>
      <ButtonBase
        onClick={createOnClick(
          'fillStyle',
          'transparent',
          styles,
          setStyles,
          update
        )}
      >
        <div className='outline outline-white p-4'></div>
      </ButtonBase>

      <ButtonBase
        onClick={createOnClick(
          'fillStyle',
          '#1d4ed8',
          styles,
          setStyles,
          update
        )}
      >
        <div className='outline outline-blue-700 bg-blue-700 p-4'></div>
      </ButtonBase>
      <ButtonBase
        onClick={createOnClick(
          'fillStyle',
          '#b45309',
          styles,
          setStyles,
          update
        )}
      >
        <div className='outline outline-amber-700 bg-amber-700 p-4'></div>
      </ButtonBase>
      <ButtonBase
        onClick={createOnClick(
          'fillStyle',
          '#15803d',
          styles,
          setStyles,
          update
        )}
      >
        <div className='outline outline-green-700 bg-green-700 p-4'></div>
      </ButtonBase>
      <ButtonBase
        onClick={createOnClick(
          'fillStyle',
          '#a21caf',
          styles,
          setStyles,
          update
        )}
      >
        <div className='outline outline-fuchsia-700 bg-fuchsia-700 p-4'></div>
      </ButtonBase>
      <ButtonBase
        onClick={createOnClick(
          'fillStyle',
          '#be123c',
          styles,
          setStyles,
          update
        )}
      >
        <div className='outline outline-rose-700 bg-rose-700 p-4'></div>
      </ButtonBase>
    </>
  );
};

export default ExtraControls;
