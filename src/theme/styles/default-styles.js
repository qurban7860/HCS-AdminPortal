import { styled } from '@mui/material/styles';
import { Popover, Stack } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { bgBlur } from '../../utils/cssStyles';

/**
 * @cover :components ____________________________________________________________________________________________
 */

export const StyledRoot = styled('div')(({ theme }) => ({
  '&:before': {
    ...bgBlur({
      color: theme.palette.primary.dark,
    }),
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: 'calc(100% - 50px)',
    position: 'absolute',
  },
}));

export const StyledInfo = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

export const StyledCustomAvatar = styled('div')(({ theme }) => ({
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: 'common.white',
  color: '#fff',
  fontSize: '4rem',
  ml: { xs: 3, md: 3 },
  mt: { xs: 1, md: 1 },
  width: { xs: 110, md: 110 },
  height: { xs: 110, md: 110 },
}));

export const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme, toolTipColor }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: toolTipColor,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: '1rem',
    backgroundColor: toolTipColor,
  },
}));

export const StyledTooltipSliding = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme, toolTipColor }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: toolTipColor,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: '1rem',
    color: toolTipColor,
    backgroundColor: 'transparent',
  },
}));

export const StyledStack = styled(Stack)(({ theme }) => ({
  justifyContent: 'flex-end',
  flexDirection: 'row',
  '& > :not(style) + :not(style)': {
    marginLeft: theme.spacing(2),
  },
  marginBottom: theme.spacing(-5),
  marginRight: theme.spacing(3),
  '& .MuiButton-root': {
    minWidth: '32px',
    width: '32px',
    height: '32px',
    padding: 0,
    '&:hover': {
      background: 'transparent',
    },
  },
}));

export const StyledPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    size: '100%',
    overflow: 'hidden',
    borderRadius: 0,
  },
  '& .MuiPopover-paper': {
    overflow: 'hidden',
  },
  '& .MuiPopover-paper .MuiList-root': {
    padding: '0px',
  },
  '& .MuiPopover-paper .MuiTypography-root': {
    fontSize: '1rem',
  },
  boxShadow: 'none',
  pointerEvents: 'none',
}));
