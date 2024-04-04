import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Switch, TableCell } from '@mui/material';
// components
import { fDate } from '../../../utils/formatTime';
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../hooks/useResponsive';
import { StyledTableRow, StyledBadge } from '../../../theme/styles/default-styles';
import IconButtonTooltip from '../../../components/Icons/IconButtonTooltip';
import { ICONS } from '../../../constants/icons/default-icons';
import useLimitString from '../../../hooks/useLimitString';
import ViewFormCodeMenuPopover from '../../../components/ViewForms/ViewFormCodeMenuPopover';

// ----------------------------------------------------------------------

ParameterListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function ParameterListTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const { name, category, code, isActive, createdAt } = row;

  const smScreen = useScreenSize('sm')

  const [ codeAnchorEl, setCodeAnchorEl ] = useState(null);
  
  const handleCodePopoverOpen = (event) => {
    if(code?.length > 0) {
      setCodeAnchorEl(event.currentTarget);
    }
  };

  const handleCodePopoverClose = () => {
    setCodeAnchorEl(null);
  };
  return (
    <>
      <StyledTableRow hover selected={selected}>

        <LinkTableCell onClick={onViewRow} align="left" stringLength={40} param={name} />
        <TableCell>
          { useLimitString( code[0] , 30 ) }
          { code?.length > 1 &&
          <StyledBadge badgeContent={code?.length || '0' } color="info" sx={{top:-1, left:-1}} >
            <IconButtonTooltip
              title='Code'
              color={ICONS.MACHINESETTINGHISTORY.color}
              icon={ICONS.MACHINESETTINGHISTORY.icon}
              onClick={ handleCodePopoverOpen }
              />
          </StyledBadge>}
        </TableCell >
        { smScreen && <TableCell>{category?.name || ''}</TableCell>}
        <TableCell align="center">
          {' '}
          <Switch checked={isActive} disabled size="small" sx={{ my: -1 }} />{' '}
        </TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
      </StyledTableRow>

      <ViewFormCodeMenuPopover
        open={codeAnchorEl}
        onClose={handleCodePopoverClose}
        ListArr={code}
      />
    </>
  );
}
