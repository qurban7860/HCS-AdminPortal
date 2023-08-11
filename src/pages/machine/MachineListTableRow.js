import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { sentenceCase } from 'change-case';
// @mui
import { Switch, TableRow, TableCell } from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
// components
import LinkTableCellWithIcon from '../components/ListTableTools/LinkTableCellWithIcon';

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
    parentMachine,
    machineModel,
    customer,
    instalationSite,
    status,
    isActive,
    createdAt,
  } = row;

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const userId = localStorage.getItem('userId');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <TableRow hover selected={selected}>
      <LinkTableCellWithIcon
        align="left"
        onClick={onViewRow}
        param={serialNo}
        isVerified={verifications?.length > 0}
      />

      {windowWidth > 600 && <TableCell >{name || ''}</TableCell>}
      {windowWidth > 600 && <TableCell >{machineModel?.name || ''}</TableCell>}
      {windowWidth > 600 && <TableCell sx={{color: status?.slug === 'transferred' ? 'red' : 'inherit' }} >{status?.name || ''}</TableCell>}
      {windowWidth > 900 && <TableCell  >{customer?.name || ''}</TableCell>}
      {windowWidth > 1200 && <TableCell  >{instalationSite?.name || ''}</TableCell>}
      <TableCell align="center">  <Switch checked={isActive} disabled size="small"/>  </TableCell>
      <TableCell >{fDate(createdAt)}</TableCell>

    </TableRow>
  );
} 