import { blue } from '@mui/material/colors';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Card, Grid, Stack, Typography, Button, Link, Breadcrumbs, Tooltip } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_CUSTOMER } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import CustomerEditForm from './CustomerEditForm';
import FormLabel from '../components/FormLabel';
// slices
import {
  getCustomers,
  getCustomer,
  setCustomerEditFormVisibility,
  deleteCustomer,
  setCustomerVerification,
} from '../../redux/slices/customer/customer';
import ViewFormAudit from '../components/ViewFormAudit';
import ViewFormField from '../components/ViewFormField';
import ViewFormEditDeleteButtons from '../components/ViewFormEditDeleteButtons';
import BreadcrumbsProducer from '../components/BreadcrumbsProducer';
import AddButtonAboveAccordion from '../components/AddButtonAboveAcoordion';

// ----------------------------------------------------------------------

export default function CustomerViewForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customer, customerEditFormVisibility } = useSelector((state) => state.customer);
  const userId = localStorage.getItem('userId');
  const { enqueueSnackbar } = useSnackbar();

  // console.log("customer : ",customer)
  // const toggleEdit = () => {
  //   dispatch(setCustomerEditFormVisibility(true));
  // };

  const handleEdit = async () => {
    await dispatch(getCustomer(customer._id));
    if (customerEditFormVisibility) {
      dispatch(setCustomerEditFormVisibility(false));

      setIsExpanded(false);
    }
    if (!customerEditFormVisibility) {
      dispatch(setCustomerEditFormVisibility(true));
      setIsExpanded(true);
    }
  };

  const onDelete = async () => {
    try{
      await dispatch(deleteCustomer(customer._id));
      navigate(PATH_DASHBOARD.customer.list);
    } catch (err) {
      // if(err.Message){
      //   enqueueSnackbar(err.Message,{ variant: `error` })
      // }else if(err.message){
      //   enqueueSnackbar(err.message,{ variant: `error` })
      // }else{
      //   enqueueSnackbar("Something went wrong!",{ variant: `error` })
      // }
      enqueueSnackbar("Customer delete failed!",{ variant: `error` });
      console.log("Error:", err);
    }
  };
  const handleVerification = async () => {
    try {
      await dispatch(setCustomerVerification(customer._id));
      enqueueSnackbar("Customer Verified!");
    }catch(error){
      console.log(error)
      enqueueSnackbar("Customer Verify failed!");
    }
  };

  const defaultValues = useMemo(
    () => ({
      id: customer?._id || '',
      name: customer?.name || '',
      tradingName: customer?.tradingName || '',
      accountManager: customer?.accountManager || '',
      projectManager: customer?.projectManager || '',
      supportManager: customer?.supportManager || '',
      mainSite: customer?.mainSite || null,
      primaryBillingContact: customer?.primaryBillingContact || null,
      primaryTechnicalContact: customer?.primaryTechnicalContact || null,
      isActive: customer?.isActive,
      createdAt: customer?.createdAt || '',
      createdByFullName: customer?.createdBy?.name || '',
      createdIP: customer?.createdIP || '',
      updatedAt: customer?.updatedAt || '',
      updatedByFullName: customer?.updatedBy?.name || '',
      updatedIP: customer?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customer]
  );

  const shouldShowCustomerView = isExpanded && !setCustomerEditFormVisibility;
  const shouldShowCustomerEdit = setCustomerEditFormVisibility && !isExpanded;
  return (
    <>
      <Stack alignItems="flex-end" sx={{ mt: 4, padding: 2 }}>
        <AddButtonAboveAccordion isCustomer="true" />
        <BreadcrumbsProducer
          underline="none"
          step={1}
          step2
          path={PATH_DASHBOARD.customer.root}
          name="Customer"
          path2={PATH_DASHBOARD.customer.view}
          name2={customer?.name}
        />
      </Stack>

      <Grid container direction="row">
        <Grid item md={12}>
          <Card sx={{ p: 3 }}>
            <ViewFormEditDeleteButtons
              isVerified={customer?.verifications?.find(
                (verified) => verified?.verifiedBy?._id === userId
              )}
              handleVerification={handleVerification}
              handleEdit={handleEdit}
              onDelete={onDelete}
            />
             <Grid display="inline-flex" >
                <Tooltip title="Active">
                  <ViewFormField sm={12} isActive={defaultValues.isActive} verifiedBy={customer?.verifications}/>
                </Tooltip>
                <Tooltip title="Verified By">
                  <ViewFormField sm={12} customerVerificationCount={customer?.verifications?.length} verified verifiedBy={customer?.verifications} />
                </Tooltip>
              </Grid>
            <Grid container>
               
              <ViewFormField sm={6} heading="Name" param={defaultValues?.name} />
              <ViewFormField sm={6} heading="Trading Name" param={defaultValues?.tradingName} />
              <ViewFormField sm={6} heading="Phone" param={defaultValues?.mainSite?.phone} />
              <ViewFormField sm={6} heading="Fax" param={defaultValues?.mainSite?.fax} />
              <ViewFormField sm={6} heading="Email" param={defaultValues?.mainSite?.email} />
            </Grid>
            <ViewFormField
              sm={6}
              heading="Primary Billing Contact"
              param={defaultValues?.primaryBillingContact?.firstName}
              secondParam={defaultValues?.primaryBillingContact?.lastName}
            />
            <ViewFormField
              sm={6}
              heading="Primary Technical Contact"
              param={defaultValues?.primaryTechnicalContact?.firstName}
              secondParam={defaultValues?.primaryTechnicalContact?.lastName}
            />

            {defaultValues.mainSite && (
              <Grid container>
                <FormLabel content="Address Information" />
                <ViewFormField sm={6} heading="Site Name" param={defaultValues?.mainSite?.name} />
                <ViewFormField
                  sm={6}
                  heading="Street"
                  param={defaultValues?.mainSite.address?.street}
                />
                <ViewFormField
                  sm={6}
                  heading="Suburb"
                  param={defaultValues?.mainSite.address?.suburb}
                />
                <ViewFormField
                  sm={6}
                  heading="City"
                  param={defaultValues?.mainSite.address?.city}
                />
                <ViewFormField
                  sm={6}
                  heading="Post Code"
                  param={defaultValues?.mainSite.address?.postcode}
                />
                <ViewFormField
                  sm={6}
                  heading="Region"
                  param={defaultValues?.mainSite.address?.region}
                />
                <ViewFormField
                  sm={6}
                  heading="Country"
                  param={defaultValues?.mainSite.address?.country}
                />
              </Grid>
            )}
            <Grid container>
              <FormLabel content="Howick Resources" />
              <ViewFormField
                sm={6}
                heading="Account Manager"
                param={defaultValues?.accountManager?.firstName}
                secondParam={defaultValues?.accountManager?.lastName}
              />
              <ViewFormField
                sm={6}
                heading="Project Manager"
                param={defaultValues?.projectManager?.firstName}
                secondParam={defaultValues?.projectManager?.lastName}
              />
              <ViewFormField
                sm={6}
                heading="Suppport Manager"
                param={defaultValues?.supportManager?.firstName}
                secondParam={defaultValues?.supportManager?.lastName}
              />
              <ViewFormField />
            </Grid>
            <Grid container sx={{ pb: '1rem' }}>
              <ViewFormAudit defaultValues={defaultValues} />
            </Grid>
          </Card>
        </Grid>

        {/* <Grid item md={12}>
          {shouldShowCustomerEdit && <CustomerEditForm customer={customer} />}
        </Grid> */}
      </Grid>
    </>
  );
}
