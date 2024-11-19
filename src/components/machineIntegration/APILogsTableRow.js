import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Chip, TableCell } from '@mui/material';
import { fDateTime } from '../../utils/formatTime';
import { StyledTableRow } from '../../theme/styles/default-styles';
import LinkTableCell from '../ListTableTools/LinkTableCell';
import DialogViewApiLogDetails from '../Dialog/DialogViewApiLogDetails';

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
    apiType,
    requestMethod,
    requestURL,
    responseStatusCode,
    responseTime,
    machine,
    customer,
    additionalContextualInformation,
    requestHeaders = {},
    createdIP = '', 
    createdBy = '' 
  } = row;
  
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRowClick = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

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
    <>
    <StyledTableRow hover selected={selected}>
      {!hiddenColumns?.createdAt && <LinkTableCell align="left" onClick={handleRowClick} param={fDateTime(createdAt)}/>}
      {!hiddenColumns?.apiType &&<TableCell align="left"><i>{apiType}</i></TableCell>}
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
      {!hiddenColumns?.additionalContextualInformation && <TableCell align="left">{additionalContextualInformation}</TableCell>}
      {!hiddenColumns?.['customer.name'] && <TableCell align="left">{customer?.name || ''}</TableCell>}
      {!hiddenColumns?.machine &&<LinkTableCell align="left" onClick={handleRowClick} param={machine?.[0]?.serialNo || ''}/>}
    </StyledTableRow>

    <DialogViewApiLogDetails
        open={dialogOpen}
        onClose={handleCloseDialog}
        logDetails={{
          createdAt: fDateTime(createdAt),
          apiType,
          requestMethod,
          requestURL,
          responseStatusCode,
          responseTime,
          additionalContextualInformation,
          customerName: customer?.name || '',
          serialNo: machine?.[0]?.serialNo || '',
          machineName: machine?.[0]?.name || '',
          portalKeyCreatedBy: machine?.[0]?.portalKey?.[0]?.createdBy?.name || '',
          requestHeaders: {
            'content-type': requestHeaders['content-type'],
            'content-length': requestHeaders['content-length'],
            connection: requestHeaders.connection,
            host: requestHeaders.host
          },
          createdIP,
          createdBy: createdBy?.name || '',
        }}
      />
     </>
  );
}
