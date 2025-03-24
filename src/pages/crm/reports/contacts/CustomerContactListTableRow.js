import React, { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Switch, TableCell } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
// components
import { useScreenSize } from '../../../../hooks/useResponsive';
import { StyledTableRow } from '../../../../theme/styles/default-styles';
import LinkTableCellWithIconTargetBlank from '../../../../components/ListTableTools/LinkTableCellWithIconTargetBlank';
import IconButtonTooltip from '../../../../components/Icons/IconButtonTooltip';
import { ICONS } from '../../../../constants/icons/default-icons';

// ----------------------------------------------------------------------

CustomerContactListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  openInNewPage: PropTypes.func,
  handleContactView: PropTypes.func,
  handleContactViewInNewPage: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  isCustomerContactPage: PropTypes.bool,
  hiddenColumns: PropTypes.object,
};

export default function CustomerContactListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  openInNewPage,
  handleContactView,
  handleContactViewInNewPage,
  isCustomerContactPage,
  hiddenColumns
}) {
  const { _id, customer, firstName, title, lastName, phoneNumbers, email, address, isActive, formerEmployee, updatedAt } = row;
  const contactName = `${firstName || ''} ${lastName || ''}`;
  const [showAllPhones, setShowAllPhones] = useState(false);

  const phone = phoneNumbers ? phoneNumbers.map(({ countryCode, contactNumber }) => countryCode ? `+${countryCode}-${contactNumber}` : contactNumber) : [];

  const handleTogglePhoneDisplay = () => {
    setShowAllPhones((prev) => !prev);
  };

  return (
    <>
      {/* Render rows with column names in bold for small screens */}
      {!useScreenSize('sm') && (
        <StyledTableRow hover selected={selected} style={{ display: 'block' }} >
          {!hiddenColumns?.firstName && !hiddenColumns?.lastName && (
            <LinkTableCellWithIconTargetBlank style={{ width: '100%', display: 'inline-block' }}
              onViewRow={() => handleContactView(customer?._id, _id)}
              onClick={() => handleContactViewInNewPage(customer?._id, _id)}
              param={contactName}
            />
          )}
          {!isCustomerContactPage && customer?.name && <TableCell style={{ width: '100%', display: 'inline-block' }} >{customer?.name || '' } </TableCell> }
          {title && <TableCell style={{ width: '100%', display: 'inline-block' }} >{title}</TableCell> }
          {!hiddenColumns?.phoneNumbers && (
          <TableCell style={{ width: '100%', display: 'inline-block' }}>
            {phone.length > 1 ? (
              <>
                {showAllPhones ? (phone.join(', ')
                ) : (
                  <>
                    {phone[0]}{' '}
                    <IconButtonTooltip onClick={handleTogglePhoneDisplay}
                      title={ ICONS.SEE_MORE.heading } 
                      color={ ICONS.SEE_MORE.color } 
                      icon={ ICONS.SEE_MORE.icon } 
                    />          
                  </>
                )}
              </>
            ) : (
              phone[0]
            )}
          </TableCell> )}
          {email && <TableCell style={{ width: '100%', display: 'inline-block' }} >{email}</TableCell> }
        </StyledTableRow>
      )}

      {useScreenSize('sm') && (
        <StyledTableRow hover selected={selected}>
          {isCustomerContactPage && !hiddenColumns?.isActive && <TableCell align="center" padding='checkbox'>
            <IconButtonTooltip 
              title={ isActive ? ICONS.ACTIVE.heading : ICONS.INACTIVE.heading } 
              color={ isActive ? ICONS.ACTIVE.color : ICONS.INACTIVE.color } 
              icon={ isActive ? ICONS.ACTIVE.icon : ICONS.INACTIVE.icon} 
              sx={{width: 22, height: 22}}
            />
          </TableCell>}
          {isCustomerContactPage && !hiddenColumns?.formerEmployee && <TableCell align="center" padding='checkbox'>
            <IconButtonTooltip
              title={ formerEmployee ? ICONS.FORMEREMPLOYEE.heading : ICONS.NOTFORMEREMPLOYEE.heading }
              color={ formerEmployee ? ICONS.FORMEREMPLOYEE.color : ICONS.NOTFORMEREMPLOYEE.color }
              icon={ formerEmployee ? ICONS.FORMEREMPLOYEE.icon : ICONS.NOTFORMEREMPLOYEE.icon }
              sx={{width: 22, height: 22}}
            />
          </TableCell>}
          
          {!isCustomerContactPage && !hiddenColumns?.isActive && (<TableCell align="center">
            <Switch checked={isActive} disabled size="small" />
          </TableCell>)}
          {!hiddenColumns?.firstName && !hiddenColumns?.lastName && (
            <LinkTableCellWithIconTargetBlank style={{ width: '100%', display: 'inline-block' }}
              onViewRow={() => handleContactView(customer?._id, _id)}
              onClick={() => handleContactViewInNewPage(customer?._id, _id)}
              param={contactName}
            />
          )}
          {isCustomerContactPage &&  !hiddenColumns?.title && (
            <TableCell>{title}</TableCell>
          )}
          {!hiddenColumns?.phoneNumbers && (
          <TableCell>
            {phone.length > 1 ? (
              <>
                {showAllPhones ? (phone.join(', ')
                ) : (
                  <>
                    {phone[0]}{' '}                     
                      <IconButtonTooltip onClick={handleTogglePhoneDisplay}
                        title={ ICONS.SEE_MORE.heading } 
                        color={ ICONS.SEE_MORE.color } 
                        icon={ ICONS.SEE_MORE.icon } 
                      />
                  </>
                )}
              </>
            ) : (
              phone[0]
            )}
          </TableCell> )}
          { !hiddenColumns?.email && (
            <TableCell>{email}</TableCell>
          )}
          { !hiddenColumns?.["address.country"] && (
            <TableCell>{address?.country}</TableCell>
          )}
           {!isCustomerContactPage && !hiddenColumns?.["customer.name"] && (
            <TableCell>{customer?.name}</TableCell>
          )}
          { !hiddenColumns?.updatedAt && (
            <TableCell align="right">{fDate(updatedAt)}</TableCell>
          )}
        </StyledTableRow>
      )}
    </>
  );
}
