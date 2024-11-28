import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { TableRow, TableCell } from '@mui/material';
import { green } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
// utils
import { fDate } from '../../utils/formatTime';
// components
import { useScreenSize } from '../../hooks/useResponsive';
import LinkDialogTableCell from '../../components/ListTableTools/LinkDialogTableCell';

// ----------------------------------------------------------------------

MachineSettingReportListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  openInNewPage: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  handleCustomerDialog:PropTypes.func,
  isArchived: PropTypes.bool,
  hiddenColumns: PropTypes.object,
};

export default function MachineSettingReportListTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  openInNewPage,
  handleCustomerDialog,
  isArchived,
  hiddenColumns
}) {

  const {
    serialNo,
    machineModel,
    customer,
    createdAt,
  } = row;

  const theme = createTheme({
    palette: {
      success: green,
    },
  });

  return (
    <TableRow hover selected={selected}>
      <TableCell>{serialNo || ''}</TableCell>
      {/* { useScreenSize('lg') && !hiddenColumns?.name && <TableCell>{name || ''}</TableCell>} */}
      {  useScreenSize('sm') && !hiddenColumns['machineModel.name'] && <TableCell>{ machineModel?.name || ''}</TableCell>}
      {  useScreenSize('lg') && !hiddenColumns['customer.name'] &&
        <LinkDialogTableCell onClick={handleCustomerDialog} align='center' param={customer?.name}/>  
      }
      { !hiddenColumns?.createdAt && <TableCell align="right">{fDate(createdAt)}</TableCell>}
    </TableRow>
  );
} 

