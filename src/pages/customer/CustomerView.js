import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Tab, Card, Tabs, Container, Box, Button, Grid, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getCustomers, getCustomer } from '../../redux/slices/customer';
import { getDepartments } from '../../redux/slices/department';

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
import SiteAddForm from '../site/SiteAddForm';
import SiteList from '../site/SiteList';
import ContactAddForm from '../contact/ContactAddForm';
import CustomerStepper from './CustomerStepper';
/* eslint-disable */

import CustomerViewForm from './CustomerViewForm';
/* eslint-enable */

import CustomerEditForm from './CustomerEditForm';
import CustomerSiteList from './CustomerSiteList';

// ----------------------------------------------------------------------

/* eslint-disable */
CustomerViewPage.propTypes = {
  editPage: PropTypes.bool,
};
/* eslint-enable */


export default function CustomerViewPage({editPage}) {

  const { customer } = useSelector((state) => state.customer);

  console.log('customer', customer);

  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('customer-edit');

  const [currentComponent, setCurrentComponent] = useState(<CustomerAddForm/>);

  const [customerFlag, setCustomerFlag] = useState(true);

  useEffect(() => {
    console.log(editPage);
    if(editPage){
      console.log('edit');
      setCurrentComponent(<CustomerEditForm/>);
    }else{
      if(customer){
        console.log('view');
        setCustomerFlag(false);
        setCurrentComponent(<CustomerViewForm/>);        
      }else{
        console.log('addd');
        setCurrentComponent(<CustomerAddForm/>);
      }
      console.log("abc");
    }

  }, [editPage, customer]);

  console.log('currentcomponent', currentComponent); 

  const TABS = [
    {
      value: 'customer-edit',
      label: 'Basic Info',
      icon: <Iconify icon="ic:round-account-box" />,
      component: currentComponent
    },
    {
      disabled: customerFlag,
      value: 'sites',
      label: 'Sites',
      icon: <Iconify icon="eva:settings-2-outline" />,
      component: <CustomerSiteList/>,

    },
    {
      disabled: customerFlag,
      value: 'contacts',
      label: 'Contacts',
      icon: <Iconify icon="eva:clock-outline" />,
      component: <ContactAddForm/>,

    },
    {
      disabled: customerFlag,
      value: 'repair-history',
      label: 'Repair History',
      icon: <Iconify icon="eva:archive-outline" />,
    },
  ];

  return (
    <>
      <Helmet>
        <title> Customer: Information | Machine ERP</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Customer View"
          links={[
            { name: 'Customer', href: PATH_DASHBOARD.customer.dashboard },
            // {
            //   name: 'Customer',
            //   href: PATH_DASHBOARD.customer.list,
            // },
            { name: 'View' },
          ]}
        />
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
        {currentComponent.type.name === "CustomerViewForm" && currentTab === 'customer-edit' &&
         <Grid container
          sx={{
            paddingBottom: 2
          }}>

          <Box
            rowGap={4}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(4, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
          >
            <Stack>
              <Button
                // component={RouterLink}
                onClick={() => setCurrentComponent(<CustomerEditForm/>)}
                variant="contained"
                startIcon={<Iconify icon="eva:edit-fill" />}
              >
                Edit Customer
              </Button>
      
      
            </Stack>
            <Stack>
              <Button
                onClick={() => setCurrentComponent(<CustomerAddForm/>)}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Add Customer
              </Button>
      
      
            </Stack>

          </Box>    
        </Grid>}


        {/* <Button 
                  size ="medium" 
                  color ="secondary" 
                  variant ="contained" 
                  // href = {currentCustomer.image === undefined ? '' : `localhost:5000/${currentCustomer.image}`}
                  >
                    Edit Customer
          </Button>  */}
        {TABS.map(
          (tab) => tab.value === currentTab && <Box key={tab.value}> {tab.component ? 
            tab.component : <img src="/assets/background/construction.jpg" alt="UNDER CONSTRUCTION" />
          } </Box>
        )}
        
      </Container>
    </>
  );
}
