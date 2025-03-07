import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { TableCell } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../hooks/useResponsive';
import { StyledTableRow, StyledBadge } from '../../../theme/styles/default-styles';
import ViewFormMachineSettingHistoryMenuPopover from '../../../components/ViewForms/ViewFormMachineSettingHistoryMenuPopover';
import IconButtonTooltip from '../../../components/Icons/IconButtonTooltip';
import { ICONS } from '../../../constants/icons/default-icons';

// ----------------------------------------------------------------------

SettingListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  handleDialog: PropTypes.func
};

export default function SettingListTableRow({
  row,
  selected,
  onViewRow,
  handleDialog,
}) {
  const {
    techParam: {
      name,
      category,
    },
    techParamValue,
    history,
    updatedAt
  } = row;

  const smScreen = useScreenSize('sm')
  const [ machineSettingHistoryAnchorEl, setMachineSettingHistoryAnchorEl ] = useState(null);
  
  const handleMachineSettingHistoryPopoverOpen = (event) => {
    if(history?.length > 0) {
      setMachineSettingHistoryAnchorEl(event.currentTarget);
    }
  };

  const handleMachineSettingHistoryPopoverClose = () => {
    setMachineSettingHistoryAnchorEl(null);
  };

  return (
    <>
      <StyledTableRow hover selected={selected}>
        <TableCell align="left">
          {category?.name||""}
        </TableCell>
        <LinkTableCell align="left" param={name||""} onClick={onViewRow} />
        <TableCell align="left"  >
          {techParamValue || ""}
        </TableCell>

          { smScreen && <TableCell align="left">{fDate(updatedAt)}</TableCell>}
        <TableCell align="left" padding="checkbox" >
          {history !== undefined && history?.length > 1 &&
              <StyledBadge badgeContent={history?.length || '0' } color="info" sx={{top: 2, right: 12}} >
                <IconButtonTooltip
                  title='History'
                  color={ICONS.MACHINESETTINGHISTORY.color}
                  icon={ICONS.MACHINESETTINGHISTORY.icon}
                  onClick={handleMachineSettingHistoryPopoverOpen}
                />
              </StyledBadge>
          }
        </TableCell>
        
        <TableCell align="left" padding="checkbox" >
          <StyledBadge sx={{right: 12}}>
          <IconButtonTooltip
            title={ ICONS.MACHINESETTINGEDIT.heading }
            color={ ICONS.MACHINESETTINGEDIT.color }
            icon={ ICONS.MACHINESETTINGEDIT.icon }
            onClick={ handleDialog }
          />
          </StyledBadge>
        </TableCell>

      </StyledTableRow>

      <ViewFormMachineSettingHistoryMenuPopover
        open={machineSettingHistoryAnchorEl}
        onClose={handleMachineSettingHistoryPopoverClose}
        ListArr={history}
        ListTitle="History"
      />
    </>
  );
}
