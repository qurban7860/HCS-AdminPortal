import PropTypes from 'prop-types';
import { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import {  Card, Grid } from '@mui/material';
// redux
import {
  getSupplier,
  deleteSupplier,
} from '../../../redux/slices/products/supplier';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
// Iconify
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../components/ViewForms/ViewFormField';

// ----------------------------------------------------------------------

SupplierViewForm.propTypes = {
  currentSupplier: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function SupplierViewForm({ currentSupplier = null }) {

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { supplier, isLoading } = useSelector((state) => state.supplier);
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const toggleEdit = () => {
    navigate(PATH_MACHINE.machines.settings.supplier.supplieredit(id));
  };

  useLayoutEffect(() => {
    if (id != null) {
      dispatch(getSupplier(id));
    }
  }, [dispatch, id]);

  // const  handleEdit = async () => {
  //   await dispatch(getSuppliers(currentSupplier._id));
  //   // dispatch(setEditFormVisibility(true));
  // };

  const defaultValues = useMemo(
    () => ({
      name: supplier?.name || '',
      contactName: supplier?.contactName || '',
      contactTitle: supplier?.contactTitle || '',
      phone: supplier?.phone || '',
      email: supplier?.email || '',
      fax: supplier?.fax || '',
      website: supplier?.website || '',
      street: supplier?.address?.street || '',
      suburb: supplier?.address?.suburb || '',
      city: supplier?.address?.city || '',
      postcode: supplier?.address?.postcode || '',
      region: supplier?.address?.region || '',
      country: supplier?.address?.country || '',
      isActive: supplier?.isActive,
      createdByFullName: supplier?.createdBy?.name || '',
      createdAt: supplier?.createdAt || '',
      createdIP: supplier?.createdIP || '',
      updatedByFullName: supplier?.updatedBy?.name || '',
      updatedAt: supplier?.updatedAt || '',
      updatedIP: supplier?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSupplier, supplier]
  );
  const onDelete = async () => {
    try {
      await dispatch(deleteSupplier(id));
      enqueueSnackbar('Supplier Deleted Successfully!');
      navigate(PATH_MACHINE.machines.settings.supplier.list);
    } catch (err) {
      enqueueSnackbar('Supplier Delete failed!', { variant: `error` } );
      console.log('Error:', err);
    }
  };
  return (
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons isActive={defaultValues.isActive} handleEdit={toggleEdit} onDelete={onDelete} backLink={() => navigate(PATH_MACHINE.machines.settings.supplier.list)}  />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={12} heading="Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Contact Name" param={defaultValues?.contactName} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Contact Title" param={defaultValues?.contactTitle} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Phone" param={defaultValues?.phone} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Fax" param={defaultValues?.fax} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Email" param={defaultValues?.email} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Website" param={defaultValues?.website} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Street" param={defaultValues?.street} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Suburb" param={defaultValues?.suburb} />
        <ViewFormField isLoading={isLoading} sm={6} heading="City" param={defaultValues?.city} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Post Code" param={defaultValues?.postcode} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Region" param={defaultValues?.region} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Country" param={defaultValues?.country} />

        <Grid container sx={{ mt: 2 }}>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}
