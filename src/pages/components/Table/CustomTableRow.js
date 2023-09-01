import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { Switch, TableRow, TableCell } from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
// components
import LinkTableCellWithIcon from '../components/ListTableTools/LinkTableCellWithIcon';
import { useScreenSize } from '../../hooks/useResponsive';
// ----------------------------------------------------------------------

CustomTableRow.propTypes = {
  rowElement: PropTypes.string,
  rowElementType:  PropTypes.string,
  screenSize:  PropTypes.string,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function CustomTableRow({
  rowElement,
  rowElementType,
  screenSize,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {

  return (
      <TableRow hover selected={selected}>
      {onViewRow && <LinkTableCellWithIcon
        align="left"
        onClick={onViewRow}
        param={rowElement}
      />}
        {  useScreenSize(screenSize) && <TableCell >{rowElement || ''}</TableCell>}
        {  rowElementType === 'date' && useScreenSize(screenSize) && <TableCell >{fDate(rowElement)}</TableCell>}
        {  rowElementType === 'switch' && useScreenSize(screenSize) && <Switch checked={rowElement} disabled size="small"/>}
    </TableRow>
  );
} 