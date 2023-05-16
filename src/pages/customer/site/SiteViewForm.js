import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

// @mui
import { Switch,Card, Grid, Stack, Typography, Button } from '@mui/material';
// redux
import { deleteSite, getSite, getSites, setSiteEditFormVisibility } from '../../../redux/slices/customer/site';

// paths
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';
import ConfirmDialog from '../../../components/confirm-dialog';

import { fDate,fDateTime } from '../../../utils/formatTime';
import ViewFormAudit from '../../components/ViewFormAudit';
import ViewFormField from '../../components/ViewFormField';
import ViewFormSwitch from '../../components/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------
SiteViewForm.propTypes = {
  currentSite: PropTypes.object,
};

export default function SiteViewForm({ currentSite = null }) {

  const { site } = useSelector((state) => state.site);
  const { customer } = useSelector((state) => state.customer);
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const onDelete = async () => {
    await dispatch(deleteSite(customer._id, currentSite._id));
    handleCloseConfirm();
    dispatch(getSites(customer._id));
    // dispatch(getContacts());
  };

  const  handleEdit = async () => {
    await dispatch(getSite(customer._id, currentSite._id));
    dispatch(setSiteEditFormVisibility(true));
  };
  
  const defaultValues = useMemo(
    () => (
      {
        id: currentSite ? currentSite._id : site?._id || '',
        name: currentSite ? currentSite.name : site?.name || '',
        customer: currentSite ? currentSite.name : site?.tradingName || '',
        billingSite: currentSite ? currentSite._id : site?.accountManager || '',
        phone: currentSite ? currentSite.phone : site?.phone || '',
        email: currentSite ? currentSite.email : site?.email || '',
        fax: currentSite ? currentSite.fax : site?.fax || '',
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
        isActive: currentSite.isActive,
        createdAt:                currentSite?.createdAt || "",
        createdByFullName:           currentSite?.createdBy?.name || "",
        createdIP:                currentSite?.createdIP || "",
        updatedAt:                currentSite?.updatedAt || "",
        updatedByFullName:           currentSite?.updatedBy?.name || "",
        updatedIP:                currentSite?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSite, site]
  );

  return (
    <Grid >
            <ViewFormEditDeleteButtons handleEdit={handleEdit} onDelete={onDelete} />

      {/* <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mb: -4 }}>
        <Button onClick={() => handleEdit()} variant="outlined" startIcon={<Iconify icon="eva:edit-fill" />} >
          Edit
        </Button>
        <Button onClick={() => { handleOpenConfirm(); handleClosePopover(); }} variant="outlined" color="error" startIcon={<Iconify icon="eva:trash-2-fill" />} >
          Delete
        </Button>
      </Stack> */}
      <Grid container>
        <ViewFormField sm={6}   heading='Name'       param={defaultValues?.name}     isActive={defaultValues.isActive}/>
        <ViewFormField sm={6}   heading='Phone'       param={defaultValues?.phone} />
        <ViewFormField sm={6}   heading='Fax'       param={defaultValues?.fax} />
        <ViewFormField sm={6}   heading='Email'       param={defaultValues?.email} />
        <ViewFormField sm={6}   heading='Website'       param={defaultValues?.website} />
        <ViewFormField sm={6}   heading='Street'       param={defaultValues?.street} />
        <ViewFormField sm={6}   heading='Suburb'       param={defaultValues?.suburb} />
        <ViewFormField sm={6}   heading='City'       param={defaultValues?.city} />
        <ViewFormField sm={6}   heading='Region'       param={defaultValues?.region} />
        <ViewFormField sm={6}   heading='Post Code'       param={defaultValues?.postcode} />
        <ViewFormField sm={6}   heading='Country'       param={defaultValues?.country} />

          <Grid container>
            <ViewFormField sm={6}   heading='Latitude'       param={defaultValues?.lat}/>
            <ViewFormField sm={6}   heading='Longitude'       param={defaultValues?.long} />
          </Grid>

           <Grid container>
            <ViewFormField sm={6}   heading='Primary Billing Contact'       param={defaultValues?.primaryBillingContact?.firstName} secondparam={defaultValues?.primaryBillingContact?.lastName}/>
            <ViewFormField sm={6}   heading='Primary Technical Contact'       param={defaultValues?.primaryTechnicalContact?.firstName} secondparam={defaultValues?.primaryTechnicalContact?.lastName}/>
          </Grid>
            <ViewFormSwitch isActive={defaultValues.isActive}/>
          <Grid container>
            <ViewFormAudit defaultValues={defaultValues}/>
          </Grid>
        <ConfirmDialog
            open={openConfirm}
            onClose={handleCloseConfirm}
            title="Delete"
            content="Are you sure want to delete?"
            action={
              <Button variant="contained" color="error" onClick={onDelete}>
                Delete
              </Button>
            }
          />

      </Grid>
    </Grid>
  );
}
