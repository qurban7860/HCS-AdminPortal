import { styled, alpha } from '@mui/material/styles';
import { Popover, Stack, Card, Chip, Container, TableRow, Badge } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { bgBlur } from '../../utils/cssStyles';

/**
 * @cover :components ____________________________________________________________________________________________
 */

export const StyledRoot = styled('div')(({ theme, isArchived }) => ({
  '&:before': {
    ...bgBlur({
      color: isArchived ? theme.palette.grey[600] : theme.palette.primary.dark,
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

export const HtmlTooltip = styled(({ className, ...props }, TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

export const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 3,
    top: 7,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
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
export const StyledVersionChip = styled(Chip)(({ theme, pointer }) => ({
  margin: theme.spacing(0.2),
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.25),
  },
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: theme.palette.primary.main,

  // change mui chip padding top and bottom
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
}));
export const StyledStack = styled(Stack)(({ theme }) => ({
  justifyContent: 'flex-end',
  flexDirection: 'row',
  '& > :not(style) + :not(style)': {
    marginLeft: theme.spacing(1),
  },
  // marginBottom: theme.spacing(-5),
  // marginRight: theme.spacing(3),
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
    '&:hover':{
      backgroundColor: '#2065d114',
    }
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#f4f6f866',
    '&:hover':{
      backgroundColor: '#2065d114',
    }
  },
}));

// --------------------------------------------------------------------------------------------

// @root - GeneralAppPage - dashboard

export const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundImage: `url(../../assets/background/Howick_elements_bg_2.svg)`,
  backgroundRepeat: 'no-repeat',
  backgroundPositionY: 'center',
  backgroundPositionX: 'left',
  backgroundSize: '100%',
  backgroundBlendMode: 'multiply',
  backgroundOpacity: 0.9,
  backgroundAttachment: 'fixed',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 0,
  alignContent: 'center',
  color: 'text.primary',
  paddingRight:24,
  paddingLeft:24
}));

export const StyledGlobalCard = styled(Card)(({ theme }) => ({
  paddingRight: theme.spacing(3),
  paddingLeft: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundImage: ` url(../../assets/illustrations/world.svg)`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'top right',
  backgroundSize: 'auto 90%',
  height: 'auto',
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
  transform: 'scaleX(-1)'
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
