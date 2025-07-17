import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableCell
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
// components
import LinkTableCellWithIconTargetBlank from '../../../../components/ListTableTools/LinkTableCellWithIconTargetBlank';
import { StyledTableRow, StyledTooltip } from '../../../../theme/styles/default-styles';
import { TableAddressRow } from '../../../../components/table';
import useLimitString from '../../../../hooks/useLimitString';
import { useScreenSize } from '../../../../hooks/useResponsive';
import Iconify from '../../../../components/iconify';
// ----------------------------------------------------------------------

CustomerSiteListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  openInNewPage:PropTypes.func,
  handleSiteView: PropTypes.func,
  handleSiteViewInNewPage: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onRestoreRow: PropTypes.func,
  isCustomerSitePage: PropTypes.bool,
  hiddenColumns: PropTypes.object,
  isArchived: PropTypes.bool
};

export default function CustomerSiteListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onEditRow,
  onViewRow,
  onRestoreRow,
  onDeleteRow,
  openInNewPage,
  handleSiteView,
  handleSiteViewInNewPage,
  isCustomerSitePage,
  hiddenColumns,
  isArchived
}) {
  const { _id, customer, name, email, phoneNumbers, address, lat, long,
    primaryBillingContact, primaryTechnicalContact, isActive, updatedAt } = row;
  const phone = phoneNumbers[0];
  const limitedName = useLimitString(customer?.name, 35);
  const isSmallScreen = useScreenSize('sm');

  return (
    <>
      <StyledTableRow hover selected={selected}>
        {!hiddenColumns?.isActive && (<TableCell align="center">
          <Switch checked={isActive} disabled size="small" />
        </TableCell>)}
        {!hiddenColumns?.name && (
          <>
            {!isArchived ? (
              <LinkTableCellWithIconTargetBlank
                onViewRow={() => handleSiteView(customer?._id, _id)}
                onClick={() => handleSiteViewInNewPage(customer?._id, _id)}
                param={name || ''}
              />
            ) : (
              <TableCell>{name}</TableCell>
            )}
          </>
        )}
        {!hiddenColumns?.["address.country"] && (
          <TableAddressRow address={address} lat={lat} long={long} />
        )}
        {!hiddenColumns?.phoneNumbers && (
          <TableCell>{phone?.countryCode ? `+${phone?.countryCode} ` : ''}{phone?.contactNumber}</TableCell>
        )}
        {!hiddenColumns?.email && (
          <TableCell>{email}</TableCell>
        )}
        {!hiddenColumns?.["primaryTechnicalContact.firstName"] && (
          <TableCell>{primaryTechnicalContact?.firstName || ''} {primaryTechnicalContact?.lastName || ''}</TableCell>
        )}
        {!hiddenColumns?.["primaryBillingContact.firstName"] && (
          <TableCell>{primaryBillingContact?.firstName || ''} {primaryBillingContact?.lastName || ''}</TableCell>
        )}
        {!isCustomerSitePage && !hiddenColumns?.["customer.name"] && (
          <TableCell>{limitedName || ''}</TableCell>
        )}
        {!hiddenColumns?.updatedAt && (
          <TableCell align='right' sx={{ whiteSpace: 'nowrap' }}>{fDate(updatedAt)}</TableCell>
        )}
        { isArchived && !hiddenColumns?.isArchived && (
          <TableCell sx={{width:'100px'}} align='right'>
            <StyledTooltip onClick={() => onRestoreRow(row)} title='Restore Contact' placement="top" tooltipcolor='green'>
              <Iconify icon='mdi:restore' color='green' width="1.7em" sx={{ mb: -0.5, mr: 1, cursor:"pointer"}}/>
            </StyledTooltip>
            <StyledTooltip onClick={() => onDeleteRow(row)} title='Delete Contact' placement="top" tooltipcolor='red'>
              <Iconify icon='solar:trash-bin-trash-outline' color='red' width="1.7em" sx={{ mb: -0.5, mr: 0.5, cursor:"pointer"}}/>
            </StyledTooltip>
          </TableCell>
        )}
      </StyledTableRow>
  
      {!isSmallScreen && (
          <StyledTableRow hover selected={selected} style={{ display: 'block' }} >
            {!isArchived ? (
            <LinkTableCellWithIconTargetBlank 
              style={{ width: '100%', display: 'inline-block' }}
              onViewRow={() => handleSiteView(customer?._id, _id)}
              onClick={() => handleSiteViewInNewPage(customer?._id, _id)}
              param={name || ''}
            />
            ) : (
              <TableCell>{name}</TableCell>
            )}
            { customer?.name && <TableCell style={{ width: '100%', display: 'inline-block' }} >{customer?.name}</TableCell>}
            { address && <TableAddressRow address={address} lat={lat} long={long} style={{ width: '100%', display: 'inline-block' }} />}
            { phone?.countryCode && <TableCell style={{ width: '100%', display: 'inline-block' }} >{phone?.countryCode ? `+${phone?.countryCode} ` : ''}{phone?.contactNumber}</TableCell>}
            { email && <TableCell style={{ width: '100%', display: 'inline-block' }} > {email}</TableCell>}
          </StyledTableRow>
      )}
    </>
  );
  
  
}
