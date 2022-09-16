import { Coords } from './tools';

type DrawFunc<TParams extends any[] = []> = (
  { x0, x, y0, y }: Coords,
  context: CanvasRenderingContext2D,
  ...aditional: TParams
) => void;

// draws rectangle, can define radius for rounded angles
const drawRect: DrawFunc<[radius: number]> = (
  { x0, x, y0, y },
  context,
  radius = 0
) => {
  context.beginPath();
  context.moveTo(x0, y0 + radius);
  context.quadraticCurveTo(x0, y0, x0 + radius, y0);
  context.lineTo(x - radius, y0);
  context.quadraticCurveTo(x, y0, x, y0 + radius);
  context.lineTo(x, y - radius);
  context.quadraticCurveTo(x, y, x - radius, y);
  context.lineTo(x0 + radius, y);
  context.quadraticCurveTo(x0, y, x0, y - radius);
  context.closePath();
  context.stroke();
};

// draws simple line
const drawLine: DrawFunc = ({ x0, x, y0, y }, context) => {
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x, y);
  context.stroke();
  context.closePath();
};

const drawArrowHead: DrawFunc<[headlen: number, angle: number]> = (
  { x0, x, y0, y },
  context,
  headLen,
  arrowAngle
) => {
  const axisAngle = Math.atan2(y - y0, x - x0);
  context.beginPath();
  /*
   * (half of arrow head explained)
   *  xa - x arrowhead, ya - y             ____________
   *  c - arrowhead length                / |\  alpha
   *                                    / l|r\
   *                                  /   |  \
   *            b                   /    |    \
   *   ________________(x,y)       /    |      \
   *      |       t  /            /    |        \
   *      |        /                  |
   *      |      /                   |
   *    a |    /  c           alpha |
   *      |  /               ______|
   *      |/                    alpha - line angle
   *    (xa, ya)                lArrowhead = alpha + l
   *                            rArrowHead = alpha - r
   *
   *    xa = b       cos t = b / c ====> b = c * cos t
   *    ya = a       sin t = a / c ====> a = c * sin t
   */
  context.moveTo(
    x - headLen * Math.cos(axisAngle - arrowAngle),
    y - headLen * Math.sin(axisAngle - arrowAngle)
  );
  context.lineTo(x, y);
  context.lineTo(
    x - headLen * Math.cos(axisAngle + arrowAngle),
    y - headLen * Math.sin(axisAngle + arrowAngle)
  );
  context.stroke();
  context.closePath();
};

export { drawRect, drawLine, drawArrowHead };
