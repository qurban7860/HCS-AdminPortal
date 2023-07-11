import PropTypes from 'prop-types';
import { useState } from 'react';
import { sentenceCase } from 'change-case';
// @mui
import { Switch, TableRow, TableCell } from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
// components
import Iconify from '../../components/iconify';
import LinkTableCellWithIcon from '../components/ListTableTools/LinkTableCellWithIcon';
import { StyledTableRow } from '../../theme/styles/default-styles';

// ----------------------------------------------------------------------

CustomerListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function CustomerListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const { name, tradingName, mainSite, isActive, type, createdAt, verifications } = row;
  const address = [];
  if (mainSite?.address?.city) {
    address.push(mainSite?.address?.city);
  }
  if (mainSite?.address?.country) {
    address.push(mainSite?.address?.country);
  }
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const userId = localStorage.getItem('userId');

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
    <StyledTableRow hover selected={selected}>
      <TableCell align="right">
        {type === 'SP' && (
          <Iconify icon="octicon:star-24" sx={{ color: 'text.disabled', mr: -2 }} width="15px" />
        )}
      </TableCell>
      <LinkTableCellWithIcon
        align="left"
        onClick={onViewRow}
        param={name}
        isVerified={verifications?.length > 0}
      />
      <TableCell>{tradingName}</TableCell>
      <TableCell>
        {Object.values(address ?? {})
          .map((value) => (typeof value === 'string' ? value.trim() : ''))
          .filter((value) => value !== '')
          .join(', ')}
      </TableCell>
      <TableCell align="center">
        <Switch checked={isActive} disabled size="small" />{' '}
      </TableCell>
      <TableCell>{fDate(createdAt)}</TableCell>
    </StyledTableRow>
  );
}
