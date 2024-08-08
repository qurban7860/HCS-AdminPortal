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
  isDisableSaveAsDraft: PropTypes.bool,
  isDraft: PropTypes.bool,
  saveAsDraftButtonName: PropTypes.string,
  saveButtonName: PropTypes.string,
  istrigger: PropTypes.bool,
  handleSave: PropTypes.func,
  saveTransferButtonName: PropTypes.string,
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
  handleSubmit: PropTypes.func,
  handleBack: PropTypes.func,
  backButtonName: PropTypes.string,
  isDisabledBackButton: PropTypes.bool,
};

export default function AddFormButtons({
  saveAsDraft,
  isDraft,
  saveAsDraftButtonName,
  saveButtonName,
  isDisableSaveAsDraft,
  saveTransferButtonName,
  istrigger,
  handleSave,
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
  handleSubmit,
  handleBack,
  backButtonName,
  isDisabledBackButton,
}) {
  const navigate = useNavigate()
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openTransferConfirm, setOpenTransferConfirm] = useState(false);
// console.log("istrigger : ",istrigger)
  const { isSettingReadOnly, isSecurityReadOnly, isDocumentAccessAllowed, isDrawingAccessAllowed } = useAuthContext();
  
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const onConfirm = () => {
    setOpenConfirm(false);
    toggleCancel();
  };
  const handleOpenTransferConfirm = () => {
    if(istrigger){
      setOpenTransferConfirm(true);
    }
  };

  const handleCloseTransferConfirm = () => {
    setOpenTransferConfirm(false);
  };

  useLayoutEffect(()=>{
    if(( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly || !isDocumentAccessAllowed || !isDrawingAccessAllowed )){
      navigate(PATH_DASHBOARD.root)
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
                variant="contained"
                size="large"
                fullWidth
                onClick={saveAsDraft}
                disabled={isDisableSaveAsDraft}
                loading={isDraft && isSubmitting}
                type="submit"
              >
                {saveAsDraftButtonName || BUTTONS.SAVE_AS_DRAFT}
              </LoadingButton>
            </Grid>}

            {handleBack && <Grid item sm={6}>
              <Button onClick={handleBack} disabled={ isDisabledBackButton } fullWidth size="large" variant="outlined" >
                {backButtonName || BUTTONS.BACK}
              </Button>
            </Grid>}
            
            {!saveTransferButtonName && <Grid item sm={6}>
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isDisabled}
                onClick={handleSave}
                loading={!isDraft && isSubmitting}
              >
                {saveButtonName || BUTTONS.SAVE}
              </LoadingButton>
            </Grid>}

            {saveTransferButtonName && <Grid item sm={6}>
              <Button onClick={ handleOpenTransferConfirm } size='large'  
                fullWidth
                variant={ !istrigger ? "outlined" : "contained" }
                color={ istrigger ? undefined : "error"  }
              >
                { saveTransferButtonName }
              </Button>
            </Grid>}

            {toggleCancel && <Grid item sm={6}>
              <Button onClick={handleOpenConfirm} fullWidth size="large" variant="outlined" >
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

      <ConfirmDialog
        open={openTransferConfirm}
        onClose={handleCloseTransferConfirm}
        title={DIALOGS.TRANSFER_CONFIRM_TITLE}
        content={DIALOGS.TRANSFER_CONFIRM}
        action={
          <LoadingButton
            type="submit"
            variant="contained"
            disabled={isDisabled}
            loading={!isDraft && isSubmitting}
            onClick={handleSubmit}
          >
            { BUTTONS.TRANSFER }
          </LoadingButton>}
      />
    </>
  );
}
