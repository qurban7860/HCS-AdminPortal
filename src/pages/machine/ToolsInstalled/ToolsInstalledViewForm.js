import PropTypes from 'prop-types';
import { useMemo, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

// @mui
import { Box, Grid, Typography } from '@mui/material';
import {
  RHFSwitch,
} from '../../../components/hook-form';
// redux
import {
  setToolInstalledFormVisibility,
  setToolInstalledEditFormVisibility,
  updateToolInstalled,
  deleteToolInstalled,
  getToolsInstalled,
  getToolInstalled,
} from '../../../redux/slices/products/toolInstalled';
// paths
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';
import ConfirmDialog from '../../../components/confirm-dialog';
import { fDate, fDateTime } from '../../../utils/formatTime';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import { useSnackbar } from '../../../components/snackbar';

// ----------------------------------------------------------------------
ToolsInstalledViewForm.propTypes = {
  currentTool: PropTypes.object,
};
export default function ToolsInstalledViewForm({ currentTool = null }) {
  const {
    initial,
    error,
    responseMessage,
    toolInstalledEditFormVisibility,
    toolsInstalled,
    toolInstalled,
    formVisibility,
  } = useSelector((state) => state.toolInstalled);
  const { machine } = useSelector((state) => state.machine);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const [disableEditButton, setDisableEditButton] = useState(false);

  useLayoutEffect(() => {
    if (machine.transferredMachine) {
      setDisableDeleteButton(true);
      setDisableEditButton(true);
    } else {
      setDisableDeleteButton(false);
      setDisableEditButton(false);
    }
  }, [machine]);

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
    try {
      await dispatch(deleteToolInstalled(machine._id, currentTool._id));
      dispatch(getToolsInstalled(machine._id));
    } catch (err) {
      // if(err.Message){
      //   enqueueSnackbar(err.Message,{ variant: `error` })
      // }else if(err.message){
      //   enqueueSnackbar(err.message,{ variant: `error` })
      // }else{
      //   enqueueSnackbar("Something went wrong!",{ variant: `error` })
      // }
      enqueueSnackbar('Tool installed delete failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const handleEdit = async () => {
    await dispatch(getToolInstalled(machine._id, currentTool._id));
    dispatch(setToolInstalledEditFormVisibility(true));
  };

  const defaultValues = useMemo(
    () => ({
      toolName: currentTool?.tool?.name || '',  
      offset: currentTool?.offset || '',
      wasteTriggerDistance: currentTool?.wasteTriggerDistance || '',
      crimpTriggerDistance: currentTool?.crimpTriggerDistance || '',
      isApplyWaste: currentTool?.isApplyWaste || false,
      isApplyCrimp: currentTool?.isApplyCrimp || false,
      isBackToBackPunch: currentTool?.isBackToBackPunch || false,
      isManualSelect: currentTool?.isManualSelect || false,  
      isAssign: currentTool?.isAssign || false,
      operations: currentTool?.operations || '',
      toolType: currentTool?.toolType || '',
      isActive: currentTool?.isActive,
      createdAt: currentTool?.createdAt || '',
      createdByFullName: currentTool?.createdBy?.name || '',
      createdIP: currentTool?.createdIP || '',
      updatedAt: currentTool?.updatedAt || '',
      updatedByFullName: currentTool?.updatedBy?.name || '',
      updatedIP: currentTool?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTool, machine]
  );

  return (
    <Grid>
      <Grid container justifyContent="flex-end" sx={{ pr: '2rem' }}>
        <ViewFormEditDeleteButtons
          disableDeleteButton={disableDeleteButton}
          disableEditButton={disableEditButton}
          handleEdit={handleEdit}
          onDelete={onDelete}
        />
      </Grid>
      <Grid container>
        <ViewFormField sm={12} isActive={defaultValues.isActive} />
        <ViewFormField
          sm={6}
          heading="Tool"
          param={defaultValues?.toolName}
        />

        <ViewFormField
          sm={6}
          heading="Tool Type"
          param={defaultValues?.toolType}
        />

        <ViewFormField
          sm={6}
          heading="Offset"
          param={defaultValues?.offset}
        />

        <ViewFormField
          sm={6}
          heading="Waste Trigger Distance"
          param={defaultValues?.wasteTriggerDistance}
        />

        <ViewFormField
          sm={6}
          heading="Crimp Trigger Distance"
          param={defaultValues?.crimpTriggerDistance}
        />
        
        <ViewFormField
          sm={6}
          heading="Operations"
          param={defaultValues?.operations}
        />
        <Box
        rowGap={0}
        columnGap={1}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(3, 1fr)',
        }}
        >
        {/* <RHFSwitch
          value={defaultValues?.isApplyWaste}
          labelPlacement="start"
          label={
            <Typography
              variant="subtitle2"
              sx={{
                mx: 0,
                width: 1,
                justifyContent: 'space-between',
                mb: 0.5,
                color: 'text.secondary',
              }}
            >
              {' '}
              Apply Waste
            </Typography>
          }
        /> 
         <RHFSwitch
          name="isApplyCrimp"
          labelPlacement="start"
          label={
            <Typography
              variant="subtitle2"
              sx={{
                mx: 0,
                width: 1,
                justifyContent: 'space-between',
                mb: 0.5,
                color: 'text.secondary',
              }}
            >
              {' '}
              Apply Crimp
            </Typography>
          }
        />

        <RHFSwitch
          name="isBackToBackPunch"
          labelPlacement="start"
          label={
            <Typography
              variant="subtitle2"
              sx={{
                mx: 0,
                width: 1,
                justifyContent: 'space-between',
                mb: 0.5,
                color: 'text.secondary',
              }}
            >
              {' '}
              Back To Back Punch
            </Typography>
          }
        />
        <RHFSwitch
          name="isManualSelect"
          labelPlacement="start"
          label={
            <Typography
              variant="subtitle2"
              sx={{
                mx: 0,
                width: 1,
                justifyContent: 'space-between',
                mb: 0.5,
                color: 'text.secondary',
              }}
            >
              {' '}
              Manual Select
            </Typography>
          }
        />
        <RHFSwitch
          name="isAssign"
          labelPlacement="start"
          label={
            <Typography
              variant="subtitle2"
              sx={{
                mx: 0,
                width: 1,
                justifyContent: 'space-between',
                mb: 0.5,
                color: 'text.secondary',
              }}
            >
              {' '}
              Assign
            </Typography>
          }
        /> */}

        </Box>

        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Grid>
  );
}
