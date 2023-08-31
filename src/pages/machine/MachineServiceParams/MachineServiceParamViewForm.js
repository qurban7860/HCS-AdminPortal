import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Switch, Card, Grid, Stack, Typography, Button, Tooltip } from '@mui/material';
// redux
import { deleteMachineServiceParam } from '../../../redux/slices/products/machineServiceParams';
// paths
import { PATH_MACHINE, PATH_SETTING } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import { fDate, fDateTime } from '../../../utils/formatTime';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormSWitch from '../../components/ViewForms/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

export default function MachineServiceParamViewForm() {
  const { machineServiceParam } = useSelector((state) => state.machineServiceParam);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = async () => {
    try {
      await dispatch(deleteMachineServiceParam(machineServiceParam?._id));
      navigate(PATH_MACHINE.machines.settings.machineServiceParams.list);
      enqueueSnackbar('Machine Service Param deleted Successfully!');
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  const handleEdit = async () => {
    navigate(PATH_MACHINE.machines.settings.machineServiceParams.edit(machineServiceParam?._id));
  };

  const defaultValues = useMemo(
    () => ({
      name:               machineServiceParam?.name,
      printName:          machineServiceParam?.printName,
      helpHint:           machineServiceParam?.helpHint,
      linkToUserManual:   machineServiceParam?.linkToUserManual,
      inputType:          machineServiceParam?.inputType,
      unitType:           machineServiceParam?.unitType,    
      minValidation:      machineServiceParam?.minValidation,
      maxValidation:      machineServiceParam?.maxValidation,
      description:        machineServiceParam?.description,
      isRequired:         machineServiceParam?.isRequired || false, 
      isActive:           machineServiceParam?.isActive,
      createdAt:          machineServiceParam?.createdAt || '',
      createdByFullName:  machineServiceParam?.createdBy?.name || '',
      createdIP:          machineServiceParam?.createdIP || '',
      updatedAt:          machineServiceParam?.updatedAt || '',
      updatedByFullName:  machineServiceParam?.updatedBy?.name || '',
      updatedIP:          machineServiceParam?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ machineServiceParam ]
  );
  return (
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons handleEdit={handleEdit} onDelete={onDelete} />
        <Grid sm={12} display="flex">
          <Tooltip>
            <ViewFormField isActive={defaultValues.isActive} isRequired={defaultValues.isRequired}/>
          </Tooltip>
        </Grid>
        <Grid container>
          <ViewFormField sm={6} heading="Name" param={defaultValues.name} />
          <ViewFormField sm={6} heading="Print Name" param={defaultValues.printName} />
          <ViewFormField sm={6} heading="Help Hint" param={defaultValues.helpHint} />
          <ViewFormField sm={6} heading="Link To User Manual" param={defaultValues.linkToUserManual} />
          <ViewFormField sm={6} heading="Input Type" param={defaultValues.inputType} />
          <ViewFormField sm={6} heading="Unit Type" param={defaultValues.unitType} />
          <ViewFormField sm={6} heading="Min Validation" param={defaultValues.minValidation} />
          <ViewFormField sm={6} heading="Max Validation" param={defaultValues.maxValidation} />
          <ViewFormField sm={12} heading="Description" param={defaultValues.description} />
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}
