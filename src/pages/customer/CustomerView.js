import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

// @mui
import { Tab, Card, Tabs, Container, Box, Button, Grid, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getCustomers, getCustomer, setCustomerEditFormVisibility } from '../../redux/slices/customer';
import { getDepartments } from '../../redux/slices/department';
import { setFormVisibility } from '../../redux/slices/site';
import { getContact } from '../../redux/slices/contact';


// auth
import { useAuthContext } from '../../auth/useAuthContext';
// _mock_
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
import {
  CustomerCover
} from './util';

import CustomerAddForm from './CustomerAddForm'
import SiteAddForm from './site/SiteAddForm';
import SiteList from './site/SiteList';
import ContactAddForm from './contact/ContactAddForm';
import CustomerStepper from './CustomerStepper';
/* eslint-disable */

import CustomerViewForm from './CustomerViewForm';
/* eslint-enable */

import CustomerEditForm from './CustomerEditForm';
import CustomerSiteList from './CustomerSiteList';
import CustomerContactList from './CustomerContactList';

// ----------------------------------------------------------------------

/* eslint-disable */
CustomerViewPage.propTypes = {
  editPage: PropTypes.bool,
};
/* eslint-enable */


export default function CustomerViewPage({editPage}) {

  const { id } = useParams(); 

  const dispatch = useDispatch();

  const { customer, customerEditFormFlag } = useSelector((state) => state.customer);

  const { site, siteEditFormVisibility } = useSelector((state) => state.site);

  const { contactEditFormVisibility } = useSelector((state) => state.contact);
  
  const [currentTab, setCurrentTab] = useState('customer-info');

  const [editFlag, setEditFlag] = useState(false);
  const toggleEditFlag = () => setEditFlag(value => !value);

  const [currentComponent, setCurrentComponent] = useState(<CustomerViewForm/>);

  const [customerFlag, setCustomerFlag] = useState(true);

  useEffect(() => {
    if(id !== 'null'){
      dispatch(getCustomer(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    /* eslint-disable */
    if(customerEditFormFlag){
      setCurrentComponent(<CustomerEditForm/>);
    }else{
      setCustomerFlag(false);
      setCurrentComponent(<CustomerViewForm/>);        
    }
    /* eslint-enable */
  }, [dispatch, customerEditFormFlag, customer]);


  const TABS = [
    {
      disabled: siteEditFormVisibility || contactEditFormVisibility,
      value: 'customer-info',
      label: 'Customer Info',
      icon: <Iconify icon="ic:round-account-box" />,
      component: currentComponent
    },
    {
      disabled: customerEditFormFlag || contactEditFormVisibility,
      value: 'sites',
      label: 'Sites',
      icon: <Iconify icon="eva:navigation-2-outline" />,
      component: <CustomerSiteList/>,
    },
    {
      disabled: customerEditFormFlag || siteEditFormVisibility,
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
      component: <></>
    },
    {
      disabled: customerEditFormFlag || siteEditFormVisibility || contactEditFormVisibility,
      value: 'documents',
      label: 'Documents',
      icon: <Iconify icon="eva:book-fill" />,
    },
    {
      disabled: customerEditFormFlag || siteEditFormVisibility || contactEditFormVisibility,
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
          <CustomerCover name={customer ? customer.name : 'New Customer'}/>

          
          
           

          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
  
              width: 1,
              bottom: 0,
              zIndex: 9,
              position: 'absolute',
              bgcolor: 'background.paper',
              '& .MuiTabs-flexContainer': {
                pr: { md: 3 },
                justifyContent: {
                  sm: 'center',
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
