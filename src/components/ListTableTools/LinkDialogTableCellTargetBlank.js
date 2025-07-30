import PropTypes from 'prop-types';
import { TableCell,Link } from '@mui/material';
import { alpha } from '@mui/material/styles';
import OpenInNewPage from '../Icons/OpenInNewPage'

export default function LinkDialogTableCellTargetBlank({ align,   onViewRow,  onClick, param }) {
  return (
        <TableCell className='ellipsis-cell'  >
            <Link
                onClick={onViewRow}
                color="inherit"
                sx={{
                cursor: 'pointer',
                textDecoration: 'underline',
                textDecorationStyle: 'dotted',
                fontWeight: 'bold',
                '&:hover': {
                    color: (theme) => alpha(theme.palette.mode === 'light' ? theme.palette.info.main : theme.palette.info.light, 0.98)
                },
                }}
            >
                {param}
            </Link>
        {/* <Button disableTouchRipple sx={{
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
              color: (theme) => alpha(theme.palette.info.dark, 0.98),
              textDecoration: 'underline',
              textDecorationStyle: 'dotted',
              background:'none',
            }
          }}
          onClick={onViewRow}>
                {param}
        </Button> */}
                <OpenInNewPage onClick={onClick} />
        
    </TableCell>
  );
}

LinkDialogTableCellTargetBlank.propTypes = {
  align: PropTypes.string,
  onViewRow: PropTypes.func,
  onClick: PropTypes.func,
  param: PropTypes.string,
};
