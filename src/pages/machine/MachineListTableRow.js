import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Switch, TableRow, TableCell, Grid } from '@mui/material';
import { green } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
// utils
import { fDate } from '../../utils/formatTime';
// components
import LinkTableCellWithIconTargetBlank from '../../components/ListTableTools/LinkTableCellWithIconTargetBlank';
import LinkDialogTableCell from '../../components/ListTableTools/LinkDialogTableCell';
import ChipInPopover from '../../components/ViewForms/ChipInPopover';
import { StyledTooltip } from '../../theme/styles/default-styles';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

MachineListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  openInNewPage: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  handleCustomerDialog:PropTypes.func,
  isArchived: PropTypes.bool,
  hiddenColumns: PropTypes.object,
};

export default function MachineListTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  openInNewPage,
  handleCustomerDialog,
  isArchived,
  hiddenColumns
}) {
  
  const [ manufactureProfilesAnchorEl, setManufactureProfilesAnchorEl] = useState(null);
  const [ manufactureProfiles, setManufactureProfiles] = useState([]);

  const {
    verifications,
    serialNo,
    name,
    profiles,
    machineModel,
    customer,
    installationDate,
    shippingDate,
    manufactureDate,
    status,
    isActive,
    transferredDate,
    transferredToMachine
    // createdAt,
  } = row;
 
  const handleManufacturePopoverOpen = (event) => {
    setManufactureProfilesAnchorEl(event.currentTarget);
    setManufactureProfiles(profiles)
  };

  const handleManufacturePopoverClose = () => {
    setManufactureProfilesAnchorEl(null);
    setManufactureProfiles([])
  };

  const theme = createTheme({
    palette: {
      success: green,
    },
  });

  return (
    <>
    <TableRow hover selected={selected}>
      <LinkTableCellWithIconTargetBlank
        align="left"
        onViewRow={ onViewRow }
        onClick={openInNewPage}
        param={serialNo}
        isVerified={verifications?.length > 0}
      />
      {!hiddenColumns?.name && <TableCell>{name || ''}</TableCell>}
      {!hiddenColumns['machineModel.name'] && <TableCell>{ machineModel?.name || ''}</TableCell>}

      {!hiddenColumns['customer.name'] &&
        <LinkDialogTableCell onClick={handleCustomerDialog} align='center' param={customer?.name}/>  
      }
      {!hiddenColumns?.installationDate && <TableCell >{fDate(installationDate)}</TableCell>}

      {!hiddenColumns?.shippingDate && <TableCell >{fDate(shippingDate)}</TableCell>}
      {!hiddenColumns?.manufactureDate && <TableCell >{fDate(manufactureDate)}</TableCell>}

      {!hiddenColumns?.status &&
        <TableCell>
          <span style={{color:row?.status?.slug==='transferred'?'red':''}}>{status?.name || ''} </span>
          {row?.status?.slug ==='transferred' &&

            <StyledTooltip
              title={`${status?.name || ''}${transferredToMachine?.customer?.name?` to ${transferredToMachine?.customer?.name}`:''} on ${fDate(transferredDate)}`}
              placement="top"
              disableFocusListener
              tooltipcolor="#008000" 
              color="#008000"
              sx={{maxWidth:'200px'}}
              >
              <Iconify icon="mdi:info" sx={{position:'relative', bottom:'-5px'}} />
            </StyledTooltip>
          }
        </TableCell>
      }
      {!hiddenColumns?.profiles && <TableCell >{ Array.isArray(profiles) && profiles?.length > 0 && profiles?.length === 1 ? profiles[0]?.defaultName :
      (profiles?.length > 1 && <Grid sx={{ display: "flex", alignItems: "center", alignContent:"center" }} >
          {`${profiles[0]?.defaultName}, ` }

          <StyledTooltip title="Profiles" placement="top" disableFocusListener tooltipcolor={theme.palette.primary.main}  color="primary.main" >
              <Iconify icon="mingcute:profile-line" onClick={handleManufacturePopoverOpen} sx={{mr: 0.5}} /> 
          </StyledTooltip>
      </Grid>)
      || ''}</TableCell>}
      {!hiddenColumns?.isActive &&
        <TableCell align="center">  <Switch checked={isActive} disabled size="small"/>  </TableCell>
      }

    </TableRow>
    <ChipInPopover         
      open={manufactureProfilesAnchorEl}
      onClose={handleManufacturePopoverClose}
      ListArr={manufactureProfiles || [] }
      ListTitle= "Manufacture Profiles" 
    /> 
    </>
  );
} 