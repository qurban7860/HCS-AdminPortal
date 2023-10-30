import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Switch,
  Stack,
  Button,
  TableRow,
  MenuItem,
  TableCell,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import MenuPopover from '../../components/menu-popover';
import ConfirmDialog from '../../components/confirm-dialog';
import { fDateTime } from '../../utils/formatTime';
import CustomAvatar from '../../components/custom-avatar/CustomAvatar';
import LinkTableCell from '../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../hooks/useResponsive';

// ----------------------------------------------------------------------

ConfigListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
};

export default function ConfigListTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
}) {
  const { name, value, createdAt, updatedBy, updatedAt, isActive } = row;
  const smScreen = useScreenSize('sm')
  return (
      <TableRow hover selected={selected}>
        <Stack direction="row" alignItems="center">
          <CustomAvatar
            name={name}
            alt={name}
            sx={{ ml: 1, my: 0.5, width: '30px', height: '30px' }}
          />
          <LinkTableCell align="left" onClick={onViewRow} param={name} />
        </Stack>
        { smScreen && <TableCell align="left" sx={{ textTransform: 'capitalize' }}>{value}</TableCell>}
        <TableCell align="center"><Switch checked={isActive} disabled size="small" /></TableCell>
        <TableCell align="right">{updatedBy?.name}</TableCell>
        <TableCell align="right" sx={{ textTransform: 'capitalize' }}>{fDateTime(updatedAt)}</TableCell>
      </TableRow>
  );
}
