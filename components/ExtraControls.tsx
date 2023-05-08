import { Shape, Styles } from '../helper/tools';
import ButtonBase from './base/ButtonBase';

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
        Очистити
      </ButtonBase>
      <ButtonBase
        onClick={() => {
          const newStyles = {
            ...styles,
            strokeStyle: '#fff',
          };
          update(newStyles);
        }}
      >
        <div className='bg-white p-4'></div>
      </ButtonBase>

      <ButtonBase
        onClick={() => {
          const newStyles = {
            ...styles,
            strokeStyle: 'rgb(59 130 246)',
          };
          update(newStyles);
        }}
      >
        <div className='bg-blue-500 p-4'></div>
      </ButtonBase>
      <ButtonBase
        onClick={() => {
          const newStyles = {
            ...styles,
            strokeStyle: 'rgb(245 158 11)',
          };
          update(newStyles);
        }}
      >
        <div className='bg-amber-500 p-4'></div>
      </ButtonBase>
      <ButtonBase
        onClick={() => {
          const newStyles = {
            ...styles,
            strokeStyle: 'rgb(34 197 94)',
          };
          update(newStyles);
        }}
      >
        <div className='bg-green-500 p-4'></div>
      </ButtonBase>
      <ButtonBase
        onClick={() => {
          const newStyles = {
            ...styles,
            strokeStyle: 'rgb(217 70 239)',
          };
          update(newStyles);
        }}
      >
        <div className='bg-fuchsia-500 p-4'></div>
      </ButtonBase>
      <ButtonBase
        onClick={() => {
          const newStyles = {
            ...styles,
            strokeStyle: 'rgb(244 63 94)',
          };
          update(newStyles);
        }}
      >
        <div className='bg-rose-500 p-4'></div>
      </ButtonBase>
    </>
  );
};

export default ExtraControls;
