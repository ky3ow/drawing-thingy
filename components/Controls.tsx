import { ToolControlProps } from '../helper/tools';
import Toolbar from './Toolbar';
import ButtonBase from './base/ButtonBase';

const Controls = ({ tool, setter }: ToolControlProps) => {
  return (
    <>
      <div className='grow'>
        <Toolbar direction='col' tool={tool} setter={setter} />
      </div>
      <ButtonBase>
        Exit
      </ButtonBase>
    </>
  );
};

export default Controls;
