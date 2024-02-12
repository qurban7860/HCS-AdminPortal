import PropTypes from 'prop-types';
import { Button, TableCell } from '@mui/material';
import { alpha } from '@mui/material/styles';
import useLimitString from '../../hooks/useLimitString';

export default function LinkDialogTableCell({ align, onClick, param }) {
  return (
        <TableCell className='ellipsis-cell' align={align} color="inherit">
          <Button disableTouchRipple sx={{
            cursor: 'pointer',
            textDecoration: 'underline',
            textDecorationStyle: 'dotted',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',      // Prevent text from wrapping
            overflow: 'hidden',       // Hide any overflow
            textOverflow: 'ellipsis', // Add ellipsis for overflowed text
            background:'none',
            color:'black',
            justifyContent:'flex-start',
            p:0,
            m:0,
            width:'100%',
            '&:hover': {
              color: (theme) => alpha(theme.palette.info.main, 0.98),
              textDecoration: 'underline',
              textDecorationStyle: 'dotted',
              background:'none',
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
};
