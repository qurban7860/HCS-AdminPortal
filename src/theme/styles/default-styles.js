import PropTypes from 'prop-types';
import { styled, alpha } from '@mui/material/styles';
import { Popover, Stack, Card, Chip, Container, TableRow, Badge, StepConnector, stepConnectorClasses, IconButton } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { bgBlur } from '../../utils/cssStyles';
import Iconify from '../../components/iconify';

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
  <Tooltip {...props} arrow classes={{ popper: className || "" }} />
))(({ theme, tooltipcolor }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: tooltipcolor || theme.palette.primary.main,
    bottom: '1px !important'
  },
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: '1rem',
    backgroundColor: tooltipcolor || theme.palette.primary.main,
  }
}));


export const StyledTooltipIconButton = ({
  icon,
  tooltip,
  color,
  tooltipColor,
  loading = false,
  disabled = false,
  onClick,
  placement = 'top',
}) => {
  const isInactive = loading || disabled;
  const buttonBg = isInactive ? "#ccc" : "#2065D1";
  const buttonHoverBg = isInactive ? "#ccc" : "#103996";

  return (
    <StyledTooltip
      title={tooltip}
      placement={placement}
      tooltipcolor={tooltipColor}
      disableFocusListener
      color={color}
    >
      <span>
        <IconButton
          disabled={isInactive}
          onClick={onClick}
          sx={{
            background: buttonBg,
            borderRadius: 1,
            height: '1.7em',
            p: '8.5px 14px',
            color: '#fff',
            '&:hover': {
              background: buttonHoverBg,
              color: '#fff',
            },
          }}
        >
          {loading ? (
            <Iconify
              key="loading"
              icon="eos-icons:loading"
              sx={{ color: '#fff', height: 24, width: 24 }}
            />
          ) : (
            <Iconify
              key="icon"
              icon={icon}
              sx={{ color: '#fff', height: 24, width: 24 }}
            />
          )}
        </IconButton>
      </span>
    </StyledTooltip>
  );
};


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

export const StyledContainedIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: '8px',
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
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
    backgroundColor: theme.palette.mode === 'light' 
      ? theme.palette.background.paper 
      : theme.palette.action.hover,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08)
    },
  },
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.mode === 'light' 
      ? theme.palette.grey[100] 
      : theme.palette.background.default,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08)
    },
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
  paddingRight: 24,
  paddingLeft: 24
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
  position: 'sticky',
  top: '60px',
  zIndex: '2',
  [theme.breakpoints.down('sm')]: { height: 140 },
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


export const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '0px',
  padding: '5px 16px',
  marginTop: '5px',
  color: '#707070',
  borderRadius: '10px',
  fontSize: 'small',
  backgroundColor: '#ededed',
}));

export const GroupItems = styled('ul')({
  padding: 0,
});

export const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient(95deg, rgb(183 183 183) 0%, #2b64cd 50%, #103996 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient(95deg, rgb(183 183 183) 0%, #2b64cd 50%, #103996 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 40,
  height: 40,
  display: 'flex',
  borderRadius: '10px',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 14,
  ...(ownerState.active && {
    background: '#2065d1',
    // boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    background: '#2065d1',
  }),
}));

export function ColorlibStepIcon(props) {
  const { active, completed, className, icon } = props;
  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icon}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

StyledTooltipIconButton.propTypes = {
  icon: PropTypes.string,
  tooltip: PropTypes.string,
  color: PropTypes.string,
  tooltipColor: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  placement: PropTypes.string
};