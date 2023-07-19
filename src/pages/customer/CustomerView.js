import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Tab, Card, Tabs, Container, Box, tabsClasses } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getCustomer, setCustomerEditFormVisibility } from '../../redux/slices/customer/customer';
import {
  setDocumentViewFormVisibility,
  setDocumentHistoryViewFormVisibility,
} from '../../redux/slices/document/document';

import { getSites } from '../../redux/slices/customer/site';
import { getActiveContacts } from '../../redux/slices/customer/contact';
// components
import Iconify from '../../components/iconify';
// sections
import { Cover } from '../components/Defaults/Cover';

import CustomerNoteList from './CustomerNoteList';
import CustomerViewForm from './CustomerViewForm';
import useResponsive from '../../hooks/useResponsive';
import UnderDevelopment from '../boundaries/UnderDevelopment';
import CustomerEditForm from './CustomerEditForm';
// import CustomerSiteList from './CustomerSiteList';
import CustomerSiteDynamicList from './CustomerSiteDynamicList';
// import CustomerContactList from './CustomerContactList';
import CustomerContactDynamicList from './CustomerContactDynamicList';
import CustomerMachineList from './CustomerMachineList';
import DocumentTagPage from '../document/documents/DocumentTagPage';
import LogoAvatar from '../../components/logo-avatar/LogoAvatar';
import CustomAvatar from '../../components/custom-avatar/CustomAvatar';
import { StyledCardContainer } from '../../theme/styles/default-styles';

CustomerView.propTypes = {
  editPage: PropTypes.bool,
};

export default function CustomerView({ editPage }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { customer, customerEditFormFlag } = useSelector((state) => state.customer);
  const { site, siteEditFormVisibility } = useSelector((state) => state.site);
  const { contactEditFormVisibility } = useSelector((state) => state.contact);
  const { noteEditFormVisibility } = useSelector((state) => state.note);
  const [currentTab, setCurrentTab] = useState('customer-info');
  const [editFlag, setEditFlag] = useState(false);
  const toggleEditFlag = () => setEditFlag((value) => !value);
  const [currentComponent, setCurrentComponent] = useState(<CustomerViewForm />);
  const [customerFlag, setCustomerFlag] = useState(true);
  const isMobile = useResponsive('down', 'sm');

  useEffect(() => {
    dispatch(setDocumentViewFormVisibility(false));
    dispatch(setDocumentHistoryViewFormVisibility(false));

    if (id !== 'null') {
      dispatch(getCustomer(id));
      dispatch(getSites(id));
      dispatch(getActiveContacts(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (customerEditFormFlag) {
      setCurrentComponent(<CustomerEditForm />);
    } else {
      setCustomerFlag(false);
      setCurrentComponent(<CustomerViewForm />);
    }
  }, [dispatch, customerEditFormFlag, customer, id]);

  const TABS = [
    {
      disabled: siteEditFormVisibility || contactEditFormVisibility || noteEditFormVisibility,
      value: 'customer-info',
      label: 'Customer Info',
      icon: <Iconify icon="mdi:badge-account" />,
      component: currentComponent,
    },
    {
      disabled: customerEditFormFlag || contactEditFormVisibility || noteEditFormVisibility,
      value: 'sites',
      label: 'Sites',
      icon: <Iconify icon="mdi:map-legend" />,
      component: <CustomerSiteDynamicList />,
    },
    {
      disabled: customerEditFormFlag || siteEditFormVisibility || noteEditFormVisibility,
      value: 'contacts',
      label: 'Contacts',
      icon: <Iconify icon="mdi:account-multiple" />,
      component: <CustomerContactDynamicList />,
    },
    {
      disabled: customerEditFormFlag || siteEditFormVisibility || contactEditFormVisibility,
      value: 'notes',
      label: 'Notes',
      icon: <Iconify icon="mdi:note-multiple" />,
      component: <CustomerNoteList />,
    },
    {
      disabled:
        customerEditFormFlag ||
        siteEditFormVisibility ||
        contactEditFormVisibility ||
        noteEditFormVisibility,
      value: 'documents',
      label: 'Documents',
      icon: <Iconify icon="mdi:folder-open" />,
      component: <DocumentTagPage customerPage />,
    },
    {
      disabled:
        customerEditFormFlag ||
        siteEditFormVisibility ||
        contactEditFormVisibility ||
        noteEditFormVisibility,
      value: 'machines',
      label: 'Machines',
      icon: <Iconify icon="mdi:greenhouse" />,
      component: <CustomerMachineList />,
    },
  ];

  return (
    <Container maxWidth={false}>
      <Card
        sx={{
          mb: 3,
          height: 160,
          position: 'relative',
        }}
      >
        <Cover
          handleBackLinks={() => {
            dispatch(setDocumentViewFormVisibility(false));
            dispatch(setDocumentHistoryViewFormVisibility(false));
          }}
          name={customer ? customer.name : 'New Customer'}
          photoURL={customer.name === 'HOWICK LTD.' ? <LogoAvatar /> : <CustomAvatar />}
          icon="ph:users-light"
        />
        <Tabs
          value={currentTab}
          onChange={(event, newValue) => {
            setCurrentTab(newValue);
          }}
          variant="scrollable"
          aria-label="visible arrows tabs example"
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              '&.Mui-disabled': { opacity: 0.3 },
            },
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            '& .MuiTabs-flexContainer': {
              pr: { md: 3 },
              justifyContent: {
                md: 'flex-end',
              },
            },
          }}
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
        </Tabs>
      </Card>
      {TABS.map(
        (tab) =>
          tab.value === currentTab && (
            <Box key={tab.value} height="100vh">
              {tab.component ? tab.component : <UnderDevelopment />}
            </Box>
          )
      )}
    </Container>
  );
}
