import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { TableCell, Link, Tooltip} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {createTheme, ThemeProvider, styled, alpha, useTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import Iconify from '../../components/iconify';

const themee = createTheme({
  palette: {
      success: green,
  },
});
const useStyles = makeStyles((theme) => ({
  tooltip: {
    fontSize: '1rem',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  tooltipError: {
    fontSize: '1rem',
    backgroundColor: theme.palette.error.main,
    color: 'white',
  },
  tooltipSuccess: {
    fontSize: '1rem',
    backgroundColor: theme.palette.success.main,
    color: 'white',
  },
}));

LinkTableCellWithIcon.propTypes = {
  align: PropTypes.string,
  onClick: PropTypes.func,
  param: PropTypes.string,
  isVerified: PropTypes.bool,
  };
export default function LinkTableCellWithIcon({ align , onClick , param , isVerified}) {
    const theme = createTheme({
    palette: {
        success: green,
    },
  });
  const classes = useStyles();

  const [tooltipColor, setToolTipColor] = useState(classes.tooltip);


useEffect(()=>{
  if(isVerified){
    setToolTipColor(classes.tooltip)
  }else{
    setToolTipColor(classes.tooltipError)
  }
    // eslint-disable-next-line react-hooks/exhaustive-deps
},[isVerified])



    return (
    <TableCell align={align}>
                <Tooltip
                title={isVerified ? 'Verified' : 'Not Verified'}
                placement="top"
                disableFocusListener
                classes={{ tooltip:  tooltipColor }}
              >
              <Iconify icon="ic:round-verified-user" 
              
              color={isVerified ? 'green' : 'red'} 
              sx={{
                mb:-0.5, mr:0.5
              }}
               /> 
              </Tooltip>
        <Link onClick={onClick} color="inherit" sx={{ 
          cursor: 'pointer', 
          textDecoration:"underline",
          textDecorationStyle: "dotted" , 
          fontWeight:"bold",
          // bgcolor: (theme) => alpha(theme.palette.info.dark, 0.92),
          '&:hover': {
            color: (themes) => alpha(themes.palette.info.main, 0.98),
          }
           }} 
          >
              {param}
              </Link>

    </TableCell>
    )
}