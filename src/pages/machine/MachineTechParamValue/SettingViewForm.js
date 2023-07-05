import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

// @mui
import { Switch, Card, Grid, Stack, Typography, Button } from '@mui/material';
// redux
import {
  setSettingEditFormVisibility,
  setSettingFormVisibility,
  deleteSetting,
  getSettings,
  getSetting,
} from '../../../redux/slices/products/machineTechParamValue';
// paths
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { fDate, fDateTime } from '../../../utils/formatTime';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormSWitch from '../../components/ViewForms/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import { useSnackbar } from '../../../components/snackbar';

// ----------------------------------------------------------------------
SettingViewForm.propTypes = {
  currentSetting: PropTypes.object,
};

export default function SettingViewForm({ currentSetting = null }) {
  const { machine } = useSelector((state) => state.machine);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

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
      await dispatch(deleteSetting(machine._id, currentSetting._id));
      handleCloseConfirm();
      dispatch(getSettings(machine._id));
      // dispatch(getContacts());
    } catch (err) {
      // if(err.Message){
      //   enqueueSnackbar(err.Message,{ variant: `error` })
      // }else if(err.message){
      //   enqueueSnackbar(err.message,{ variant: `error` })
      // }else{
      //   enqueueSnackbar("Something went wrong!",{ variant: `error` })
      // }
      enqueueSnackbar('Settings delete failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const handleEdit = async () => {
    await dispatch(getSetting(machine._id, currentSetting._id));
    dispatch(setSettingEditFormVisibility(true));
  };

  const defaultValues = useMemo(
    () => ({
      techParamName: currentSetting?.techParam?.name || '',
      techParamCode: currentSetting?.techParam?.code || '',
      techParamValue: currentSetting?.techParamValue || '',
      isActive: currentSetting?.isActive,
      createdAt: currentSetting?.createdAt || '',
      createdByFullName: currentSetting?.createdBy?.name || '',
      createdIP: currentSetting?.createdIP || '',
      updatedAt: currentSetting?.updatedAt || '',
      updatedByFullName: currentSetting?.updatedBy?.name || '',
      updatedIP: currentSetting?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSetting, machine]
  );

  return (
    <Grid>
      <Grid container justifyContent="flex-end" sx={{ pr: '2rem' }}>
        <ViewFormEditDeleteButtons handleEdit={handleEdit} onDelete={onDelete} />
      </Grid>
      <Grid container>
        <ViewFormField sm={12} isActive={defaultValues.isActive} />
        <ViewFormField sm={6} heading="Technical Perameter" param={defaultValues?.techParamName} />
        <ViewFormField
          sm={6}
          heading="Technical Perameter Code"
          param={defaultValues?.techParamCode}
        />
        <ViewFormField
          sm={12}
          heading="Technical Perameter Value"
          param={defaultValues?.techParamValue}
        />
        <ViewFormField />
        {/* <ViewFormSWitch isActive={defaultValues.isActive}/> */}
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Grid>
  );
}
