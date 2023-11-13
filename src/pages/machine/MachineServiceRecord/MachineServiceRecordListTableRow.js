import PropTypes from 'prop-types';
// import { useState } from 'react';
// @mui
import {
  Switch,
  TableRow,
  TableCell,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
// utils
import { styled } from '@mui/system';
import { fDate } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import { setMachineServiceRecordHistoryFormVisibility, getMachineServiceHistoryRecords } from '../../../redux/slices/products/machineServiceRecord';
import { useDispatch, useSelector } from '../../../redux/store';
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

  const { machine } = useSelector((state) => state.machine);
  const { serviceRecordConfig, versionNo, serviceDate, isActive, createdAt, createdBy } = row;

  const theme = createTheme({
    palette: {
      success: green,
    },
  });
  const dispatch = useDispatch();
  const handleServiceRecordHistory = () => {
    dispatch(setMachineServiceRecordHistoryFormVisibility(true));
    dispatch(getMachineServiceHistoryRecords( machine?._id ,row?.serviceId ))
  }
  return (
      <StyledTableRow hover selected={selected}>
        <LinkTableCell align="left" onClick={onViewRow} param={`${serviceRecordConfig?.docTitle ? serviceRecordConfig?.docTitle	: ''	} ${serviceRecordConfig?.recordType ? ' - ' : ''} ${serviceRecordConfig?.recordType ? serviceRecordConfig?.recordType : ''}`} />
        <TableCell align="left" >{versionNo} 
              {versionNo > 1 &&  <StyledTooltip
                arrow
                title="History"
                placement='top'
                tooltipcolor={theme.palette.primary.main}
              ><Iconify icon="material-symbols:history" sx={{ml:0.7, mb:-0.6, cursor: 'pointer'}} onClick={handleServiceRecordHistory} /></StyledTooltip>}</TableCell>
        <TableCell align="center">{fDate(serviceDate)}</TableCell>
        <TableCell align="center">
          {' '}
          <Switch checked={isActive} disabled size="small" />{' '}
        </TableCell>
        <TableCell align="left">{createdBy.name}</TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
      </StyledTableRow>

  );
}
