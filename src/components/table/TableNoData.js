import PropTypes from 'prop-types';
import { TableCell } from '@mui/material';
import EmptyContent from '../empty-content';


// ----------------------------------------------------------------------

TableNoData.propTypes = {
  isNotFound: PropTypes.bool,
};

export default function TableNoData({ isNotFound }) {
  return (
    <>
      {isNotFound ? (
        <EmptyContent
          title="Empty"
          sx={{
            color: '#DFDFDF'
          }}
        />
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </>
  );
}
