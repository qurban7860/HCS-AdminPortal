import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Card, Grid, Tooltip } from '@mui/material';
// routes
import { PATH_CUSTOMER } from '../../routes/paths';
// hooks
import { useSnackbar } from '../../components/snackbar';
import useResponsive from '../../hooks/useResponsive';
// slices
import {
  getCustomer,
  setCustomerEditFormVisibility,
  deleteCustomer,
  setCustomerVerification,
} from '../../redux/slices/customer/customer';
// components
import FormLabel from '../components/DocumentForms/FormLabel';
import { TableNoData } from '../../components/table';
import BreadcrumbsProvider from '../components/Breadcrumbs/BreadcrumbsProvider';
import ViewFormAudit from '../components/ViewForms/ViewFormAudit';
import ViewFormField from '../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../components/ViewForms/ViewFormEditDeleteButtons';
import BreadcrumbsLink from '../components/Breadcrumbs/BreadcrumbsLink';
import AddButtonAboveAccordion from '../components/Defaults/AddButtonAboveAcoordion';
import { BREADCRUMBS, FORMLABELS } from '../../constants/default-constants';
import { Snacks, FORMLABELS as formLABELS } from '../../constants/customer-constants';

// ----------------------------------------------------------------------

export default function CustomerViewForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useResponsive('down', 'sm');
  const { customer, customerEditFormVisibility } = useSelector((state) => state.customer);
  const userId = localStorage.getItem('userId');
  const { enqueueSnackbar } = useSnackbar();
  const isNotFound = !customer;
  // ----------------------------useMemo---------------------------------
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

  // ----------------------------handle functions---------------------------------

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
    try {
      await dispatch(deleteCustomer(customer._id));
      navigate(PATH_CUSTOMER.list);
    } catch (err) {
      enqueueSnackbar(Snacks.FAILED_DELETE, { variant: `error` });
      console.log('Error:', err);
    }
  };
  const handleVerification = async () => {
    try {
      await dispatch(setCustomerVerification(customer._id));
      enqueueSnackbar('Customer Verified!');
    } catch (error) {
      console.log(error);
      enqueueSnackbar(Snacks.FAILED_VERIFY, { variant: 'error' });
    }
  };

  return (
    <>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={12} md={6}>
          <BreadcrumbsProvider>
            <BreadcrumbsLink to={PATH_CUSTOMER.list} name={BREADCRUMBS.CUSTOMERS} />
            <BreadcrumbsLink to={PATH_CUSTOMER.view} name={customer.name} />
          </BreadcrumbsProvider>
        </Grid>
        {!isMobile && <AddButtonAboveAccordion isCustomer />}
      </Grid>
      <Grid item lg={12}>
        <TableNoData isNotFound={isNotFound} />
      </Grid>

      {/* customer view form */}
      <Grid container direction="row" mt={isMobile && 2}>
        <Grid item md={12}>
          <Card sx={{ p: 3 }}>
            <ViewFormEditDeleteButtons
              isVerified={customer?.verifications?.some((verified) => verified?.verifiedBy?._id === userId)}
              handleVerification={handleVerification}
              handleEdit={handleEdit}
              onDelete={onDelete}
            />
            <Grid display="inline-flex" mx={0}>
              <ViewFormField sm={12} isActive={defaultValues.isActive} />
              <Tooltip title="Verified By">
                <ViewFormField
                  sm={12}
                  customerVerificationCount={customer?.verifications?.length}
                  verified
                  customerVerifiedBy={customer?.verifications}
                />
              </Tooltip>
            </Grid>
            <Grid container>
              <ViewFormField
                sm={12}
                heading={formLABELS.CUSTOMER.NAME.label}
                param={defaultValues?.name}
              />
              <ViewFormField
                sm={12}
                heading={formLABELS.CUSTOMER.TRADING_NAME.label}
                chips={defaultValues?.tradingName}
              />
              <ViewFormField
                sm={6}
                heading={formLABELS.CUSTOMER.PHONE}
                param={defaultValues?.mainSite?.phone}
              />
              <ViewFormField
                sm={6}
                heading={formLABELS.CUSTOMER.FAX}
                param={defaultValues?.mainSite?.fax}
              />
              <ViewFormField
                sm={6}
                heading={formLABELS.CUSTOMER.EMAIL}
                param={defaultValues?.mainSite?.email}
              />
            </Grid>
            <ViewFormField
              sm={6}
              heading={formLABELS.CUSTOMER.BILLING_CONTACT}
              param={defaultValues?.primaryBillingContact?.firstName}
              secondParam={defaultValues?.primaryBillingContact?.lastName}
            />
            <ViewFormField
              sm={6}
              heading={formLABELS.CUSTOMER.TECHNICAL_CONTACT}
              param={defaultValues?.primaryTechnicalContact?.firstName}
              secondParam={defaultValues?.primaryTechnicalContact?.lastName}
            />

            {defaultValues.mainSite && (
              <Grid container>
                <FormLabel content={FORMLABELS.ADDRESS} />
                <ViewFormField sm={6} heading="Site Name" param={defaultValues?.mainSite?.name} />
                <ViewFormField
                  sm={6}
                  heading={formLABELS.STREET.label}
                  param={defaultValues?.mainSite.address?.street}
                />
                <ViewFormField
                  sm={6}
                  heading={formLABELS.SUBURB.label}
                  param={defaultValues?.mainSite.address?.suburb}
                />
                <ViewFormField
                  sm={6}
                  heading={formLABELS.CITY.label}
                  param={defaultValues?.mainSite.address?.city}
                />
                <ViewFormField
                  sm={6}
                  heading={formLABELS.POSTCODE.label}
                  param={defaultValues?.mainSite.address?.postcode}
                />
                <ViewFormField
                  sm={6}
                  heading={formLABELS.REGION.label}
                  param={defaultValues?.mainSite.address?.region}
                />
                <ViewFormField
                  sm={6}
                  heading={formLABELS.COUNTRY.label}
                  param={defaultValues?.mainSite.address?.country}
                />
              </Grid>
            )}
            <Grid container>
              <FormLabel content={FORMLABELS.HOWICK} />
              <ViewFormField
                sm={6}
                heading={formLABELS.CUSTOMER.ACCOUNT}
                param={defaultValues?.accountManager?.firstName}
                secondParam={defaultValues?.accountManager?.lastName}
              />
              <ViewFormField
                sm={6}
                heading={formLABELS.CUSTOMER.PROJECT}
                param={defaultValues?.projectManager?.firstName}
                secondParam={defaultValues?.projectManager?.lastName}
              />
              <ViewFormField
                sm={6}
                heading={formLABELS.CUSTOMER.SUPPORT}
                param={defaultValues?.supportManager?.firstName}
                secondParam={defaultValues?.supportManager?.lastName}
              />
              <ViewFormField />
            </Grid>
              <ViewFormAudit defaultValues={defaultValues} />
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
