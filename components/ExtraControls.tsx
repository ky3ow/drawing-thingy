import React, { RefObject } from 'react';
import { Shape } from '../helper/tools';
import ButtonBase from './base/ButtonBase';

const ExtraControls = ({ clear }: { clear: () => void }) => {
  return (
    <>
      <ButtonBase
        onClick={() => {
          clear();
        }}
      >
        Delete
      </ButtonBase>
    </>
  );
};

export default ExtraControls;
