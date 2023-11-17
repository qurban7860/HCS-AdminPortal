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
// components
import { setMachineServiceRecordHistoryFormVisibility, getMachineServiceHistoryRecords } from '../../../redux/slices/products/machineServiceRecord';
import { useDispatch, useSelector } from '../../../redux/store';
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import HistoryIcon from '../../components/Icons/HistoryIcon';
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

  const { machine } = useSelector((state) => state.machine);
  const { serviceRecordConfig, versionNo, serviceDate, isActive, createdAt, createdBy } = row;

  const dispatch = useDispatch();

  const handleServiceRecordHistory = () => {
    dispatch(setMachineServiceRecordHistoryFormVisibility(true));
    dispatch(getMachineServiceHistoryRecords( machine?._id ,row?.serviceId ))
  }
  return (
      <StyledTableRow hover selected={selected}>
        <TableCell align="left">{fDate(serviceDate)}</TableCell>
        <LinkTableCell align="left" onClick={onViewRow} param={`${serviceRecordConfig?.docTitle ? serviceRecordConfig?.docTitle	: ''	} ${serviceRecordConfig?.recordType ? ' - ' : ''} ${serviceRecordConfig?.recordType ? serviceRecordConfig?.recordType : ''}`} />
        <TableCell align="left" sx={{display: 'flex', alignItems:'center'}} >{versionNo} 
              {versionNo > 1 && <HistoryIcon callFunction={handleServiceRecordHistory} /> }</TableCell>
        <TableCell align="center">
          {' '}
          <Switch checked={isActive} disabled size="small" />{' '}
        </TableCell>
        <TableCell align="left">{createdBy.name}</TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
      </StyledTableRow>

  );
}
