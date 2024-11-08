import PropTypes from 'prop-types';
import { Chip, TableCell } from '@mui/material';
import { fDateTime } from '../../utils/formatTime';
import { StyledTableRow } from '../../theme/styles/default-styles';

APILogsTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  hiddenColumns: PropTypes.object,
};

export default function APILogsTableRow({
  row,
  style,
  selected,
  onViewRow,
  hiddenColumns
}) {
  const {
    createdAt,
    requestMethod,
    requestURL,
    responseStatusCode,
    responseTime,
    machine,
    customer,
    additionalContextualInformation,
  } = row;

  const getChipColor = (method) => {
    switch (method) {
      case 'GET':
        return 'info';
      case 'POST':
        return 'info';
      case 'PUT':
        return 'warning';
      case 'DELETE':
        return 'error';
      default:
        return 'default';
    }
  };

  const getResponseStatusColor = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) {
      return 'success';
    }
    if (statusCode >= 400 && statusCode < 500) {
      return 'error';
    }
    return 'default';
  };

  return (
    <StyledTableRow hover selected={selected} onClick={onViewRow}>
      {!hiddenColumns?.createdAt && <TableCell align="left">{fDateTime(createdAt)}</TableCell>}
      {!hiddenColumns?.requestMethod &&
          <TableCell align="left">
            <Chip
              label={requestMethod}
              size="small"
              color={getChipColor(requestMethod)}
            />
          </TableCell>
      }
      {!hiddenColumns?.requestURL &&<TableCell align="left">
        {requestURL?.replace('/api/1.0.0/', '') || requestURL}
      </TableCell>}
      {!hiddenColumns?.responseStatusCode && 
          <TableCell align="left">
            <Chip
              label={responseStatusCode}
              size="small"
              color={getResponseStatusColor(responseStatusCode)}
            />
          </TableCell>
      }
      {!hiddenColumns?.responseTime &&<TableCell align="left"><i>{responseTime}</i></TableCell>}
      {!hiddenColumns?.machine &&<TableCell align="left">{machine?.[0]?.serialNo || ''}</TableCell>}
      {!hiddenColumns?.customer && <TableCell align="left">{customer?.name || ''}</TableCell>}
      {!hiddenColumns?.additionalContextualInformation && <TableCell align="left">{additionalContextualInformation}</TableCell>}
    </StyledTableRow>
  );
}
