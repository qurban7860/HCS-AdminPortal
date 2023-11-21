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
import { fDate, fDateTime } from '../../../utils/formatTime';
// components
import { setMachineServiceRecordHistoryFormVisibility, getMachineServiceHistoryRecords } from '../../../redux/slices/products/machineServiceRecord';
import { useDispatch, useSelector } from '../../../redux/store';
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import HistoryIcon from '../../components/Icons/HistoryIcon';
// import { useScreenSize } from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

HistoricalConfigurationsTableRow.propTypes = {
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

export default function HistoricalConfigurationsTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {

  const { machine } = useSelector((state) => state.machine);
  const { backupid, isActive, createdAt, createdBy } = row;

  const dispatch = useDispatch();

  const handleServiceRecordHistory = () => {
    dispatch(setMachineServiceRecordHistoryFormVisibility(true));
    dispatch(getMachineServiceHistoryRecords( machine?._id ,row?.serviceId ))
  }
  return (
      <StyledTableRow hover selected={selected}>
        <LinkTableCell align="left" onClick={onViewRow} param={backupid} />
        <TableCell align="center">
          {' '}
          <Switch checked={isActive} disabled size="small" />{' '}
        </TableCell>
        <TableCell align="left">{createdBy.name}</TableCell>
        <TableCell align="right">{fDateTime(createdAt)}</TableCell>
      </StyledTableRow>

  );
}
