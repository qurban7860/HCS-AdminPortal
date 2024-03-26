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
};

export default function SettingListTableRow({
  row,
  selected,
  onViewRow,
}) {
  const {
    techParam: {
      name,
      category,
    },
    techParamValue,
    history,
    createdAt
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
        <LinkTableCell align="left" param={category?.name||""} onClick={onViewRow} />
        <TableCell align="left">
          {name||""}
        </TableCell>
        <TableCell align="left"  >
            {techParamValue || ""}
            {history !== undefined && history?.length > 1 &&
              <StyledBadge badgeContent={history?.length || '0' } color="info" sx={{top:-2, left:-2}} >
                <IconButtonTooltip
                  title='History'
                  color={ICONS.MACHINESETTINGHISTORY.color}
                  icon={ICONS.MACHINESETTINGHISTORY.icon}
                  onClick={handleMachineSettingHistoryPopoverOpen}
                />
              </StyledBadge>
            }
        </TableCell>
        { smScreen && <TableCell align="right">{fDate(createdAt)}</TableCell>}
      </StyledTableRow>

      <ViewFormMachineSettingHistoryMenuPopover
        open={machineSettingHistoryAnchorEl}
        onClose={handleMachineSettingHistoryPopoverClose}
        ListArr={history}
        ListTitle="Setting History"
      />

    </>
  );
}
