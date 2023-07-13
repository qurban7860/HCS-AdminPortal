import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Card, Grid, Stack, Typography, Button } from '@mui/material';
// hooks
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from '../../../components/snackbar';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import Iconify from '../../../components/iconify';
import ConfirmDialog from '../../../components/confirm-dialog';
import {
  setLicenseEditFormVisibility,
  getLicenses,
  getLicense,
  deleteLicense,
} from '../../../redux/slices/products/license';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
// constants
import { DIALOGS } from '../../../constants/default-constants';
import { Snacks } from '../../../constants/machine-constants';

// ----------------------------------------------------------------------
LicenseViewForm.propTypes = {
  currentLicense: PropTypes.object,
};

export default function LicenseViewForm({ currentLicense = null }) {
  // const {
  //   initial,
  //   error,
  //   responseMessage,
  //   licenseEditFormVisibility,
  //   licenses,
  //   license,
  //   formVisibility,
  // } = useSelector((state) => state.license);

  const { machine } = useSelector((state) => state.machine);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      await dispatch(deleteLicense(machine._id, currentLicense._id));
      handleCloseConfirm();
      dispatch(getLicenses(machine._id));
      // dispatch(getContacts());
    } catch (err) {
      enqueueSnackbar(Snacks.failedDeleteLicense, { variant: `error` });
      console.log('Error:', err);
    }
  };

  const handleEdit = async () => {
    await dispatch(getLicense(machine._id, currentLicense._id));
    dispatch(setLicenseEditFormVisibility(true));
  };

  const defaultValues = useMemo(
    () => ({
      licenseDetail: currentLicense?.licenseDetail || '',
      createdByFullName: currentLicense?.createdBy?.name || '',
      createdAt: currentLicense?.createdAt || '',
      createdIP: currentLicense?.createdIP || '',
      updatedByFullName: currentLicense?.updatedBy?.name || '',
      updatedAt: currentLicense?.updatedAt || '',
      updatedIP: currentLicense?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLicense, machine]
  );

  return (
    // needs cleanup
    <Grid sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons
        sx={{ pt: 5 }}
        handleEdit={handleEdit}
        onDelete={() => {
          handleOpenConfirm();
          handleClosePopover();
        }}
      />

      <Grid container>
        <Grid item xs={12} sm={6} sx={{ pt: 2 }}>
          <Grid item xs={12} sm={12}>
            <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Technical Perameter
            </Typography>
          </Grid>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
            {defaultValues.techParamName ? defaultValues.techParamName : ''}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} sx={{ pt: 2 }}>
          <Grid item xs={12} sm={12}>
            <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Technical Perameter Code
            </Typography>
          </Grid>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
            {defaultValues.techParamCode ? defaultValues.techParamCode : ''}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} sx={{ pt: 2 }}>
          <Grid item xs={12} sm={12}>
            <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Technical Perameter Value
            </Typography>
          </Grid>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
            {defaultValues.techParamValue ? defaultValues.techParamValue : ''}
          </Typography>
        </Grid>

        <Grid container>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>

        <ConfirmDialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          title={DIALOGS.DELETE.title}
          content={DIALOGS.DELETE.content}
          action={
            <Button variant="contained" color="error" onClick={onDelete}>
              {DIALOGS.DELETE.title}
            </Button>
          }
        />
      </Grid>
    </Grid>
  );
}
