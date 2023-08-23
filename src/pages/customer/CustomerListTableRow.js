import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import {
  Switch,
  TableRow,
  TableCell,
  Chip,
} from '@mui/material';
// utils
import { styled } from '@mui/system';
import { fDate } from '../../utils/formatTime';
// components
import Iconify from '../../components/iconify';
import LinkTableCellWithIcon from '../components/ListTableTools/LinkTableCellWithIcon';
import { useScreenSize } from '../../hooks/useResponsive';

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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'white',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#f4f6f866',
  },
}));


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
  const smScreen = useScreenSize('sm')
  return (
    <StyledTableRow hover selected={selected}>
      <TableCell align="right">
        {type === 'SP' ? (
          <Iconify icon="octicon:star-24" sx={{ color: 'text.disabled', mr: -2 }} width="15px" />
        ) : (
          ''
        )}
      </TableCell>
      <LinkTableCellWithIcon
        align="left"
        onClick={onViewRow}
        param={name}
        isVerified={verifications?.length > 0}
      />
      { smScreen && <TableCell sx={{maxWidth:"400px"}}>
        {tradingName.map((value, index) =>
          typeof value === 'string'
            ? value.trim() !== '' && <Chip key={index} label={value} sx={{ m: 0.2 }} />
            : ''
        )}
      </TableCell>}
      { smScreen && <TableCell>
        {Object.values(address ?? {})
          .map((value) => (typeof value === 'string' ? value.trim() : ''))
          .filter((value) => value !== '')
          .join(', ')}
      </TableCell>}
      <TableCell align="center">
        {' '}
        <Switch checked={isActive} disabled size="small" />{' '}
      </TableCell>
      <TableCell>{fDate(createdAt)}</TableCell>
    </StyledTableRow>
  );
}
