import { Coordinates, Point } from './tools';

type DrawFunc<TParams extends any[] = []> = (
  coordinates: Coordinates,
  context: CanvasRenderingContext2D,
  ...aditional: TParams
) => void;

// draws rectangle, can define radius for rounded angles
const drawRect: DrawFunc<[rounded?: number]> = (
  { start, end },
  context,
  rounded = 0
) => {
  if (rounded > 0.5) rounded = 0.5;
  const radius = Math.min(end.x - start.x, end.y - start.y) * rounded;
  context.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y)
  const a = Math.min(end.x - start.x, end.y - start.y) * rounded;
};

const getSnapPoint = ({ start, end }: Coordinates): Point => {
  return Math.abs(end.x - start.x) > Math.abs(end.y - start.y)
    ? { x: end.x, y: start.y }
    : { x: start.x, y: end.y };
};

const getDistance = (start: Point, end: Point) => {
  return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
};

// draws simple line
const drawLine: DrawFunc = ({ start, end }, context) => {
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.stroke();
  context.closePath();
};

// arrowAngle - radians
const drawArrowHead: DrawFunc<[headlen: number, angle: number]> = (
  { start, end },
  context,
  headLen,
  arrowAngle
) => {
  const axisAngle = Math.atan2(end.y - start.y, end.x - start.x);
  context.beginPath();
  /*
                                -90                               
                                  ^
                                  |                    /  T
                                                      /
                                                      
                      <II>                          /                 <I>
                                     
                                      L'          /H           R'            S
                                  |--- -- -- -- -/()\-- -- -- -- -- -- -- -- 
                                                / |   \
                                               /  |    \
                                              /   |      \
                                             / a  |    b  \                  <I, II, III, IV> - sections
                                            /    |         \                 k - slope angle; height / width of line 
                                           /    |           \                
                                          /    |             \               <k = <THS (corresponding angles with 
                                         /    |               \              paralel lines and transversal PH) 
                                       ()     |               ()             a, b - angles from Line to respective arrow
                                       L     |                    R          HL - left arrow head, <SHL angle from end.x axis
                                            |                                HR - left arrow head, <SHR angle from end.x axis
                                           |                                 k + 180 ==> get opposite angle from slope 
                                          |                                  << e.g. k = -60deg(I section) 
                                         |                                   k + 180 = 120deg(III section)  
          -179                          |                                    line that goes from top to bottom >>
                                        |                                    <SHL = k + 180 + a
                                       | k                                   << e.g. -60+180+40 = 160deg  >>
      180 <----------------------------()--------------------------------> 0 <SHR = k + 180 - b        
          179                          P                                     << e.g. -60+180-40 = 80 >>
                                  
                                                                             |>LHL': 
                                                                             <LHL' in triangle <=> <SHL on axis
                                                                             Lx, Ly - ?
                                                                             Lx = L'H  Ly = LL' LH = prefered arrow size
                                                                             sin <LHL' = LL' / LH = Ly / LH => Ly = sin<LHL' * LH  
                                                                             cos <LHL' = L'H / LH = Lx / LH => Lx = cos<LHL' * LH 
                                                                             Same for |>RHR'
                    <III>                                      <IV>
                                  |
                                  v
                                  90
   */
  context.moveTo(
    end.x + headLen * Math.cos(axisAngle - arrowAngle + Math.PI),
    end.y + headLen * Math.sin(axisAngle - arrowAngle + Math.PI)
  );
  context.lineTo(end.x, end.y);
  context.lineTo(
    end.x + headLen * Math.cos(axisAngle + arrowAngle + Math.PI),
    end.y + headLen * Math.sin(axisAngle + arrowAngle + Math.PI)
  );
  context.stroke();
  context.closePath();
};

export { drawRect, drawLine, drawArrowHead, getSnapPoint, getDistance };
