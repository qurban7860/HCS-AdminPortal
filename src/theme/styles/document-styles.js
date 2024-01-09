import { styled } from '@mui/material/styles';
import {
  CardContent,
  CardMedia,
  Card,
  Grid,
  IconButton,
  Button,
  Typography,
  TableRow,
} from '@mui/material';
import Iconify from '../../components/iconify';

export const ThumbnailCard = styled(Card)(({ theme }) => ({
  minWidth:'140px',
  m: 0,
  p:0
}));

export const ThumbnailCardContent = styled(CardContent)(({ theme }) => ({
  position: 'relative',
  zIndex: '1',
}));

export const ThumbnailCardMedia = styled(CardMedia)(({ theme }) => ({
  height: '110px',
  opacity: '0.6',
  display: 'block',
  zIndex: '-1',
  position: 'absolute',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  width: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
}));

export const ThumbnailCardMediaIcon = styled(CardMedia)(({ theme }) => ({
  width: '70px',
  margin: '0 auto',
}));

export const ThumbnailGrid = styled(Grid)(({ theme, ...props }) => ({
  bgcolor: 'lightgray',
  alignContent: 'center',
}));

export const ThumbnailIconButton = styled(IconButton)(({ theme }) => ({
  top: 4,
  zIndex: 9,
  width: 28,
  height: 28,
  position: 'absolute',
}));

export const ThumbnailNameGrid = styled(Grid)(({ theme }) => ({
  textAlign: 'center',
}));

export const ThumbnailUploadButton = styled(Button)(({ theme }) => ({
  minHeight:'150px',
  borderRadius: '16px',
  justifyContent: 'center',
  flexDirection: 'column',
}));

// @root - DocumentListTableRow - src/pages/document/dashboard/documents/DocumentListTableRow.js
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'white',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#f4f6f866',
  },
}));
export const ThumbnailIconify = styled(Iconify)(({ theme }) => ({
  height: '90px',
  opacity: '0.6',
  display: 'block',
  zIndex: '-1',
  position: 'absolute',
  top: '5px',
  left: '0',
  right: '0',
  bottom: '0',
  width: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
}));

// label for togglebuttons: ToggleButtons.js

export const StyledToggleButtonLabel = styled(Typography)(({ theme }) => ({
  pl: 2,
  pt: 1,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  fontSmooth: 'auto',
  fontWeight: 'bold',
  color: theme.palette.grey[600],
}));

// card cover for documents
export const StyledCardCover = styled(Card)(({ theme }) => ({
  mb: 3,
  height: 160,
  position: 'relative',
}));

/**
 * @function components__________________________________________________________
 */
