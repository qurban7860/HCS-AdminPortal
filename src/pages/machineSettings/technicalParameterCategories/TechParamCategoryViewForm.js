import { useMemo, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import {  Card, Grid } from '@mui/material';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
// Iconify
import { getTechparamcategory, deleteTechparamcategory } from '../../../redux/slices/products/machineTechParamCategory';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../../components/ViewForms/ViewFormField';

// ----------------------------------------------------------------------

export default function TechParamCategoryViewForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { techparamcategory, isLoading } = useSelector((state) => state.techparamcategory);
  const { id } = useParams();
  
  useLayoutEffect(()=>{
    dispatch(getTechparamcategory(id))
  },[ dispatch, id ])

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
    [ techparamcategory ]
    );

  const toggleEdit = () => navigate(PATH_MACHINE.machines.machineSettings.technicalParameterCategories.edit(id));
  const onDelete = async () => {
    try {
      await dispatch(deleteTechparamcategory(techparamcategory._id));
      enqueueSnackbar('Archived Successfully!');
      navigate(PATH_MACHINE.machines.machineSettings.technicalParameterCategories.root);
    } catch (err) {

      enqueueSnackbar('Techparam category Archive failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };
  return (
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons 
        isActive={defaultValues.isActive} 
        handleEdit={toggleEdit} 
        onDelete={onDelete} 
        backLink={() => navigate(PATH_MACHINE.machines.machineSettings.technicalParameterCategories.root)}  
        machineSettingPage
      />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={12} heading="Param Category Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues?.description} />
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}
