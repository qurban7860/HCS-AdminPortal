import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
// @mui
import {  Card, Grid } from '@mui/material';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
// Iconify
import { deleteTechparamcategory } from '../../../redux/slices/products/machineTechParamCategory';
// import { fDate } from '../../../utils/formatTime';
// import Iconify from '../../../components/iconify/Iconify';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../components/ViewForms/ViewFormField';
// ----------------------------------------------------------------------

TechParamCategoryViewForm.propTypes = {
  currentTechparamcategory: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function TechParamCategoryViewForm({ currentTechparamcategory = null }) {
  const toggleEdit = () => {
    navigate(PATH_MACHINE.machines.settings.technicalParameterCategories.edit(id));
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { techparamcategory } = useSelector((state) => state.techparamcategory);

  const { id } = useParams();

  const defaultValues = useMemo(
    () => ({
      name: techparamcategory?.name || '',
      description: techparamcategory?.description || '',
      isActive: techparamcategory.isActive,
      createdAt: techparamcategory?.createdAt || '',
      createdByFullName: techparamcategory?.createdBy?.name || '',
      createdIP: techparamcategory?.createdIP || '',
      updatedAt: techparamcategory?.updatedAt || '',
      updatedByFullName: techparamcategory?.updatedBy?.name || '',
      updatedIP: techparamcategory?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTechparamcategory, techparamcategory]
  );
  const onDelete = async () => {
    try {
      await dispatch(deleteTechparamcategory(techparamcategory._id));
      enqueueSnackbar('Deleted Successfully!');
      navigate(PATH_MACHINE.machines.settings.technicalParameterCategories.list);
    } catch (err) {

      enqueueSnackbar('Techparam category delete failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };
  return (
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons handleEdit={toggleEdit} onDelete={onDelete} />
      <Grid container>
      <ViewFormField sm={12} isActive={defaultValues.isActive}/>
        <ViewFormField sm={12} heading="Param Category Name" param={defaultValues?.name} />
        <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
          <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}
