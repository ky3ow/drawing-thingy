import type { NextPage } from 'next';
import Head from 'next/head';
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import Controls from '../components/Controls';
import ExtraControls from '../components/ExtraControls';
import Logo from '../components/Logo';
import {
  defaultStyles,
  Shape,
  Styles,
  tools,
  ToolState,
} from '../helper/tools';

const useElements = (initialState: Shape[]) => {
  const [elements, setElements] = useState(initialState);

  const getElementById = (id: string | undefined) => {
    if (id === undefined) return null;
    return elements.find((e) => e.id === id);
  };
  const getElementAtPosition = (x: number, y: number) => {
    return elements
      .filter((element) => element.checkIntersection({ x, y }) === true)
      .pop();
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
  const [status, setStatus] = useState<'idle' | 'drawing' | 'moving'>('idle');
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
  const [special, setSpecial] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

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

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Shift') {
        setSpecial(true);
      }
    });
    window.addEventListener('keyup', (event) => {
      if (event.key === 'Shift') {
        setSpecial(false);
      }
    });
  }, []);

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

  const setCursorStyle = (x: number, y: number) => {
    if (!canvasRef.current) return;
    if (tool?.title === 'cursor') {
      canvasRef.current.style.cursor = getElementAtPosition(x, y)
        ? 'move'
        : 'default';
    } else {
      canvasRef.current.style.cursor = 'crosshair';
    }
  };

  const start = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!tool || !ctxRef.current) return;
    const { type } = tool;
    const { offsetX: x, offsetY: y } = event.nativeEvent;
    switch (type) {
      case 'shape': {
        const element = tool.generateShape({ x, y }, ctxRef.current, styles);
        setElements([...elements, element]);
        setStatus('drawing');
        break;
      }
      case 'selection': {
        const element = getElementAtPosition(x, y);
        if (element) {
          setStatus('moving');
          element.setOffset({ x, y });
          updateElements(element);
          setSelected(element);
        } else {
          setSelected(undefined);
        }
        break;
      }
    }
  };
  const draw = (event: MouseEvent<HTMLCanvasElement>) => {
    const { offsetX: x, offsetY: y } = event.nativeEvent;
    setCursorStyle(x, y);
    if (status === 'idle' || !tool) return;
    const { type } = tool;

    switch (type) {
      case 'shape': {
        const element = getCurrentElement();
        element.specialRender = special;
        element.transform({ x, y });
        updateElements(element);
        break;
      }
      case 'selection': {
        const element = getSelected();
        if (!element) return;
        element.move({ x, y });
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
    }
    // setTool('cursor');
    setStatus('idle');
  };

  return (
    <div>
      <Head>
        <title>Drawing thing</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='flex min-h-screen transition-colors duration-500 dark:bg-zinc-900'>
        <aside className='flex min-w-max  flex-col items-center gap-4 p-2 py-4 shadow-lg shadow-black/50 dark:bg-zinc-800/75 dark:shadow-transparent'>
          <a href='https://github.com/volodymyr-havryliuk165' target='blank'>
            <Logo className=' hover:text-rose-600' />
          </a>
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
