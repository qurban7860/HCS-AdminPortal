import PropTypes from 'prop-types';
import { useMemo, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

// @mui
import { Grid } from '@mui/material';
// redux
import {
  setSettingEditFormVisibility,
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
      techParamCategory: currentSetting?.techParam?.category?.name || '',
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
        <ViewFormEditDeleteButtons
          disableDeleteButton={disableDeleteButton}
          disableEditButton={disableEditButton}
          handleEdit={handleEdit}
          onDelete={onDelete}
        />
      </Grid>
      <Grid container>
        <ViewFormField sm={12} isActive={defaultValues.isActive} />
        <ViewFormField sm={6} heading="Category Name" param={defaultValues?.techParamCategory} />
        <ViewFormField
          sm={6}
          heading="Paramter Name"
          param={defaultValues?.techParamName}
        />
        <ViewFormField
          sm={12}
          heading="Paramter Value"
          param={defaultValues?.techParamValue}
        />
        <ViewFormField />
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Grid>
  );
}
