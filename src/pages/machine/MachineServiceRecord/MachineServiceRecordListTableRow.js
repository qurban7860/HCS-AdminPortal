import PropTypes from 'prop-types';
// import { useState } from 'react';
// @mui
import {
  Switch,
  TableRow,
  TableCell,
} from '@mui/material';
// utils
import { styled } from '@mui/system';
import { fDate } from '../../../utils/formatTime';
// import { fCurrency } from '../../../utils/formatNumber';
// components
// import Iconify from '../../../components/iconify';
// import MenuPopover from '../../../components/menu-popover';
// import ConfirmDialog from '../../../components/confirm-dialog';
// import Label from '../../../components/label';

// import { useSelector } from '../../../redux/store';
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
// import { useScreenSize } from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

MachineServiceRecordListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'white',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#f4f6f866',
  },
}));

export default function MachineServiceRecordListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {

  const { serviceRecordConfig, technician, versionNo, serviceDate, isActive, createdAt } = row;

  return (
      <StyledTableRow hover selected={selected}>
        <LinkTableCell align="left" onClick={onViewRow} param={`${serviceRecordConfig?.docTitle ? serviceRecordConfig?.docTitle	: ''	} ${serviceRecordConfig?.recordType ? ' - ' : ''} ${serviceRecordConfig?.recordType ? serviceRecordConfig?.recordType : ''}`} />
        <TableCell align="left">{`${technician?.name ? technician?.name : ''}`}</TableCell>
        <TableCell align="center">{versionNo}</TableCell>
        <TableCell align="center">{fDate(serviceDate)}</TableCell>
        <TableCell align="center">
          {' '}
          <Switch checked={isActive} disabled size="small" />{' '}
        </TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
      </StyledTableRow>

  );
}
