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
        Delete
      </ButtonBase>
      <ButtonBase
        onClick={() => {
          const newStyles = {
            ...styles,
            strokeStyle: 'red',
          };
          update(newStyles);
        }}
      >
        Styles1
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
        Styles2
      </ButtonBase>
    </>
  );
};

export default ExtraControls;
