import PropTypes from 'prop-types';
import { Button, TableCell } from '@mui/material';
import { alpha } from '@mui/material/styles';
import useLimitString from '../../hooks/useLimitString';

export default function LinkDialogTableCell({ align, onClick, param, width }) {
  return (
    <TableCell className='ellipsis-cell' align={align} color="inherit">
      <Button disableTouchRipple sx={{
        cursor: 'pointer',
        textDecoration: 'underline',
        textDecorationStyle: 'dotted',
        fontWeight: 'bold',
        whiteSpace: 'nowrap', 
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        background: 'none',
        color: (theme) => alpha(theme.palette.text.primary, 0.98),
        justifyContent: 'flex-start',
        p: 0,
        m: 0,
        width: width || '100%',
        '&:hover': {
          color: (theme) => alpha(theme.palette.mode === 'light' ? theme.palette.info.main : theme.palette.info.light, 0.98),
          textDecoration: 'underline',
          textDecorationStyle: 'dotted',
          background: 'none',
        }
      }}
        onClick={onClick}>
        {useLimitString(param)}
      </Button>

    </TableCell>
  );
}

LinkDialogTableCell.propTypes = {
  align: PropTypes.string,
  onClick: PropTypes.func,
  param: PropTypes.string,
  width: PropTypes.string,
};
