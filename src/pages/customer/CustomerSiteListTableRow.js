import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableCell
} from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
// components
import LinkTableCellWithIconTargetBlank from '../../components/ListTableTools/LinkTableCellWithIconTargetBlank';
import { useScreenSize } from '../../hooks/useResponsive';
import { StyledTableRow, StyledTooltip } from '../../theme/styles/default-styles'
import Iconify from '../../components/iconify';
import { TableAddressRow } from '../../components/table';
import useLimitString from '../../hooks/useLimitString';
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
};

export default function CustomerSiteListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  openInNewPage,
  handleSiteView,
  handleSiteViewInNewPage,
}) {
  const { _id, customer, name, email, phoneNumbers, address, lat, long,
    primaryBillingContact, primaryTechnicalContact, isActive, createdAt } = row;
  const phone = phoneNumbers[0];
  const fax = phoneNumbers[0];
  const limitedName = useLimitString(customer?.name, 35);
  return (
    <>
      {useScreenSize('sm') && (
        <StyledTableRow hover selected={selected}>
          <TableCell>{ limitedName || ''}</TableCell>
          <LinkTableCellWithIconTargetBlank
            onViewRow={() => handleSiteView(customer?._id, _id)}
            onClick={() => handleSiteViewInNewPage(customer?._id, _id)}
            param={name || ''}
          />
          <TableAddressRow address={address} lat={lat} long={long} />
          <TableCell>{phone?.countryCode ? `+${phone?.countryCode} ` : ''}{phone?.contactNumber}</TableCell>
          <TableCell>{email}</TableCell>
          <TableCell>{primaryTechnicalContact?.firstName || ''} {primaryTechnicalContact?.lastName || ''}</TableCell>
          <TableCell>{primaryBillingContact?.firstName || ''} {primaryBillingContact?.lastName || ''}</TableCell>
          <TableCell align='center'><Switch checked={isActive} disabled size="small" /></TableCell>
          <TableCell align='right'>{fDate(createdAt)}</TableCell>
        </StyledTableRow>
      )}
  
      {!useScreenSize('sm') && (
        <>
          <StyledTableRow hover selected={selected}  component="div" style={{ display: 'block' }} >
            <LinkTableCellWithIconTargetBlank 
              style={{ width: '100%', display: 'inline-block' }}
              onViewRow={() => handleSiteView(customer?._id, _id)}
              onClick={() => handleSiteViewInNewPage(customer?._id, _id)}
              param={<>{name || ''}</>}
            />
            { customer?.name && <TableCell style={{ width: '100%', display: 'inline-block' }} >{customer?.name}</TableCell>}
            { address && <TableAddressRow address={address} lat={lat} long={long} style={{ width: '100%', display: 'inline-block' }} />}
            { phone?.countryCode && <TableCell style={{ width: '100%', display: 'inline-block' }} >{phone?.countryCode ? `+${phone?.countryCode} ` : ''}{phone?.contactNumber}</TableCell>}
            { email && <TableCell style={{ width: '100%', display: 'inline-block' }} > {email}</TableCell>}
          </StyledTableRow>
        </>
      )}
    </>
  );
  
  
}
