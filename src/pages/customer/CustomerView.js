import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Tab, Container, Box, tabsClasses } from '@mui/material';
import TabContainer from '../components/Tabs/TabContainer';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import {
  getCustomers,
  getCustomer,
  setCustomerEditFormVisibility,
} from '../../redux/slices/customer/customer';
import {
  setDocumentViewFormVisibility,
  setDocumentHistoryViewFormVisibility,
} from '../../redux/slices/document/document';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import UnderDevelopment from '../boundaries/UnderDevelopment';
// sections
import { Cover } from '../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import CustomerViewForm from './CustomerViewForm';
import CustomerEditForm from './CustomerEditForm';
import CustomerSiteDynamicList from './CustomerSiteDynamicList';
import CustomerContactDynamicList from './CustomerContactDynamicList';

import { CONFIG } from '../../config-global';
import Iconify from '../../components/iconify';
import CustomerNotes from './note/CustomerNotes';
import DocumentTagPage from '../document/documents/DocumentTagPage';
import CustomerMachines from './machine/CustomerMachines';
import LogoAvatar from '../../components/logo-avatar';
import { CustomAvatar } from '../../components/custom-avatar';

// ----------------------------------------------------------------------

/* eslint-disable */
CustomerView.propTypes = {
  editPage: PropTypes.bool,
};
/* eslint-enable */

export default function CustomerView({ editPage }) {
  const { id } = useParams();
  const environment = CONFIG.ENV.toLowerCase();
  const showDevTabs = environment !== 'live';
  const dispatch = useDispatch();
  const { customer, customers, customerEditFormFlag } = useSelector((state) => state.customer);
  const [editFlag, setEditFlag] = useState(false);
  const toggleEditFlag = () => setEditFlag((value) => !value);
  const [currentTab, setCurrentTab] = useState('customer-info');
  const [currentComponent, setCurrentComponent] = useState(<CustomerViewForm />);
  const [customerFlag, setCustomerFlag] = useState(true);

  const TABS = [
    {
      // disabled: siteEditFormVisibility || contactEditFormVisibility || contactMoveFormVisibility || noteEditFormVisibility,
      value: 'customer-info',
      label: 'Customer Info',
      icon: <Iconify icon="mdi:badge-account" />,
      component: currentComponent,
    },
    {
      // disabled: customerEditFormFlag || contactEditFormVisibility || contactMoveFormVisibility || noteEditFormVisibility,
      value: 'sites',
      label: 'Sites',
      icon: <Iconify icon="mdi:map-legend" />,
      component: <CustomerSiteDynamicList />,
    },
    {
      // disabled: customerEditFormFlag || siteEditFormVisibility || noteEditFormVisibility,
      value: 'contacts',
      label: 'Contacts',
      icon: <Iconify icon="mdi:account-multiple" />,
      component: <CustomerContactDynamicList />,
    },
    {
      // disabled: customerEditFormFlag || siteEditFormVisibility || contactEditFormVisibility || contactMoveFormVisibility,
      value: 'notes',
      label: 'Notes',
      icon: <Iconify icon="mdi:note-multiple" />,
      component: <CustomerNotes />,
    },
    {
      // disabled:
      //   customerEditFormFlag || siteEditFormVisibility || contactEditFormVisibility || contactMoveFormVisibility || noteEditFormVisibility,
      value: 'documents',
      label: 'Documents',
      icon: <Iconify icon="mdi:folder-open" />,
      component: <DocumentTagPage customerPage />,
    },
    {
      // disabled:
      //   customerEditFormFlag || siteEditFormVisibility || contactEditFormVisibility || contactMoveFormVisibility || noteEditFormVisibility,
      value: 'customers',
      label: 'Machines',
      icon: <Iconify icon="mdi:greenhouse" />,
      component: <CustomerMachines />,
    },
  ];
  
  useEffect(() => {
    dispatch(setDocumentViewFormVisibility(false));
    dispatch(setDocumentHistoryViewFormVisibility(false));
    if (id !== 'null') {
      dispatch(getCustomer(id));
      dispatch(setCustomerEditFormVisibility(false));
    }
  }, [dispatch, id]);

  useEffect(() => {
    /* eslint-disable */
    if (customerEditFormFlag) {
      setCurrentComponent(<CustomerEditForm />);
    } else {
      setCustomerFlag(false);
      setCurrentComponent(<CustomerViewForm />);
    }
    /* eslint-enable */
  }, [dispatch, customerEditFormFlag, customer]);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={customer ? customer.name : 'New Customer'}
          photoURL={customer.name === 'HOWICK LTD.' ? <LogoAvatar /> : <CustomAvatar />}
          icon="ph:users-light"
        />
        <TabContainer
          tabsClasses={tabsClasses.scrollButtons}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        >
          {TABS.map((tab) => (
            <Tab
              disabled={tab.disabled}
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </TabContainer>
      </StyledCardContainer>
      {TABS.map(
        (tab) =>
          tab.value === currentTab && (
            <Box key={tab.value}> {tab.component ? tab.component : <UnderDevelopment />} </Box>
          )
      )}
    </Container>
  );
}
