import { styled, alpha } from '@mui/material/styles';
import { Popover, Stack, Card, Container, TableRow } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { bgBlur, bgGradient } from '../../utils/cssStyles';

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
))(({ theme, tooltipcolor }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: tooltipcolor,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: '1rem',
    backgroundColor: tooltipcolor,
  },
}));

export const StyledTooltipSliding = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme, tooltipcolor }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: tooltipcolor,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: '1rem',
    color: tooltipcolor,
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

/**
 * @table :components ____________________________________________________________________________________________
 */

// @root - StyledTableRow -
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'white',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#f4f6f866',
  },
}));

// --------------------------------------------------------------------------------------------

// @root - GeneralAppPage - dashboard

export const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundImage: `url(../../assets/illustrations/illustration_howick_icon.svg)`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'top right',
  backgroundSize: 'auto 90%',
  backgroundOpacity: 0.1,
  backgroundAttachment: 'fixed',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 0,
  alignContent: 'center',
  color: 'text.primary',
}));

export const StyledGlobalCard = styled(Card)(({ theme }) => ({
  paddingRight: theme.spacing(3),
  paddingLeft: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundImage: ` url(../../assets/illustrations/world.svg)`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'top right',
  backgroundSize: 'auto 90%',
}));

// --------------------------------------------------------------------------------------------
/**
 * @styled components from minimal layout
 */

export const StyledBg = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  position: 'absolute',
  transform: 'scaleX(-1)',
  ...bgGradient({
    color: alpha(theme.palette.background.default, theme.palette.mode === 'light' ? 0.9 : 0.94),
    imgUrl: '/assets/background/overlay_2.jpg',
  }),
}));

export const StyledCardContainer = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  height: 160,
  position: 'relative',
}));

// @root - MachineEditForm - spacing
export const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

/**
 * @options components props --------------------------------------------------------------------------------------------
 */

// @root CustomerListTableToolbar
export const options = {
  spacing: 2,
  alignItems: 'center',
  direction: { xs: 'column', md: 'row' },
  sx: { px: 2.5, py: 3 },
};
