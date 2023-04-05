import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

// @mui
import { Tab, Card, Tabs, Container, Box, Button, Grid, Stack, tabsClasses } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getCustomers, getCustomer, setCustomerEditFormVisibility } from '../../redux/slices/customer/customer';
import { getSites } from '../../redux/slices/customer/site';
import { getContacts } from '../../redux/slices/customer/contact';

// auth
import { useAuthContext } from '../../auth/useAuthContext';
// mock
import {
  _userAbout,
  _userFeeds,
  _userFriends,
  _userGallery,
  _userFollowers,
} from '../../_mock/arrays';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import { Cover } from '../components/Cover';

import CustomerAddForm from './CustomerAddForm'
import SiteAddForm from './site/SiteAddForm';
import SiteList from './site/SiteList';
import ContactAddForm from './contact/ContactAddForm';
import CustomerStepper from './CustomerStepper';
import CustomerNoteList from './CustomerNoteList';


import CustomerViewForm from './CustomerViewForm';


import CustomerEditForm from './CustomerEditForm';
import CustomerSiteList from './CustomerSiteList';
import CustomerContactList from './CustomerContactList';


CustomerViewPage.propTypes = {
  editPage: PropTypes.bool,
};



export default function CustomerViewPage({editPage}) {

  const { id } = useParams(); 

  const dispatch = useDispatch();

  const { customer, customerEditFormFlag } = useSelector((state) => state.customer);

  const { site, siteEditFormVisibility } = useSelector((state) => state.site);

  const { contactEditFormVisibility } = useSelector((state) => state.contact);
  const { noteEditFormVisibility} = useSelector((state) => state.note);
  const [currentTab, setCurrentTab] = useState('customer-info');

  const [editFlag, setEditFlag] = useState(false);
  const toggleEditFlag = () => setEditFlag(value => !value);

  const [currentComponent, setCurrentComponent] = useState(<CustomerViewForm/>);

  const [customerFlag, setCustomerFlag] = useState(true);

  useEffect(() => {
    if(id !== 'null'){
      dispatch(getCustomer(id));
      dispatch(getSites(id));
      dispatch(getContacts(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    
    if(customerEditFormFlag){
      setCurrentComponent(<CustomerEditForm/>);
    }else{
      setCustomerFlag(false);
      setCurrentComponent(<CustomerViewForm/>);        
    }
   
  }, [dispatch, customerEditFormFlag, customer]);


  const TABS = [
    {
      disabled: siteEditFormVisibility || contactEditFormVisibility || noteEditFormVisibility,
      value: 'customer-info',
      label: 'Customer Info',
      icon: <Iconify icon="ic:round-account-box" />,
      component: currentComponent
    },
    {
      disabled: customerEditFormFlag || contactEditFormVisibility || noteEditFormVisibility,
      value: 'sites',
      label: 'Sites',
      icon: <Iconify icon="eva:navigation-2-outline" />,
      component: <CustomerSiteList/>,
    },
    {
      disabled: customerEditFormFlag || siteEditFormVisibility || noteEditFormVisibility,
      value: 'contacts',
      label: 'Contacts',
      icon: <Iconify icon="eva:people-outline" />,
      component: <CustomerContactList/>,
    },
    {
      disabled: customerEditFormFlag || siteEditFormVisibility || contactEditFormVisibility,
      value: 'notes',
      label: 'Notes',
      icon: <Iconify icon="eva:archive-outline" />,
      component: <CustomerNoteList/>
    },
    {
      disabled: customerEditFormFlag || siteEditFormVisibility || contactEditFormVisibility || noteEditFormVisibility,
      value: 'documents',
      label: 'Documents',
      icon: <Iconify icon="eva:book-fill" />,
    },
    {
      disabled: customerEditFormFlag || siteEditFormVisibility || contactEditFormVisibility || noteEditFormVisibility,
      value: 'machines',
      label: 'Machines',
      icon: <Iconify icon="eva:settings-2-outline" />,
    }

  ];

  return (
    <>
      <Helmet>
        <title> Customer: Information | Machine ERP</title>
      </Helmet>

      <Container maxWidth={false}>
        {/* <CustomBreadcrumbs
          heading="Customer View"
        /> */}
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
          }}
        >
          <Cover name={customer ? customer.name : 'New Customer'} icon="ph:users-light"/>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            variant="scrollable"
            scrollButtons
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
              <Tab disabled={tab.disabled} key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
            ))}
          </Tabs>
        </Card>
        {TABS.map(
          (tab) => tab.value === currentTab && <Box key={tab.value}> {tab.component ? 
            tab.component : <img src="/assets/background/construction.jpg" alt="UNDER CONSTRUCTION" />
          } </Box>
        )}
        

        
      </Container>
    </>
  );
}