import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Dialog, DialogContent, DialogTitle, Divider } from '@mui/material';
import { setCustomerDialog, setCustomerTab, resetCustomer } from '../../redux/slices/customer/customer';
// import Iconify from '../../../components/iconify';
import { PATH_CRM } from '../../routes/paths';
import DialogLink from './DialogLink';
import FormLabel from '../DocumentForms/FormLabel';
import ViewFormField from '../ViewForms/ViewFormField';
import ViewPhoneComponent from '../ViewForms/ViewPhoneComponent';

function CustomerDialog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customer, customerDialog, isLoading } = useSelector((state) => state.customer);
  const handleCustomerDialog = async () => { 
    await dispatch(resetCustomer())  
    await dispatch(setCustomerDialog(false))  
  }

  return (
    <Dialog
      disableEnforceFocus
      maxWidth="lg"
      open={ customer && customerDialog}
      onClose={handleCustomerDialog}
      aria-describedby="alert-dialog-slide-description"
      // keepMounted // for scroll lock
    >
      <DialogTitle variant='h3' sx={{pb:1, pt:2}}>Customer</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <DialogContent dividers sx={{px:3}}>
        <Grid item container>
          <ViewFormField isLoading={isLoading} sm={12} heading="Name" param={customer?.name || ''} />
          <ViewFormField isLoading={isLoading} sm={12} heading="Trading Name" chips={customer?.tradingName || ''} />
          <ViewPhoneComponent isLoading={isLoading} sm={12} heading="Phone" value={customer?.mainSite?.phoneNumbers || []} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Email" param={customer?.mainSite?.email || ''} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Site Name" param={customer?.mainSite?.name || ''} />
          <FormLabel content="Address Information" />
          <ViewFormField isLoading={isLoading} sm={6} heading="Street" param={customer?.mainSite?.address?.street || ''} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Suburb" param={customer?.mainSite?.address?.suburb || ''} />
          <ViewFormField isLoading={isLoading} sm={6} heading="City" param={customer?.mainSite?.address?.city || ''} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Region" param={customer?.mainSite?.address?.region || ''} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Post Code" param={customer?.mainSite?.address?.postcode || ''} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Country" param={customer?.mainSite?.address?.country || ''} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Primary Biling Contact"
            param={
              customer?.primaryBillingContact &&
              `${customer?.primaryBillingContact?.firstName} ${customer?.primaryBillingContact?.lastName}`
            }
          />
          <ViewFormField isLoading={isLoading} sm={6} heading="Primary Technical Contact"
            param={
              customer?.primaryTechnicalContact &&
              `${customer?.primaryTechnicalContact?.firstName} ${customer?.primaryTechnicalContact?.lastName}`
            }
          />
          <FormLabel content="Howick Resources" />
          
          <ViewFormField isLoading={isLoading} sm={6} heading="Account Manager"
            chips={customer?.accountManager?.map(el=>`${el?.firstName} ${el?.lastName}`)}
          />

          <ViewFormField isLoading={isLoading} sm={6} heading="Project Manager"
            chips={customer?.projectManager?.map(el=>`${el?.firstName} ${el?.lastName}`)}
          />

          <ViewFormField isLoading={isLoading} sm={6} heading="Suppport Manager"
            chips={customer?.supportManager?.map(el=>`${el?.firstName} ${el?.lastName}`)}
          />

        </Grid>
      </DialogContent>
      <DialogLink
        onClose={handleCustomerDialog}
        onClick={() => {
          dispatch(setCustomerTab('info'));
          handleCustomerDialog();
          navigate(PATH_CRM.customers.view(customer._id));
        }}
        content="Go to Customer"
      />
    </Dialog>
  );
}


export default CustomerDialog;
