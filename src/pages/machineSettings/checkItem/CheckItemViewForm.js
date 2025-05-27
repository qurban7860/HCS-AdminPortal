import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import {  Card, Grid, Typography } from '@mui/material';
// redux
import { deleteCheckItem } from '../../../redux/slices/products/machineCheckItems';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

export default function CheckItemViewForm() {
  const { checkItem, isLoading } = useSelector((state) => state.checkItems);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = async () => {
    try {
      await dispatch(deleteCheckItem(checkItem?._id));
      navigate(PATH_MACHINE.machineSettings.checkItems.root);
      enqueueSnackbar('Check item Archived Successfully!');
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  const handleEdit = async () => navigate(PATH_MACHINE.machineSettings.checkItems.edit(checkItem?._id));

  const defaultValues = useMemo(
    () => ({
      name:                       checkItem?.name,
      category:                   checkItem?.category?.name,
      printName:                  checkItem?.printName,
      helpHint:                   checkItem?.helpHint,
      linkToUserManual:           checkItem?.linkToUserManual,
      inputType:                  checkItem?.inputType,
      unitType:                   checkItem?.unitType,    
      minValidation:              checkItem?.minValidation,
      maxValidation:              checkItem?.maxValidation,
      description:                checkItem?.description,
      utlizedInReportConfigs:     checkItem?.serviceReportTemplates,
      isRequired:                 checkItem?.isRequired || false, 
      isActive:                   checkItem?.isActive,
      createdAt:                  checkItem?.createdAt || '',
      createdByFullName:          checkItem?.createdBy?.name || '',
      createdIP:                  checkItem?.createdIP || '',
      updatedAt:                  checkItem?.updatedAt || '',
      updatedByFullName:          checkItem?.updatedBy?.name || '',
      updatedIP:                  checkItem?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ checkItem ]
  );

  const configArrayChips = defaultValues.utlizedInReportConfigs.map((item) => <div style={{display:'flex',alignItems:'center'}}  ><Typography variant='body2'>{`${item?.reportTitle || ''}`}</Typography> <Typography variant='subtitle2'>{` - v${item?.docVersionNo}`}</Typography></div>);

  return (
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons 
          isActive={defaultValues.isActive} 
          isRequired={defaultValues.isRequired} 
          handleEdit={handleEdit} 
          onDelete={onDelete} 
          backLink={() => navigate(PATH_MACHINE.machineSettings.checkItems.root)}  
          machineSettingPage
        />
        <Grid container sx={{mt:2}}>
          <ViewFormField isLoading={isLoading} sm={12} heading="Item Category" param={defaultValues.category} />
          <ViewFormField isLoading={isLoading} sm={12} heading="Name" param={defaultValues.name} />
          <ViewFormField isLoading={isLoading} sm={12} heading="Print Name" param={defaultValues.printName} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Help Hint" param={defaultValues.helpHint} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Link To User Manual" param={defaultValues.linkToUserManual} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Input Type" param={defaultValues.inputType} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Unit Type" param={defaultValues.unitType} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Minimum Validation" param={defaultValues.minValidation} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Maximum Validation" param={defaultValues.maxValidation} />
          <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues.description} />
          <ViewFormField isLoading={isLoading} sm={12} heading="Utlized In Configs" chips={configArrayChips} />
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}
