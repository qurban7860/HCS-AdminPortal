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
import { StyledTableRow } from '../../../../theme/styles/default-styles';
import { TableAddressRow } from '../../../../components/table';
import useLimitString from '../../../../hooks/useLimitString';
import { useScreenSize } from '../../../../hooks/useResponsive';
import ViewFormEditDeleteButtons from '../../../../components/ViewForms/ViewFormEditDeleteButtons';
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
  hiddenColumns
}) {
  const { _id, customer, name, email, phoneNumbers, address, lat, long,
    primaryBillingContact, primaryTechnicalContact, isActive, isArchived, updatedAt } = row;
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
        {!hiddenColumns?.createdAt && (
          <TableCell align='right' sx={{ whiteSpace: 'nowrap' }}>{fDate(updatedAt)}</TableCell>
        )}
        {isArchived && (
          <TableCell>
            <ViewFormEditDeleteButtons
              onDelete={() => onDeleteRow(row)}
              onRestore={() => onRestoreRow(row)}
            />
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
