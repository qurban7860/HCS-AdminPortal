import PropTypes from 'prop-types';
import { Chip, TableCell } from '@mui/material';
import { fDateTime } from '../../utils/formatTime';
import { StyledTableRow } from '../../theme/styles/default-styles';

APILogsTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};

export default function APILogsTableRow({
  row,
  style,
  selected,
  onViewRow,
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
      <TableCell align="left">{fDateTime(createdAt)}</TableCell>
          <TableCell align="left">
            <Chip
              label={requestMethod}
              size="small"
              color={getChipColor(requestMethod)}
            />
          </TableCell>
      <TableCell align="left">{requestURL}</TableCell>
          <TableCell align="left">
            <Chip
              label={responseStatusCode}
              size="small"
              color={getResponseStatusColor(responseStatusCode)}
            />
          </TableCell>
      <TableCell align="left"><i>{responseTime}</i></TableCell>
      <TableCell align="left">{machine?.[0]?.serialNo || '-'}</TableCell>
      <TableCell align="left">{customer?.name || '-'}</TableCell>
      <TableCell align="left">{additionalContextualInformation}</TableCell>
    </StyledTableRow>
  );
}