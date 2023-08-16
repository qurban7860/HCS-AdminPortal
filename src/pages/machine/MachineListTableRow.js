import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { Switch, TableRow, TableCell } from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
// components
import LinkTableCellWithIcon from '../components/ListTableTools/LinkTableCellWithIcon';
import { useWidth } from '../../hooks/useResponsive';
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
  
  const width = useWidth();

  return (
    <TableRow hover selected={selected}>
      <LinkTableCellWithIcon
        align="left"
        onClick={onViewRow}
        param={serialNo}
        isVerified={verifications?.length > 0}
      />
      { ( width === 'sm' || width === 'md' || width === 'lg' || width === 'xl' ) && <TableCell >{name || ''}</TableCell>}
      { ( width === 'sm' || width === 'md' || width === 'lg' || width === 'xl' ) && <TableCell >{machineModel?.name || ''}</TableCell>}
      { ( width === 'sm' || width === 'md' || width === 'lg' || width === 'xl' ) && <TableCell sx={{color: status?.slug === 'transferred' ? 'red' : 'inherit' }} >{status?.name || ''}</TableCell>}
      { ( width === 'md' || width === 'lg' || width === 'xl' ) && <TableCell  >{customer?.name || ''}</TableCell>}
      { ( width === 'lg' || width === 'xl' ) && <TableCell  >{instalationSite?.name || ''}</TableCell>}
      <TableCell align="center">  <Switch checked={isActive} disabled size="small"/>  </TableCell>
      <TableCell >{fDate(createdAt)}</TableCell>

    </TableRow>
  );
} 