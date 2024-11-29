import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { TableRow, TableCell } from '@mui/material';
import { green } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
// utils
import { fDate } from '../../utils/formatTime';
// components
import LinkTableCellWithIconTargetBlank from '../../components/ListTableTools/LinkTableCellWithIconTargetBlank';
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
    verifications,
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
     <LinkTableCellWithIconTargetBlank
        align="left"
        onViewRow={ onViewRow }
        param={serialNo}
        isVerified={verifications?.length > 0}
      />
      {/* { useScreenSize('lg') && !hiddenColumns?.name && <TableCell>{name || ''}</TableCell>} */}
      {  useScreenSize('sm') && !hiddenColumns['machineModel.name'] && <TableCell>{ machineModel?.name || ''}</TableCell>}
      {  useScreenSize('lg') && !hiddenColumns['customer.name'] &&
        <LinkDialogTableCell onClick={handleCustomerDialog} align='center' param={customer?.name}/>  
      }
       {!hiddenColumns.HLCSoftwareVersion && (
        <TableCell align="left">
          {row.techParam?.code.includes('HLCSoftwareVersion') ? row.techParamValue : ''}
        </TableCell>
      )}
      {!hiddenColumns.PLCSoftwareVersion && (
        <TableCell align="left">
          {row.techParam?.code.includes('PLCSoftwareVersion') ? row.techParamValue : ''}
        </TableCell>
      )}
      { !hiddenColumns?.createdAt && <TableCell align="right">{fDate(createdAt)}</TableCell>}
    </TableRow>
  );
} 

