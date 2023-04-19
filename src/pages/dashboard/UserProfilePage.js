import { Helmet } from 'react-helmet-async';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Switch, Card, Grid, Container, Typography, Modal , Fade, Box , Link ,Dialog,  DialogTitle, Stack,Button, Tabs} from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
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
import { getUser, setEditFormVisibility } from '../../redux/slices/user';
import { useSettingsContext } from '../../components/settings';

// sections
import {
  Profile,
  ProfileCover,
  ProfileFriends,
  ProfileGallery,
  ProfileFollowers,
} from '../../sections/@dashboard/user/profile';
import ViewFormField from '../components/ViewFormField';
import ViewFormAudit from '../components/ViewFormAudit';
import { getCustomer } from '../../redux/slices/customer/customer';

// ----------------------------------------------------------------------

export default function UserProfilePage() {
  const { themeStretch } = useSettingsContext();
  const { customer } = useSelector((state) => state.customer);

  const { user, userId } = useAuthContext();
console.log("userId : " ,userId )
  const [currentTab, setCurrentTab] = useState('profile');

      const { securityUser } = useSelector((state) => state.user);
      
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=> {
      if(userId){
        dispatch(getUser(userId))
      }
      },[dispatch,userId])

      useEffect(()=> {
        if(userId){
          dispatch(getCustomer(securityUser?.customer?._id))
        }
      },[dispatch,userId,securityUser])
      const handleViewCustomer = (id) => {
        navigate(PATH_DASHBOARD.customer.view(id));
      };
      const [openCustomer, setOpenCustomer] = useState(false);
      const handleOpenCustomer = () => setOpenCustomer(true);
      const handleCloseCustomer = () => setOpenCustomer(false);
    const handleEdit = () => {
      dispatch(setEditFormVisibility(true));
      navigate(PATH_DASHBOARD.user.edit(securityUser._id));
    }
  //   const handleViewCustomer = (id) => {
  //     navigate(PATH_DASHBOARD.user.list);
  //   };
  
    const defaultValues = useMemo(
      () => ({
        customer:                 securityUser?.customer?.name || "",
        contact:                  securityUser?.contact?.firstName || "",
        name:                     securityUser?.name || "",
        phone:                    securityUser?.phone || "",
        email:                    securityUser?.email || "",
        login:                    securityUser?.login || "",
        roles:                    securityUser?.roles ,
        isActive:                 securityUser?.isActive,
        createdByFullName:        securityUser?.createdBy?.name ,
        createdAt:                securityUser?.createdAt ,
        createdIP:                securityUser?.createdIP ,
        updatedByFullName:        securityUser?.updatedBy?.name ,
        updatedAt:                securityUser?.updatedAt ,
        updatedIP:                securityUser?.updatedIP ,
      }
      ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [securityUser] );
  
  // const TABS = [
  //   {
  //     value: 'profile',
  //     label: 'Profile',
  //     icon: <Iconify icon="ic:round-account-box" />,
  //     component: <Profile info={_userAbout} posts={_userFeeds} />,
  //   },
  //   {
  //     value: 'followers',
  //     label: 'Followers',
  //     icon: <Iconify icon="eva:heart-fill" />,
  //     component: <ProfileFollowers followers={_userFollowers} />,
  //   },
  //   {
  //     value: 'friends',
  //     label: 'Friends',
  //     icon: <Iconify icon="eva:people-fill" />,
  //     component: (
  //       <ProfileFriends
  //         friends={_userFriends}
  //         searchFriends={searchFriends}
  //         onSearchFriends={(event) => setSearchFriends(event.target.value)}
  //       />
  //     ),
  //   },
  //   {
  //     value: 'gallery',
  //     label: 'Gallery',
  //     icon: <Iconify icon="ic:round-perm-media" />,
  //     component: <ProfileGallery gallery={_userGallery} />,
  //   },
  // ];

  return (
    <>
      <Container maxWidth={ false}>
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
          }}
        >
          <ProfileCover name={user?.displayName} role={_userAbout.role} cover={_userAbout.cover} />

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
            {/* {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
            ))} */}
          </Tabs>
        </Card>
        <Card sx={{ p: 3 }}>
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mb: -4, mt:-1, mr:2}}>
              <Button onClick={() => handleEdit()} variant="outlined" startIcon={<Iconify icon="eva:edit-fill" />} >Edit</Button>
          </Stack>
          <Grid container>
            <ViewFormField sm={6} heading="Billing Site" objectParam={defaultValues?.customer? <Link onClick={handleOpenCustomer} href="#" underline="none" >{ defaultValues?.customer}</Link> : ''} />
            {/* <ViewFormField sm={6} heading="Customer" param={defaultValues.customer} /> */}
            <ViewFormField sm={6} heading="Contact" param={defaultValues.contact} />
            <ViewFormField sm={6} heading="Full Name" param={defaultValues.name} />
            <ViewFormField sm={6} heading="Phone" param={defaultValues.phone} />
            <ViewFormField sm={12} heading="email" param={defaultValues.email} />
            <ViewFormField sm={6} heading="Login" param={defaultValues.login} />
            <ViewFormField sm={6} heading="Roles" param={defaultValues.roles?.map((obj) => obj.name).join(', ')} />
          </Grid>
            <Switch sx={{mt:1}} checked = { defaultValues.isActive } disabled  />
          <Grid container>
            <ViewFormAudit defaultValues={defaultValues}/>
          </Grid>
        </Card>

        {/* {TABS.map(
          (tab) => tab.value === currentTab && <Box key={tab.value}> {tab.component} </Box>
        )} */}
      </Container>
      <Dialog open={openCustomer} onClose={handleCloseCustomer} aria-labelledby="keep-mounted-modal-title" aria-describedby="keep-mounted-modal-description" >
        <Grid container sx={{px:2, pt:2}}>
        <Grid item sx={{display: "flex", justifyContent:"center", alignItems:"center" }} sm={12}>
          <Typography variant="h3" sx={{px:2}}>Customer </Typography> <Link onClick={() => handleCloseCustomer()} href="#" underline="none" sx={{ml: "auto"}}> <Iconify icon="mdi:close-box-outline" /></Link>
        </Grid>
          <ViewFormField sm={12} heading="Name"                     param={customer?.name?        customer?.name : ''} />
          <ViewFormField sm={6} heading="Trading Name"              param={customer?.tradingName? customer?.tradingName : ''} />
          <ViewFormField sm={6} heading="Phone"                     param={customer?.mainSite?.phone?       customer?.mainSite.phone : ''} />
          <ViewFormField sm={6} heading="Fax"                       param={customer?.mainSite?.fax?         customer?.mainSite.fax : ''} /> 
          <ViewFormField sm={6} heading="Email"                     param={customer?.mainSite?.email?       customer?.mainSite.email : ''} />
          <ViewFormField sm={6} heading="Site Name"                 param={customer?.mainSite?.address? customer?.mainSite?.address?.street : ''} />
          <ViewFormField sm={6} heading="Street"                    param={customer?.mainSite?.address? customer?.mainSite?.address?.street : ''} />
          <ViewFormField sm={6} heading="Suburb"                    param={customer?.mainSite?.address? customer?.mainSite?.address?.suburb : ''} />
          <ViewFormField sm={6} heading="City"                      param={customer?.mainSite?.address? customer?.mainSite?.address?.city : ''} />
          <ViewFormField sm={6} heading="Region"                    param={customer?.mainSite?.address? customer?.mainSite?.address?.region : ''} />
          <ViewFormField sm={6} heading="Post Code"                 param={customer?.mainSite?.address? customer?.mainSite?.address?.postcode : ''} />
          <ViewFormField sm={12} heading="Country"                  param={customer?.mainSite?.address? customer?.mainSite?.address?.country : ''} />
          <ViewFormField sm={6} heading="Primary Biling Contact"    param={customer?.primaryBillingContact?   `${customer?.primaryBillingContact?.firstName } ${customer?.primaryBillingContact?.lastName}` : ''} />
          <ViewFormField sm={6} heading="Primary Technical Contact" param={customer?.primaryTechnicalContact? `${customer?.primaryTechnicalContact?.firstName } ${customer?.primaryTechnicalContact?.lastName}`: ''} />
        </Grid>
          <Typography variant="subtitle2" sx={{px:4}}>Howick Resources </Typography>
        <Grid container sx={{px:2,pb:3}}>
          <ViewFormField sm={6} heading="Account Manager"   param={customer?.accountManager?.firstName} secondParam={customer?.accountManager?.lastName}/>
          <ViewFormField sm={6} heading="Project Manager"   param={customer?.projectManager?.firstName} secondParam={customer?.projectManager?.lastName}/>
          <ViewFormField sm={6} heading="Suppport Manager"  param={customer?.supportManager?.firstName} secondParam={customer?.supportManager?.lastName}/> 
        </Grid>
        <Grid item sx={{display: "flex", justifyContent:"center", alignItems:"center" }} sm={12}>
          <Link onClick={() => handleViewCustomer(customer._id)} href="#" underline="none" sx={{ml: "auto",display: "flex", justifyContent:"center", alignItems:"center", px:3, pb:3}}> <Typography variant="body" sx={{px:2}}>Go to customer</Typography><Iconify icon="mdi:link-box-variant-outline" /></Link>
        </Grid>
      </Dialog>
    </>
  );
}
