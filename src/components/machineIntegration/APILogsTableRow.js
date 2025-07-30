import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Chip, TableCell } from '@mui/material';
import { useNavigate } from 'react-router';
import { fDateTime } from '../../utils/formatTime';
import { StyledTableRow } from '../../theme/styles/default-styles';
import LinkTableCell from '../ListTableTools/LinkTableCell';
import DialogViewApiLogDetails from '../Dialog/ApiLogDetailsDialog';
import DialogViewAPILogsMachineERPLogsTable from '../Dialog/APILogsMachineERPLogsTableDialog';
import { PATH_MACHINE } from '../../routes/paths';

APILogsTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  hiddenColumns: PropTypes.object,
  tableColumns: PropTypes.array,
};

export default function APILogsTableRow({ row, style, selected, onViewRow, hiddenColumns, tableColumns }) {
  const {
    _id,
    createdAt,
    apiType,
    requestMethod,
    requestURL,
    responseStatusCode,
    responseTime,
    machine,
    customer,
    updatedAt,
    responseMessage,
    response,
    createdIP = '',
    createdBy = '',
    createdByIdentifier = '',
    noOfRecordsUpdated = '',
  } = row;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [machineLogsDialogOpen, setMachineLogsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleShowApiDetails = () => {
    setDialogOpen(true);
  };

  const handleShowMachineLogs = () => {
    setMachineLogsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCloseMachineLogsDialog = () => {
    setMachineLogsDialogOpen(false);
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

  const parseResponse = (stringifiedResponse) => {
    try {
      const parsedResponse = JSON.parse(stringifiedResponse);
      return typeof parsedResponse === 'object' ? parsedResponse.message : parsedResponse || '';
    } catch (error) {
      return '';
    }
  };

  return (
    <>
      <StyledTableRow hover selected={selected}>
        {tableColumns.map((column) => {
          if (hiddenColumns?.[column.id]) return null;

          switch (column.id) {
            case 'createdAt':
              return (
                <LinkTableCell 
                  key={column.id}
                  align="left" 
                  onClick={handleShowApiDetails} 
                  param={fDateTime(createdAt)} 
                />
              );
            case 'apiType':
              return (
                <TableCell key={column.id} align="left">
                  <i>{apiType}</i>
                </TableCell>
              );
            case 'requestMethod':
              return (
                <TableCell key={column.id} align="left">
                  <Chip label={requestMethod} size="small" color={getChipColor(requestMethod)} />
                </TableCell>
              );
            case 'requestURL':
              return (
                <LinkTableCell 
                  key={column.id}
                  align="left" 
                  onClick={handleShowApiDetails} 
                  param={requestURL?.replace('/api/1.0.0/', '') || requestURL} 
                />
              );
            case 'responseStatusCode':
              return (
                <TableCell key={column.id} align="left">
                  <Chip
                    label={responseStatusCode}
                    size="small"
                    color={getResponseStatusColor(responseStatusCode)}
                  />
                </TableCell>
              );
            case 'responseTime':
              return (
                <TableCell key={column.id} align="left">
                  <i>{responseTime}</i>
                </TableCell>
              );
            case 'responseMessage':
              return (
                <TableCell key={column.id} align="left">
                  {responseMessage || parseResponse(response) || ''}
                </TableCell>
              );
            case 'noOfRecordsUpdated':
              return (
                <TableCell key={column.id} align="left">
                  {apiType === 'MACHINE-LOGS' && Number(noOfRecordsUpdated) > 0 ? (
                    <LinkTableCell 
                      align="left" 
                      onClick={handleShowMachineLogs} 
                      param={noOfRecordsUpdated || ''} 
                    />
                  ) : (
                    noOfRecordsUpdated || ''
                  )}
                </TableCell>
              );
            case 'customer.name':
              return (
                <TableCell key={column.id} align="left">
                  {customer?.name || ''}
                </TableCell>
              );
            case 'machine':
              return (
                <LinkTableCell
                  key={column.id}
                  align="left"
                  onClick={() => navigate(PATH_MACHINE.machines.view(machine?._id))}
                  param={machine?.serialNo || ''}
                />
              );
            default:
              return null;
          }
        })}
      </StyledTableRow>

      <DialogViewApiLogDetails
        open={dialogOpen}
        onClose={handleCloseDialog}
        logDetails={{
          apiType,
          requestMethod,
          requestURL,
          responseStatusCode,
          responseTime,
          customerName: customer?.name || '',
          serialNo: machine?.serialNo || '',
          machineName: machine?.name || '',
          response,
          createdIP,
          createdBy: createdBy?.name || createdByIdentifier|| '',
          createdAt: fDateTime(createdAt),
          updatedAt: fDateTime(updatedAt),
        }}
      />

      <DialogViewAPILogsMachineERPLogsTable
        open={machineLogsDialogOpen}
        onClose={handleCloseMachineLogsDialog}
        apiId={_id}
        logType="ERP"
      />
    </>
  );
}
