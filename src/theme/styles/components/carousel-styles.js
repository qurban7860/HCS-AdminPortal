import { styled } from '@mui/material/styles';
import { CardMedia, Card, Typography, Grid, Popover, IconButton } from '@mui/material';

export const CarouselRootContainer = styled('div')({
  width: '100%',
  height: '200px',
  objectFit: 'cover',
});

export const CarouselContainer = styled('div')({
  width: '100%',
  position: 'relative',
  objectFit: 'cover',
});

export const CarouselButtonWrapper = styled('div')({
  position: 'absolute',
  backgroundColor: 'transparent',
  top: 'calc(50% - 70px)',
  '&:hover': {
    '& $button': {
      backgroundColor: 'black',
      opacity: '0.4',
    },
  },
});

export const CarouselFullHeightHoverWrapper = styled('div')({
  height: '100%',
  top: '0',
});

export const CarouselButtonVisible = styled('div')({
  opacity: '.2',
});

export const CarouselButtonHidden = styled('div')({
  opacity: '0',
});

export const CarouselButton = styled('div')({
  position: 'absolute',
  top: 'calc(50% - 20px) !important',
  color: 'white',
  transition: '200ms',
  cursor: 'pointer',
  '&:hover': {
    opacity: '0.6 !important',
  },
});

export const NextButton = styled(CarouselButton)({
  right: 0,
});

export const PrevButton = styled(CarouselButton)({
  left: 0,
});