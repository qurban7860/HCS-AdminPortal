import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

// SETUP COLORS

const GREY = {
  0: '#FFFFFF',
  100: '#F4F4F4',
  200: '#F5F5F5',
  300: '#DFDFDF',
  400: '#DFE3E8',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

const PRIMARY = {
  lighter: '#0940B2',
  light: '#0940B2',
  main: '#0940B2',
  dark: '#10079F',
  darker: '#10079F',
  contrastText: '#fff',
};

const SECONDARY = {
  lighter: '#FFEA00',
  light: '#FFC300',
  main: '#FFA200',
  dark: '#FFA200',
  darker: '#FFA200',
  contrastText: '#fff',
};

const INFO = {
  lighter: '#51BFE2',
  light: '#00A5DB',
  main: '#0084C9',
  dark: '#01466F',
  darker: '#001824',
  contrastText: '#fff',
};

const SUCCESS = {
  lighter: '#897A69',
  light: '#0940B2',
  main: '#10079F',
  dark: '#10079F',
  darker: '#FFA200',
  contrastText: '#fff',
};

const WARNING = {
  lighter: '#FFF5CC',
  light: '#FFD666',
  main: '#FFAB00',
  dark: '#B76E00',
  darker: '#7A4100',
  contrastText: GREY[800],
};

const ERROR = {
  lighter: '#FFE9D5',
  light: '#FFAC82',
  main: '#FF5630',
  dark: '#B71D18',
  darker: '#7A0916',
  contrastText: '#fff',
};

// const HOWICKGRAY = {
//   light: '#F4F4F4',
//   main: '#DFDFDF',
//   dark: '#DFE3E8',
// };

const HOWICKBLUE = {
  light: '#0084C9',
  main: '#0940B2',
  dark: '#10079F',
};

const HOWICKORANGE = {
  main: '#FFA200',
};

const HOWICKBRONZE = {
  lighter: '#B8AEA3',
  light: '#A39586',
  main: '#897A69',
  dark: '#5E5244',
  darker: '#473D31',
};

const HOWICKBURNIN = {
  main: '#D1ED18',
};

const COMMON = {
  common: { black: '#000', white: '#fff' },
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  bronze: HOWICKBRONZE,
  blue: HOWICKBLUE,
  orange: HOWICKORANGE,
  burnIn: HOWICKBURNIN,
  divider: alpha(GREY[500], 0.24),
  action: {
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export default function palette(themeMode) {
  const light = {
    ...COMMON,
    mode: 'light',
    text: {
      primary: GREY[800],
      secondary: GREY[600],
      disabled: GREY[500],
    },
    background: { paper: '#fff', default: '#fff', neutral: GREY[200] },
    action: {
      ...COMMON.action,
      active: GREY[600],
    },
  };

  const dark = {
    ...COMMON,
    mode: 'dark',
    text: {
      primary: '#fff',
      secondary: GREY[500],
      disabled: GREY[600],
    },
    background: {
      paper: GREY[800],
      default: GREY[900],
      neutral: alpha(GREY[500], 0.16),
    },
    action: {
      ...COMMON.action,
      active: GREY[500],
    },
  };

  return themeMode === 'light' ? light : dark;
}
