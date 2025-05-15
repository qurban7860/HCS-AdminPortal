import { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Tab, tabsClasses } from '@mui/material';
import TabContainer from '../../../../components/Tabs/TabContainer';
// redux
import { useSelector, useDispatch } from '../../../../redux/store';
import { getCustomer } from '../../../../redux/slices/customer/customer';
// sections
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import TABS from '../index';
import { PATH_CRM } from '../../../../routes/paths';
import TabButtonTooltip from '../../../../components/Tabs/TabButtonTooltip';

// ----------------------------------------------------------------------

CustomerTabContainer.propTypes = {
  currentTabValue: PropTypes.string,
};

export default function CustomerTabContainer({ currentTabValue }) {
  const dispatch = useDispatch();
  const { customerId } = useParams();
  const { customer } = useSelector((state) => state.customer);

  useLayoutEffect(() => {
    dispatch(getCustomer(customerId))
  }, [dispatch, customer?._id, customerId])

  const navigate = useNavigate();
  const navigatePage = (tab) => {
    if (tab === 'customer' && customerId) {
      navigate(PATH_CRM.customers.view(customerId))
    } else if (tab === 'sites' && customerId) {
      navigate(PATH_CRM.customers.sites.root(customerId))
    } else if (tab === 'contacts' && customerId) {
      navigate(PATH_CRM.customers.contacts.root(customerId))
    } else if (tab === 'notes' && customerId) {
      navigate(PATH_CRM.customers.notes.root(customerId))
    } else if (tab === 'documents' && customerId) {
      navigate(PATH_CRM.customers.documents.root(customerId))
    } else if (tab === 'machines' && customerId) {
      navigate(PATH_CRM.customers.machines.root(customerId))
    } else if (tab === 'jira' && customerId) {
      navigate(PATH_CRM.customers.jira.root(customerId))
    }
     else if (tab === 'modulesAccess' && customerId) {
      navigate(PATH_CRM.customers.modulesAccess.root(customerId))
    }
  }


  return (
    <StyledCardContainer>
      <Cover name={customer ? customer.name : 'New Customer'} avatar isArchived={customer?.isArchived} />
      <TabContainer
        tabsClasses={tabsClasses.scrollButtons}
        currentTab={currentTabValue}
        setCurrentTab={(tab) => navigatePage(tab)}
      >
        {TABS.map((tab) =>
          (!customer?.isArchived || tab.value !== "machines") ? (
            <Tab
              disabled={tab.disabled}
              key={tab.value}
              value={tab.value}
              label={tab?.value === currentTabValue ? tab.label : ""}
              icon={<TabButtonTooltip value={tab.value} selected={tab?.value === currentTabValue} title={tab.label} icon={tab.icon} />}
            />
          ) : null)}
      </TabContainer>
    </StyledCardContainer>
  );
}
