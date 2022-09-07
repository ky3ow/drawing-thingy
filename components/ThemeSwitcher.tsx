import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { BsSunFill, BsFillMoonStarsFill } from 'react-icons/bs';
import ButtonBase, { sizes } from './base/ButtonBase';

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ButtonBase
      rounded
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <BsSunFill size={sizes.sm} />
      ) : (
        <BsFillMoonStarsFill size={sizes.sm} />
      )}
    </ButtonBase>
  );
};

export default ThemeSwitcher;
