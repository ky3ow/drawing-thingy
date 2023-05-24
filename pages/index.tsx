import type { NextPage } from 'next';
import Head from 'next/head';
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import Controls from '../components/Controls';
import ExtraControls from '../components/ExtraControls';
import Logo from '../components/Logo';
import {
  defaultStyles,
  Point,
  Position,
  Shape,
  Styles,
  tools,
  ToolState,
} from '../helper/tools';
import { Form } from '../components/Form';

const useElements = (initialState: Shape[]) => {
  const [elements, setElements] = useState(initialState);

  const getElementById = (id: string | undefined) => {
    if (id === undefined) return null;
    return elements.find((e) => e.id === id);
  };
  const getElementAtPosition = (point: Point): [Shape | null, Position] => {
    for (const element of elements) {
      const pos = element.checkIntersection(point);
      if(pos) return [element, pos];
    }
    return [null, null];
  };
  const getCurrentElement = () => {
    return elements[elements.length - 1];
  };
  // get element, copy it, make changes to it, then invoke update
  const updateElements = (elementToUpdate: Shape) => {
    setElements(
      elements.map((e) => {
        if (e.id === elementToUpdate?.id) {
          return elementToUpdate;
        }
        return e;
      })
    );
  };

  const [selectedElement, _setSelected] = useState<Shape>();

  const getSelected = () => {
    return getElementById(selectedElement?.id);
  };
  const setSelected = (element: Shape | undefined) => {
    setElements((el) => {
      return el.map((e) => {
        if (e.id === element?.id) {
          return { ...e, selected: true };
        }
        return { ...e, selected: false };
      });
    });
    _setSelected(element);
  };

  return {
    elements,
    getElementAtPosition,
    getCurrentElement,
    setElements,
    updateElements,
    getSelected,
    setSelected,
  };
};

const Home: NextPage = () => {
  const [activeTool, setTool] = useState<ToolState>();
  const [status, setStatus] = useState<'idle' | 'drawing' | 'moving' | 'resizing'>('idle');
  const [position, setPosition] = useState<Position>(null);
  const {
    elements,
    getElementAtPosition,
    getCurrentElement,
    setElements,
    updateElements,
    getSelected,
    setSelected,
  } = useElements([]);
  const tool = useMemo(() => {
    return tools.find((tool) => tool.title === activeTool);
  }, [activeTool]);

  const [styles, setStyles] = useState<Styles>(defaultStyles);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !container || !ctx) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.width = `${container.clientWidth}px`;
    canvas.style.height = '100vh';
    ctxRef.current = ctx;

    const handleResize = (event: UIEvent) => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      canvas.style.width = `${container.clientWidth}px`;
      canvas.style.height = '100vh';
      elements.forEach((el) => {
        el.render();
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [elements]);

  useEffect(() => {
    ctxRef.current?.clearRect(
      0,
      0,
      ctxRef.current.canvas.width,
      ctxRef.current.canvas.height
    );
    elements.forEach((el) => {
      el.render();
    });
  }, [elements]);

  const setCursorStyle = (point: Point) => {
    if (!canvasRef.current) return;
    if (tool?.title === 'cursor') {
      const [_, pos] = getElementAtPosition(point);
      let cursorType;
      if (getSelected()) {
        switch (pos) {
          case 'in':
            cursorType = 'move';
            break;
          case 'point':
            cursorType = 'pointer';
            break;
          case 'tl':
          case 'br':
            cursorType = 'nwse-resize';
            break;
          case 'tr':
          case 'bl':
            cursorType = 'nesw-resize';
            break;
          case 't':
          case 'b':
            cursorType = 'ns-resize';
            break;
          case 'l':
          case 'r':
            cursorType = 'ew-resize';
            break;
          default:
            cursorType = 'default';
        }
      } else if (pos === 'in') {
        cursorType = 'move';
      } else {
        cursorType = 'default';
      }
      canvasRef.current.style.cursor = cursorType;      
    } else {
      canvasRef.current.style.cursor = 'crosshair';
    }
  };

  const start = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!tool || !ctxRef.current) return;
    const { offsetX, offsetY } = event.nativeEvent;
    const point = { x: offsetX, y: offsetY };
    switch (tool.type) {
      case 'shape': {
        const element = tool.generateShape(point, ctxRef.current, styles);
        setElements([...elements, element]);
        setStatus('drawing');
        break;
      }
      case 'selection': {
        const [element, position] = getElementAtPosition(point);
        setPosition(position);
        if (position === 'in') {
          if (element) {
            setStatus('moving');
            element.setOffset(point);
            updateElements(element);
            setSelected(element);
          }
        } else if (position === null) {
          setSelected(undefined);
        } else {
          setStatus('resizing');
          element!.setOffset(point);
        }
        break;
      }
    }
  };
  const draw = (event: MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;
    const endPoint = { x: offsetX, y: offsetY };
    setCursorStyle(endPoint);
    if (status === 'idle' || !tool) return;

    switch (tool.type) {
      case 'shape': {
        const element = getCurrentElement();
        element.transform(element.start, endPoint);
        
        updateElements(element);
        break;
      }
      case 'selection': {
        const element = getSelected();
        if (!element) return;
        switch (position) {
          case 'in': {
            element.move(endPoint);
            break;
          }
          case 'tl': {
            element.transform(endPoint, element.end);
            break;
          }
        }
        updateElements(element);
        break;
      }
    }
  };
  const end = () => {
    if (tool?.type === 'shape') {
      const element = getCurrentElement();
      element.normalize();
      setSelected(element);
    } else if (tool?.type === 'selection') {
      getSelected()?.normalize();
    }
    setTool('cursor');
    setStatus('idle');
  };

  return (
    <div>
      <Head>
        <title>Drawing thing</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main
        className={`flex min-h-screen transition-colors duration-500 dark:bg-zinc-900 ${
          formVisible ? 'saturate-50 filter' : ''
        }`}
      >
        <div
          className={`z-5 absolute inset-0 flex items-center justify-center bg-slate-900 bg-opacity-30 ${
            formVisible ? 'block' : 'hidden'
          }`}
        >
          <Form close={() => setFormVisible(false)} />
        </div>
        <aside className='flex min-w-max  flex-col items-center gap-4 p-2 py-4 shadow-lg shadow-black/50 dark:bg-zinc-800/75 dark:shadow-transparent'>
          <button onClick={() => setFormVisible((e) => !e)}>
            <Logo className=' hover:text-rose-600' />
          </button>
          <Controls tool={activeTool} setter={setTool} />
        </aside>
        <div className='flex grow overflow-x-auto'>
          <canvas
            ref={canvasRef}
            onMouseDown={start}
            onMouseMove={draw}
            onMouseUp={end}
          />
        </div>
        <aside className='min-w-max dark:bg-zinc-800/75'>
          <ExtraControls
            clear={() => {
              ctxRef.current?.clearRect(
                0,
                0,
                ctxRef.current.canvas.width,
                ctxRef.current.canvas.height
              );
              setElements([]);
            }}
            styles={styles}
            setStyles={setStyles}
            update={(newStyles) => {
              const element = getSelected();
              if (!element) return;
              element.setStyles(newStyles);
              updateElements(element);
            }}
          />
        </aside>
      </main>
    </div>
  );
};

export default Home;
