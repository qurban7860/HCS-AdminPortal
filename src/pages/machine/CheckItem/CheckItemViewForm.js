import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import {  Card, Grid, Tooltip } from '@mui/material';
// redux
import { deleteCheckItem } from '../../../redux/slices/products/machineCheckItems';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
// import { fDate, fDateTime } from '../../../utils/formatTime';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
// import ViewFormSWitch from '../../components/ViewForms/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

export default function CheckItemViewForm() {
  const { checkItem } = useSelector((state) => state.checkItems);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = async () => {
    try {
      await dispatch(deleteCheckItem(checkItem?._id));
      navigate(PATH_MACHINE.machines.settings.checkItems.list);
      enqueueSnackbar('Machine Service Param deleted Successfully!');
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  const handleEdit = async () => {
    navigate(PATH_MACHINE.machines.settings.checkItems.edit(checkItem?._id));
  };

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
      utlizedInRecordConfigs:     checkItem?.serviceRecordConfigs,
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
  return (
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons handleEdit={handleEdit} onDelete={onDelete} />
        <Grid item sm={12} display="flex">
          <Tooltip>
            <ViewFormField isActive={defaultValues.isActive} isRequired={defaultValues.isRequired}/>
          </Tooltip>
        </Grid>
        <Grid container>
          <ViewFormField sm={6} heading="Name" param={defaultValues.name} />
          <ViewFormField sm={6} heading="Item Category" param={defaultValues.category} />
          <ViewFormField sm={12} heading="Print Name" param={defaultValues.printName} />
          <ViewFormField sm={12} heading="Help Hint" param={defaultValues.helpHint} />
          <ViewFormField sm={12} heading="Link To User Manual" param={defaultValues.linkToUserManual} />
          <ViewFormField sm={6} heading="Input Type" param={defaultValues.inputType} />
          <ViewFormField sm={6} heading="Unit Type" param={defaultValues.unitType} />
          <ViewFormField sm={6} heading="Minimum Validation" param={defaultValues.minValidation} />
          <ViewFormField sm={6} heading="Maximum Validation" param={defaultValues.maxValidation} />
          <ViewFormField sm={12} heading="Description" param={defaultValues.description} />
          <ViewFormField sm={12} heading="Utlized In Configs" arrayParam={defaultValues.utlizedInRecordConfigs} chipLabel='docTitle'/>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}
