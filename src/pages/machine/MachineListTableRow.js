import PropTypes from 'prop-types';
// import { useEffect, useState } from 'react';
// @mui
import { Switch, TableRow, TableCell } from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
// components
import LinkTableCellWithIconTargetBlank from '../../components/ListTableTools/LinkTableCellWithIconTargetBlank';
import { useScreenSize } from '../../hooks/useResponsive';
import LinkDialogTableCell from '../../components/ListTableTools/LinkDialogTableCell';
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
}) {
  // console.log("rowrow : ", row)
  const {
    verifications,
    serialNo,
    name,
    profiles,
    machineModel,
    customer,
    // instalationSite,
    installationDate,
    shippingDate,
    status,
    isActive,
    transferredDate,
    transferredToMachine
    // createdAt,
  } = row;
 
  return (
    <TableRow hover selected={selected}>
      <LinkTableCellWithIconTargetBlank
        align="left"
        onViewRow={ onViewRow }
        onClick={openInNewPage}
        param={serialNo}
        isVerified={verifications?.length > 0}
      />
      
      {  useScreenSize('lg') && <TableCell >{ name || ''}</TableCell>}
      {  useScreenSize('sm') && <TableCell >{ machineModel?.name || ''}</TableCell>}
      {  useScreenSize('lg') && 
      
      <LinkDialogTableCell onClick={handleCustomerDialog} align='center' param={customer?.name}/>  
          
      }
      {  useScreenSize('lg') && <TableCell >{fDate(installationDate)}</TableCell>}
      {  useScreenSize('lg') && <TableCell >{fDate(shippingDate)}</TableCell>}
      {  useScreenSize('sm') && 
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
      {  useScreenSize('lg') && <TableCell >{ Array.isArray(profiles) && profiles.map( el => el?.defaultName)?.join(', ') || ''}</TableCell>}
      <TableCell align="center">  <Switch checked={isActive} disabled size="small"/>  </TableCell>

    </TableRow>
  );
} 