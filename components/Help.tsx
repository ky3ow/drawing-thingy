import React from 'react';
import ButtonBase from './base/ButtonBase';

const Help = () => {
  return (
    <ButtonBase rounded onClick={() => console.log('help')}>
      <div className='text-2xl leading-6'>?</div>
    </ButtonBase>
  );
};

export default Help;
