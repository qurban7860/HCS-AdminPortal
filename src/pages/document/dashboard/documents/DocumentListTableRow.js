import PropTypes from 'prop-types';
import { useState } from 'react';
import { sentenceCase } from 'change-case';
// @mui
import {
  Switch,
  Stack,
  Button,
  TableRow,
  Checkbox,
  MenuItem,
  TableCell,
  IconButton,
  Link,
} from '@mui/material';
// utils
import { styled, alpha, useTheme } from '@mui/material/styles';
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
import Label from '../../../../components/label';
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';

import { useSelector } from '../../../../redux/store';

// ----------------------------------------------------------------------

DocumentListTableRow.propTypes = {
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

export default function DocumentListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const {
    displayName,
    docType,
    machine,
    customer,
    docCategory,
    customerAccess,
    isActive,
    createdAt,
  } = row;

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
    <StyledTableRow hover selected={selected}>
      {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}
      {/* <Iconify icon="octicon:package-dependents-16" sx={{ color: 'text.disabled' }} /> */}
      <LinkTableCell align="left" param={displayName} onClick={onViewRow} />
      <TableCell align="left">{customer?.name}</TableCell>
      <TableCell align="left">{machine?.serialNo}</TableCell>
      <TableCell align="left">{docType?.name}</TableCell>
      <TableCell align="left">{docCategory?.name}</TableCell>
      <TableCell align="center">
        <Switch checked={customerAccess} disabled size="small" />{' '}
      </TableCell>
      <TableCell align="center">
        <Switch checked={isActive} disabled size="small" />{' '}
      </TableCell>
      <TableCell align="right">{fDate(createdAt)}</TableCell>
    </StyledTableRow>
  );
}
