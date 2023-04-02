import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

// @mui
import { Card, Grid, Stack, Typography, Button } from '@mui/material';
// redux

// paths
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';
import ConfirmDialog from '../../../components/confirm-dialog';
import { setSettingEditFormVisibility , setSettingFormVisibility , saveSetting , deleteSetting , getSettings , getSetting } from '../../../redux/slices/products/machineTechParamValue';
import { fDate,fDateTime } from '../../../utils/formatTime';

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
    await dispatch(deleteSetting(machine._id, currentSetting._id));
    handleCloseConfirm();
    dispatch(getSettings(machine._id));
    // dispatch(getContacts());
  };

  const  handleEdit = async () => {
    await dispatch(getSetting(machine._id, currentSetting._id));
    dispatch(setSettingEditFormVisibility (true));
  };


  const defaultValues = useMemo(
    () => (
      {
        techParamName: currentSetting?.techParam?.name || "",
        techParamCode: currentSetting?.techParam?.code || "",
        techParamValue: currentSetting?.techParamValue || "",
        createdAt:                currentSetting?.createdAt || "",
        createdByFullname:           currentSetting?.createdBy?.name || "",
        createdIP:                currentSetting?.createdIP || "",
        updatedAt:                currentSetting?.updatedAt || "",
        updatedByFullname:           currentSetting?.updatedBy?.name || "",
        updatedIP:                currentSetting?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSetting, machine]
  );

  return (
    <Grid sx={{ p: 2 }}>
      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mb: -4 }}>
        <Button
          onClick={() => handleEdit()}
          variant="outlined"
          startIcon={<Iconify icon="eva:edit-fill" />}
        >
          Edit
        </Button>
        <Button
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          variant="outlined"
          color="error"
          startIcon={<Iconify icon="eva:trash-2-fill" />}
        >
          Delete
        </Button>
      </Stack>
      <Grid container>

          <Grid item xs={12} sm={6} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Technical Perameter 
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.techParamName ? defaultValues.techParamName : ''}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Technical Perameter Code
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.techParamCode ? defaultValues.techParamCode : ''}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Technical Perameter Value
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.techParamValue ? defaultValues.techParamValue : ''}
            </Typography>
          </Grid>

          <Grid container spacing={0} sx={{ mb:-3,  pt:4}}>
            <Grid item xs={12} sm={6} >
              <Typography paragraph variant="body2" sx={{ color: 'text.disabled' }}>
                created by: {defaultValues.createdByFullname}, {fDate(defaultValues.createdAt)}, {defaultValues.createdIP}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} >
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              updated by: {defaultValues.updatedByFullname}, {fDate(defaultValues.updatedAt)}, {defaultValues.updatedIP}
            </Typography>
            </Grid>
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
