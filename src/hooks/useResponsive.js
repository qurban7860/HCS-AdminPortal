import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// ----------------------------------------------------------------------

export default function useResponsive(query, start, end) {
  const theme = useTheme();

  const mediaUp = useMediaQuery(theme.breakpoints.up(start));

  const mediaDown = useMediaQuery(theme.breakpoints.down(start));

  const mediaBetween = useMediaQuery(theme.breakpoints.between(start, end));

  const mediaOnly = useMediaQuery(theme.breakpoints.only(start));

  if (query === 'up') {
    return mediaUp;
  }

  if (query === 'down') {
    return mediaDown;
  }

  if (query === 'between') {
    return mediaBetween;
  }

  return mediaOnly;
}

// ----------------------------------------------------------------------

export function useWidth() {
  const theme = useTheme();

  const keys = [...theme.breakpoints.keys].reverse();

  return (
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || 'xs'
  );
}

export function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth;
}


export const useScreenSize = (size) => {
  const width = useWidth()
  const [isSize, setIsSize] = useState(false);

  const checkSize = () => {
    switch (size) {
      case 'sm':
        setIsSize( width === 'sm' || width === 'md' || width === 'lg' || width === 'xl' );
        break;
      case 'md':
        setIsSize( width === 'md' || width === 'lg' || width === 'xl' );
        break;
      case 'lg':
        setIsSize( width === 'lg' || width === 'xl' );
        break;
      case 'xl':
        setIsSize( width === 'xl');
        break;
      default:
        setIsSize(false);
        break;
    }
  }
  useEffect(() => {
    checkSize();
          // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  return isSize;
}

