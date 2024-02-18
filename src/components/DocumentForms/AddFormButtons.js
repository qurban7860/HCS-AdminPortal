import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { useState, useLayoutEffect } from 'react';
import { Button, Grid, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../confirm-dialog';
import { BUTTONS, DIALOGS } from '../../constants/default-constants';
import { useAuthContext } from '../../auth/useAuthContext';
import { PATH_DASHBOARD } from '../../routes/paths';

AddFormButtons.propTypes = {
  saveAsDraft: PropTypes.func,
  isDraft: PropTypes.bool,
  saveAsDraftButtonName: PropTypes.string,
  saveButtonName: PropTypes.string,
  cancelButtonName: PropTypes.string,
  toggleCancel: PropTypes.func,
  isSubmitting: PropTypes.bool,
  isDisabled: PropTypes.bool,
  machineSettingPage: PropTypes.bool,
  settingPage: PropTypes.bool,
  securityUserPage: PropTypes.bool,
  machinePage: PropTypes.bool,
  customerPage: PropTypes.bool,
  drawingPage: PropTypes.bool,
};

export default function AddFormButtons({
  saveAsDraft,
  isDraft,
  saveAsDraftButtonName,
  saveButtonName,
  toggleCancel,
  isSubmitting,
  cancelButtonName,
  isDisabled,
  machineSettingPage,
  settingPage,
  securityUserPage,
  machinePage,
  customerPage,
  drawingPage,
}) {
  const navigate = useNavigate()
  const [openConfirm, setOpenConfirm] = useState(false);
  const { isSettingReadOnly, isSecurityReadOnly, isDocumentAccessAllowed, isDrawingAccessAllowed } = useAuthContext();
  
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    // toggleCancel();
  };
  const onConfirm = () => {
    setOpenConfirm(false);
    toggleCancel();
  };

  useLayoutEffect(()=>{
    if(( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly || !isDocumentAccessAllowed || !isDrawingAccessAllowed )){
      navigate(PATH_DASHBOARD.general.app)
    }
  },[ 
    machineSettingPage, 
    settingPage, 
    securityUserPage, 
    drawingPage, 
    isSettingReadOnly, 
    isSecurityReadOnly, 
    isDocumentAccessAllowed, 
    isDrawingAccessAllowed ,
    navigate
  ])

  return (
    <>
      <Stack justifyContent="flex-end" direction="row" spacing={2}>
        <Grid item lg={saveAsDraft ? 6 : 4} md={saveAsDraft ? 8 : 4} sm={saveAsDraft ? 10 : 6} xs={12}>
          <Stack justifyContent="flex-end" direction="row" spacing={2}>
          {saveAsDraft && <Grid item sm={6}>
              <LoadingButton
                sx={{textTransform: 'none'}}
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                // disabled={isDisabled || ( ( machineSettingPage || settingPage || securityUserPage || drawingPage ) && ( isSettingReadOnly || isSecurityReadOnly || !isDocumentAccessAllowed || !isDrawingAccessAllowed ))}
                disabled
                loading={isDraft && isSubmitting}
                onClick={saveAsDraft}
              >
                {saveAsDraftButtonName || BUTTONS.SAVE_AS_DRAFT}
              </LoadingButton>
            </Grid>}
            <Grid item sm={6}>
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isDisabled}
                loading={!isDraft && isSubmitting}
              >
                {saveButtonName || BUTTONS.SAVE}
              </LoadingButton>
            </Grid>

            {toggleCancel && <Grid item sm={6}>
              <Button onClick={handleOpenConfirm} fullWidth variant="outlined" size="large">
                {cancelButtonName || BUTTONS.CANCEL}
              </Button>
            </Grid>}
          </Stack>
        </Grid>
      </Stack>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title={DIALOGS.DISCARD_TITLE}
        content={DIALOGS.DISCARD}
        action={
          <Button variant="contained" color="error" onClick={onConfirm}>
            {BUTTONS.DISCARD}
          </Button>
        }
      />
    </>
  );
}
