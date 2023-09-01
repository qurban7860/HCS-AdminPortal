import PropTypes from 'prop-types';
// import { useEffect, useState } from 'react';
// @mui
import { Switch, TableRow, TableCell } from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
// components
import LinkTableCellWithIcon from '../components/ListTableTools/LinkTableCellWithIcon';
import { useScreenSize } from '../../hooks/useResponsive';
// ----------------------------------------------------------------------

MachineListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function MachineListTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const {
    verifications,
    serialNo,
    name,
    machineModel,
    customer,
    instalationSite,
    status,
    isActive,
    createdAt,
  } = row;
 
  return (
    <TableRow hover selected={selected}>
      <LinkTableCellWithIcon
        align="left"
        onClick={onViewRow}
        param={serialNo}
        isVerified={verifications?.length > 0}
      />
      
      {  useScreenSize('lg') && <TableCell >{name || ''}</TableCell>}
      {  useScreenSize('sm') && <TableCell >{machineModel?.name || ''}</TableCell>}
      {  useScreenSize('sm') && <TableCell sx={{color: status?.slug === 'transferred' ? 'red' : 'inherit' }} >{status?.name || ''}</TableCell>}
      {  useScreenSize('lg') && <TableCell  >{customer?.name || ''}</TableCell>}
      {  useScreenSize('lg') && <TableCell  >{instalationSite?.name || ''}</TableCell>}
      <TableCell align="center">  <Switch checked={isActive} disabled size="small"/>  </TableCell>
      <TableCell >{fDate(createdAt)}</TableCell>

    </TableRow>
  );
} 