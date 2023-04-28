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
import { setLicenseEditFormVisibility, setLicenseFormVisibility , updateLicense , getLicenses , getLicense, deleteLicense } from '../../../redux/slices/products/license';

import { fDate,fDateTime } from '../../../utils/formatTime';
import ViewFormAudit from '../../components/ViewFormAudit';

// ----------------------------------------------------------------------
LicenseViewForm.propTypes = {
  currentLicense: PropTypes.object,
};

export default function LicenseViewForm({ currentLicense = null }) {

  const { initial,error, responseMessage , licenseEditFormVisibility ,licenses, license, formVisibility } = useSelector((state) => state.license);
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
    await dispatch(deleteLicense(machine._id, currentLicense._id));
    handleCloseConfirm();
    dispatch(getLicenses(machine._id));
    // dispatch(getContacts());
  };

  const  handleEdit = async () => {
    await dispatch(getLicense(machine._id, currentLicense._id));
    dispatch(setLicenseEditFormVisibility (true));
  };


  const defaultValues = useMemo(
    () => (
      {
        licenseDetail:            currentLicense?.licenseDetail || "",
        createdByFullname:        currentLicense?.createdBy?.name || "",
        createdAt:                currentLicense?.createdAt || "",
        createdIP:                currentLicense?.createdIP || "",
        updatedByFullname:        currentLicense?.updatedBy?.name || "",
        updatedAt:                currentLicense?.updatedAt || "",
        updatedIP:                currentLicense?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLicense, machine]
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

          <Grid container>
          <ViewFormAudit defaultValues={defaultValues}/>
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
