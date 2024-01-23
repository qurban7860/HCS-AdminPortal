import PropTypes from 'prop-types';
// import { useEffect, useState } from 'react';
// @mui
import { Switch, TableRow, TableCell } from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
// components
import LinkTableCellWithIconTargetBlank from '../../components/ListTableTools/LinkTableCellWithIconTargetBlank';
import { useScreenSize } from '../../hooks/useResponsive';
import LinkDialogTableCell from '../../components/ListTableTools/LinkDialogTableCell';

// ----------------------------------------------------------------------

MachineListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  openInNewPage: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  handleCustomerDialog:PropTypes.func,
};

export default function MachineListTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  openInNewPage,
  handleCustomerDialog
}) {
  const {
    verifications,
    serialNo,
    name,
    machineModel,
    customer,
    // instalationSite,
    installationDate,
    shippingDate,
    status,
    isActive,
    // createdAt,
  } = row;
 
  return (
    <TableRow hover selected={selected}>
      <LinkTableCellWithIconTargetBlank
        align="left"
        onViewRow={onViewRow}
        onClick={openInNewPage}
        param={serialNo}
        isVerified={verifications?.length > 0}
      />
      
      {  useScreenSize('lg') && <TableCell >{name || ''}</TableCell>}
      {  useScreenSize('sm') && <TableCell >{machineModel?.name || ''}</TableCell>}
      {  useScreenSize('lg') && 
      
      // <TableCell  >{customer?.name || ''}</TableCell>
      <LinkDialogTableCell onClick={handleCustomerDialog} align='center' param={customer?.name}/>  
          
      }
      {/* {  useScreenSize('lg') && <TableCell  >{instalationSite?.name || ''}</TableCell>} */}
      {  useScreenSize('lg') && <TableCell >{fDate(installationDate)}</TableCell>}
      {  useScreenSize('lg') && <TableCell >{fDate(shippingDate)}</TableCell>}
      {  useScreenSize('sm') && <TableCell sx={{color: status?.slug === 'transferred' ? 'red' : 'inherit' }} >{status?.name || ''}</TableCell>}
      <TableCell align="center">  <Switch checked={isActive} disabled size="small"/>  </TableCell>
      {/* <TableCell >{fDate(createdAt)}</TableCell> */}

    </TableRow>
  );
} 