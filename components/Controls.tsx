import { ToolControlProps } from '../helper/tools';
import Help from './Help';
import ThemeSwitcher from './ThemeSwitcher';
import Toolbar from './Toolbar';

const Controls = ({ tool, setter }: ToolControlProps) => {
  return (
    <>
      <div className='grow'>
        <Toolbar direction='col' tool={tool} setter={setter} />
      </div>
      <div className='grid lg:grid-cols-2'>
        <ThemeSwitcher />
        <Help />
      </div>
    </>
  );
};

export default Controls;
