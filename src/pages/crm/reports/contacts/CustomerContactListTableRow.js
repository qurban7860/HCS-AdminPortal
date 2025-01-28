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
  hiddenColumns,
}) {
  const { _id, customer, firstName, title, lastName, phoneNumbers, email, address, isActive, formerEmployee, createdAt } = row;
  const contactName = `${firstName || ''} ${lastName || ''}`;
  const [showAllPhones, setShowAllPhones] = useState(false);

  const phone = phoneNumbers ? phoneNumbers.map(({ countryCode, contactNumber }) => countryCode ? `+${countryCode}-${contactNumber}` : contactNumber) : [];

  const handleTogglePhoneDisplay = () => {
    setShowAllPhones((prev) => !prev);
  };

  const isSmallScreen = useScreenSize('sm');
  const isLargeScreen = useScreenSize('lg');

  return (
    <>
      {/* Render rows with column names in bold for small screens */}
      {!isSmallScreen && (
        <StyledTableRow hover selected={selected} style={{ display: 'block' }} >
          <LinkTableCellWithIconTargetBlank style={{ width: '100%', display: 'inline-block' }}
            onViewRow={() => handleContactView(customer?._id, _id)}
            onClick={() => handleContactViewInNewPage(customer?._id, _id)}
            param={contactName}
          />
          {!isCustomerContactPage && customer?.name && <TableCell style={{ width: '100%', display: 'inline-block' }} >{customer?.name || '' } </TableCell> }
          {title && <TableCell style={{ width: '100%', display: 'inline-block' }} >{title}</TableCell> }
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
          </TableCell>
          {email && <TableCell style={{ width: '100%', display: 'inline-block' }} >{email}</TableCell> }
        </StyledTableRow>
      )}

      {isSmallScreen && (
        <StyledTableRow hover selected={selected}>
          {isCustomerContactPage && isLargeScreen && !hiddenColumns?.isActive && (
            <TableCell align="center">
              <IconButtonTooltip 
                title={isActive ? ICONS.ACTIVE.heading : ICONS.INACTIVE.heading} 
                color={isActive ? ICONS.ACTIVE.color : ICONS.INACTIVE.color} 
                icon={isActive ? ICONS.ACTIVE.icon : ICONS.INACTIVE.icon} 
              />
            </TableCell>
          )}
          
          {isCustomerContactPage && isLargeScreen && !hiddenColumns?.formerEmployee && (
            <TableCell align="center">
              <IconButtonTooltip
                title={formerEmployee ? ICONS.FORMEREMPLOYEE.heading : ICONS.NOTFORMEREMPLOYEE.heading}
                color={formerEmployee ? ICONS.FORMEREMPLOYEE.color : ICONS.NOTFORMEREMPLOYEE.color}
                icon={formerEmployee ? ICONS.FORMEREMPLOYEE.icon : ICONS.NOTFORMEREMPLOYEE.icon}
              />
            </TableCell>
          )}

          {!isCustomerContactPage && isLargeScreen && !hiddenColumns?.["customer.name"] && (
            <TableCell>{customer?.name}</TableCell>
          )}

          {isLargeScreen && !hiddenColumns?.firstName && (
            <LinkTableCellWithIconTargetBlank
              onViewRow={() => handleContactView(customer?._id, _id)}
              onClick={() => handleContactViewInNewPage(customer?._id, _id)}
              param={contactName}
            />
          )}

          {isCustomerContactPage && isLargeScreen && !hiddenColumns?.title && (
            <TableCell>{title}</TableCell>
          )}

          {isLargeScreen && !hiddenColumns?.phoneNumbers && (
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
            </TableCell>
          )}

          {isLargeScreen && !hiddenColumns?.email && (
            <TableCell>{email}</TableCell>
          )}

          {isLargeScreen && !hiddenColumns?.["address.country"] && (
            <TableCell>{address?.country}</TableCell>
          )}

          {!isCustomerContactPage && isLargeScreen && !hiddenColumns?.isActive && (
            <TableCell align="center">
              <Switch checked={isActive} disabled size="small" />
            </TableCell>
          )}

          {isLargeScreen && !hiddenColumns?.createdAt && (
            <TableCell align="right">{fDate(createdAt)}</TableCell>
          )}
        </StyledTableRow>
      )}
    </>
  );
}
