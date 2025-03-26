import PropTypes from 'prop-types';
import { TableCell } from '@mui/material';
// utils
import { fDateTime } from '../../../utils/formatTime';
import { StyledTableRow, StyledTooltip } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

EmailListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  hiddenColumns: PropTypes.object,
  handleOpenDialog: PropTypes.func,
};

export default function EmailListTableRow({
  row,
  selected,
  onViewRow,
  hiddenColumns,
  handleOpenDialog,
}) {
  const { subject, status, customer, toEmails, createdAt, fromEmail } = row;

  return (
    <StyledTableRow
      hover
      selected={selected}
    >
      {!hiddenColumns?.toEmails &&
        <TableCell align='left'>
          {Array.isArray(toEmails) && toEmails.length > 1 ? (
            <StyledTooltip
              title={toEmails.join(', ')}
              placement="top"
              tooltipcolor="#2065D1"
            >
              <span>{toEmails[0]} ,...</span>
            </StyledTooltip>
          ) : (
            toEmails?.[0] || ''
          )}
        </TableCell>
      }
      {!hiddenColumns?.fromEmail &&
        <TableCell align='left'>
          {fromEmail || ''}
        </TableCell>
      }

      {!hiddenColumns?.subject &&
        <TableCell
          align='left'
          sx={{
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
          onClick={() => handleOpenDialog(row?._id)}
        >
          {subject || ''}
          {status && status?.toLowerCase() === "failed" && (
            <span style={{ color: "red" }}> ({status})</span>
          )}
        </TableCell>
      }
      {!hiddenColumns?.["customer.name"] &&
        <TableCell align='left' >
          {customer?.name || ''}
        </TableCell>
      }

      {!hiddenColumns?.createdAt &&
        <TableCell align='right'>
          {fDateTime(createdAt)}
        </TableCell>
      }

    </StyledTableRow>
  );
}
