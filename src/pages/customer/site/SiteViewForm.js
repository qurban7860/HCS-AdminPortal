import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import { useNavigate } from 'react-router-dom';

// @mui
import { Grid } from '@mui/material';
// redux
import {
  deleteSite,
  getSite,
  getSites,
  setIsExpanded,
  setSiteEditFormVisibility,
} from '../../../redux/slices/customer/site';
import { useSnackbar } from '../../../components/snackbar';

// paths
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormPhoneField from '../../../components/ViewForms/ViewFormPhoneField';

// ----------------------------------------------------------------------

SiteViewForm.propTypes = {
  currentSite: PropTypes.object,
  handleMap: PropTypes.func,
};
export default function SiteViewForm({ currentSite = null, handleMap }) {
  const { site, isLoading } = useSelector((state) => state.site);
  const { customer } = useSelector((state) => state.customer);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const onDelete = async () => {
    try {
      await dispatch(deleteSite(customer?._id, currentSite?._id));
      await dispatch(getSites(customer?._id));
      enqueueSnackbar('Site deleted Successfully!');
      dispatch(setIsExpanded(false));
    } catch (err) {
      enqueueSnackbar(err, { variant: `error` });
      console.log(err);
    }
  };

  const handleEdit = async () => {
    await dispatch(getSite(customer?._id, currentSite?._id));
    dispatch(setSiteEditFormVisibility(true));
  };

  const defaultValues = useMemo(
    () => ({
      id: currentSite ? currentSite?._id : site?._id || '',
      name: currentSite ? currentSite.name : site?.name || '',
      customer: currentSite ? currentSite.name : site?.tradingName || '',
      billingSite: currentSite ? currentSite?._id : site?.accountManager || '',
      phoneNumbers: currentSite ? currentSite.phoneNumbers : site?.phoneNumbers || '',
      email: currentSite ? currentSite.email : site?.email || '',
      website: currentSite ? currentSite.website : site?.website || '',
      lat: currentSite ? currentSite.lat : site?.lat || '',
      long: currentSite ? currentSite.long : site?.long || '',
      street: currentSite ? currentSite.address?.street : site?.address.street || '',
      suburb: currentSite ? currentSite.address?.suburb : site?.address.suburb || '',
      city: currentSite ? currentSite.address?.city : site?.address.city || '',
      postcode: currentSite ? currentSite.address?.postcode : site?.address.postcode || '',
      region: currentSite ? currentSite.address?.region : site?.address.region || '',
      country: currentSite ? currentSite.address?.country : site?.address.country || '',
      primaryBillingContact: currentSite?.primaryBillingContact || null,
      primaryTechnicalContact: currentSite?.primaryTechnicalContact || null,
      isActive: currentSite?.isActive,
      createdAt: currentSite?.createdAt || '',
      createdByFullName: currentSite?.createdBy?.name || '',
      createdIP: currentSite?.createdIP || '',
      updatedAt: currentSite?.updatedAt || '',
      updatedByFullName: currentSite?.updatedBy?.name || '',
      updatedIP: currentSite?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSite, site]
  );

  return (
    <Grid sx={{mt:1}}>
      <Grid container justifyContent="flex-end">
        <ViewFormEditDeleteButtons
          isActive={defaultValues?.isActive}
          handleEdit={handleEdit}
          onDelete={onDelete}
          // sites={sites}
          mainSite={customer.mainSite?._id === site?._id}
          // handleMap={handleMap}
        />
      </Grid>
      <Grid container>
        <ViewFormField isLoading={isLoading} sm={12} heading="Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Street" param={defaultValues?.street} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Suburb" param={defaultValues?.suburb} />
        <ViewFormField isLoading={isLoading} sm={6} heading="City" param={defaultValues?.city} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Region" param={defaultValues?.region} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Post Code" param={defaultValues?.postcode} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Country" param={defaultValues?.country} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Latitude" param={defaultValues?.lat} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Longitude" param={defaultValues?.long} />
        <ViewFormPhoneField isLoading={isLoading} sm={6} heading="Phone" value={defaultValues?.phoneNumbers } />
        <ViewFormField isLoading={isLoading} sm={6} heading="Email" param={defaultValues?.email} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Website" param={defaultValues?.website} />
        <Grid container>
          <ViewFormField isLoading={isLoading}
            sm={6}
            heading="Primary Billing Contact"
            param={defaultValues?.primaryBillingContact?.firstName}
            secondParam={defaultValues?.primaryBillingContact?.lastName}
          />
          <ViewFormField isLoading={isLoading}
            sm={6}
            heading="Primary Technical Contact"
            param={defaultValues?.primaryTechnicalContact?.firstName}
            secondParam={defaultValues?.primaryTechnicalContact?.lastName}
          />
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Grid>
  );
}
