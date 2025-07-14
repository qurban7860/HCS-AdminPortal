import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Grid } from '@mui/material';
// redux
import {
  archiveSite,
  getSite,
  getSites,
  resetSite,
  setIsExpanded,
  setCardActiveIndex,
} from '../../../redux/slices/customer/site';
import { useSnackbar } from '../../../components/snackbar';
// paths
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewPhoneComponent from '../../../components/ViewForms/ViewPhoneComponent';
import { PATH_CRM } from '../../../routes/paths';

// ----------------------------------------------------------------------

SiteViewForm.propTypes = {
  handleMap: PropTypes.func,
  isCustomerSitePage: PropTypes.bool
};
export default function SiteViewForm({ handleMap, isCustomerSitePage }) {

  const { site, isLoading } = useSelector((state) => state.site);
  const { customer } = useSelector((state) => state.customer);
  const { enqueueSnackbar } = useSnackbar();
  const { customerId, id } = useParams()

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getSite(customerId, id))
    dispatch(setIsExpanded(true))
    dispatch(setCardActiveIndex(id))
    return () => {
      dispatch(resetSite())
      dispatch(setIsExpanded(false))
      dispatch(setCardActiveIndex(null))
    }
  }, [dispatch, customerId, id])

  const backLink = () => navigate(PATH_CRM.customers.sites.root(customerId, id));
  
  const onArchive = async () => {
    try {
      await dispatch(archiveSite(customerId, id));
      await dispatch(getSites(customerId));
      await dispatch(setIsExpanded(false));
      enqueueSnackbar('Site Archived Successfully!');
      navigate(PATH_CRM.customers.archivedSites.root);
    } catch (err) {
      enqueueSnackbar(err, { variant: `error` });
      console.log(err);
    }
  };

  const handleEdit = async () => { if (customerId && id) navigate(PATH_CRM.customers.sites.edit(customerId, id)) };

  const defaultValues = useMemo(
    () => ({
      name: site?.name || '',
      customer: site?.tradingName || '',
      billingSite: site?.accountManager || '',
      phoneNumbers: site?.phoneNumbers || '',
      email: site?.email || '',
      website: site?.website || '',
      lat: site?.lat || '',
      long: site?.long || '',
      street: site?.address?.street || '',
      suburb: site?.address?.suburb || '',
      city: site?.address?.city || '',
      postcode: site?.address?.postcode || '',
      region: site?.address?.region || '',
      country: site?.address?.country || '',
      primaryBillingContact: site?.primaryBillingContact || null,
      primaryTechnicalContact: site?.primaryTechnicalContact || null,
      isActive: site?.isActive,
      createdAt: site?.createdAt || '',
      createdByFullName: site?.createdBy?.name || '',
      createdIP: site?.createdIP || '',
      updatedAt: site?.updatedAt || '',
      updatedByFullName: site?.updatedBy?.name || '',
      updatedIP: site?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [site]
  );

  return (
    <Grid sx={{ mt: 1 }}>
      <Grid container justifyContent="flex-end">
        <ViewFormEditDeleteButtons
          isActive={defaultValues?.isActive}
          handleEdit={customer?.isArchived ? undefined : handleEdit}
          onArchive={customer?.isArchived ? undefined : onArchive}
          backLink={isCustomerSitePage && !customer?.isArchived ? backLink : undefined}
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
        <ViewPhoneComponent isLoading={isLoading} sm={6} heading="Phone" value={defaultValues?.phoneNumbers} />

        <ViewFormField isLoading={isLoading} sm={6} heading="Email" param={defaultValues?.email} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Website" param={defaultValues?.website} />
        <Grid container>
          <ViewFormField isLoading={isLoading}
            sm={6}
            heading="Primary Billing Contact"
            param={`${defaultValues?.primaryBillingContact?.firstName || ""} ${defaultValues?.primaryBillingContact?.lastName || ""}`}
          />
          <ViewFormField isLoading={isLoading}
            sm={6}
            heading="Primary Technical Contact"
            param={`${defaultValues?.primaryTechnicalContact?.firstName || ""} ${defaultValues?.primaryTechnicalContact?.lastName || ""}`}
          />
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Grid>
  );
}
