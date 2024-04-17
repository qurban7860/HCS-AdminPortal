import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid } from '@mui/material';
// routes
import { PATH_CRM } from '../../../routes/paths';
// hooks
import { useSnackbar } from '../../../components/snackbar';
import useResponsive from '../../../hooks/useResponsive';
// slices
import {
  deleteCustomer,
  setCustomerVerification,
} from '../../../redux/slices/customer/customer';
// components
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewPhoneComponent from '../../../components/ViewForms/ViewPhoneComponent';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { FORMLABELS } from '../../../constants/default-constants';
import { FORMLABELS as formLABELS } from '../../../constants/customer-constants';

// ----------------------------------------------------------------------

export default function CustomerViewForm() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useResponsive('down', 'sm');
  const { customer, isLoading } = useSelector((state) => state.customer);
  const { enqueueSnackbar } = useSnackbar();
  const { customerId } = useParams();
  const defaultValues = useMemo(
    () => ({
      id: customer?._id || '',
      code: customer?.clientCode || '',
      name: customer?.name || '',
      ref: customer?.ref || '',
      tradingName: customer?.tradingName || '',
      accountManager: customer?.accountManager || [],
      projectManager: customer?.projectManager || [],
      supportManager: customer?.supportManager || [],
      mainSite: customer?.mainSite || null,
      primaryBillingContact: customer?.primaryBillingContact || null,
      primaryTechnicalContact: customer?.primaryTechnicalContact || null,
      isFinancialCompany: customer?.isFinancialCompany,
      excludeReports: customer?.excludeReports || false,
      isActive: customer?.isActive,
      supportSubscription: customer?.supportSubscription,
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
  
  const handleEdit = async () =>  customerId && navigate(PATH_CRM.customers.edit(customerId));

  const onDelete = async () => {
    try {
      await dispatch(deleteCustomer(customerId));
      navigate(PATH_CRM.customers.list);
    } catch (err) {
      enqueueSnackbar(err, { variant: `error` });
      console.log('Error:', err);
    }
  };
  const handleVerification = async () => {
    try {
      await dispatch(setCustomerVerification(customerId));
      enqueueSnackbar('Customer Verified!');
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error, { variant: 'error' });
    }
  };

  return (
      <Grid container direction="row" mt={isMobile && 2}>
          <Card sx={{ width: '100%', p: '1rem', mb:3 }}>
            <ViewFormEditDeleteButtons
              isActive={defaultValues.isActive}
              verifiers={customer?.verifications}
              handleVerification={handleVerification}
              financingCompany={defaultValues.isFinancialCompany}
              handleEdit={handleEdit}
              onDelete={onDelete}
              supportSubscription={defaultValues.supportSubscription}
              backLink={() => navigate(PATH_CRM.customers.list)}
              excludeReports={defaultValues.excludeReports}
            />

              <Grid container>
                <ViewFormField isLoading={isLoading} variant='h4' sm={6} md={6} heading={formLABELS.CUSTOMER.NAME.label} param={defaultValues?.name} />
                <ViewFormField isLoading={isLoading} variant='h4' sm={6} md={6} heading={formLABELS.CUSTOMER.CODE.label} param={defaultValues?.code} />
                <ViewFormField isLoading={isLoading} sm={12} md={12} heading={formLABELS.CUSTOMER.TRADING_NAME.label} chips={defaultValues?.tradingName} />
                <ViewFormField isLoading={isLoading} md={6} heading='Reference Number' param={defaultValues?.ref} />

                <ViewFormField isLoading={isLoading} sm={6}
                  heading={formLABELS.CUSTOMER.BILLING_CONTACT}
                  param={defaultValues?.primaryBillingContact?.firstName}
                  secondParam={defaultValues?.primaryBillingContact?.lastName}
                />
                <ViewFormField isLoading={isLoading}
                  sm={6}
                  heading={formLABELS.CUSTOMER.TECHNICAL_CONTACT}
                  param={defaultValues?.primaryTechnicalContact?.firstName}
                  secondParam={defaultValues?.primaryTechnicalContact?.lastName}
                />
            </Grid>
            

            {defaultValues.mainSite && (
              <Grid container>
                <FormLabel content={FORMLABELS.SITEINFORMATION} />
                <ViewFormField isLoading={isLoading} sm={6} heading="Site Name" param={defaultValues?.mainSite?.name} />
                <ViewFormField isLoading={isLoading} sm={6} heading={formLABELS.STREET.label} param={defaultValues?.mainSite.address?.street} />
                <ViewFormField isLoading={isLoading} sm={6} heading={formLABELS.SUBURB.label} param={defaultValues?.mainSite.address?.suburb} />
                <ViewFormField isLoading={isLoading} sm={6} heading={formLABELS.CITY.label} param={defaultValues?.mainSite.address?.city} />
                <ViewFormField isLoading={isLoading} sm={6} heading={formLABELS.POSTCODE.label} param={defaultValues?.mainSite.address?.postcode} />
                <ViewFormField isLoading={isLoading} sm={6} heading={formLABELS.REGION.label} param={defaultValues?.mainSite.address?.region} />
                <ViewFormField isLoading={isLoading} sm={6} heading={formLABELS.COUNTRY.label} param={defaultValues?.mainSite.address?.country} />
                <ViewPhoneComponent isLoading={isLoading} sm={6} heading="Phone" value={defaultValues?.mainSite?.phoneNumbers || [] } />
                <ViewFormField isLoading={isLoading} sm={6} heading={formLABELS.CUSTOMER.EMAIL} param={defaultValues?.mainSite?.email} />
                <ViewFormField isLoading={isLoading} sm={6} heading={formLABELS.CUSTOMER.WEBSITE} param={defaultValues?.mainSite?.website} />
                <ViewFormField 
                  isLoading={isLoading} sm={6} 
                  heading='Primary Billing Contact' 
                  param={defaultValues?.mainSite?.primaryBillingContact?.firstName} 
                  secondParam={defaultValues?.mainSite?.primaryTechnicalContact?.lastName}
                />
                <ViewFormField 
                  isLoading={isLoading} sm={6} 
                  heading='Primary Technical Contact'
                  param={defaultValues?.mainSite?.primaryTechnicalContact?.firstName} 
                  secondParam={defaultValues?.mainSite?.primaryTechnicalContact?.lastName}
                />
              </Grid>
            )}
            <Grid container>
              <FormLabel content={FORMLABELS.HOWICK} />
              <ViewFormField isLoading={isLoading} sm={6} heading={formLABELS.CUSTOMER.ACCOUNT} customerContacts={defaultValues?.accountManager } />
              <ViewFormField isLoading={isLoading} sm={6} heading={formLABELS.CUSTOMER.PROJECT} customerContacts={defaultValues?.projectManager } />
              <ViewFormField isLoading={isLoading} sm={6} heading={formLABELS.CUSTOMER.SUPPORT} customerContacts={defaultValues?.supportManager } />
              <ViewFormAudit defaultValues={defaultValues} />
            </Grid>
              
          </Card>
      </Grid>
  );
}
