import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Grid, Link, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { FormProvider, useForm } from 'react-hook-form';

import MachineTabContainer from '../util/MachineTabContainer';
import generate64BitSecureKey from '../../../utils/generate64BitKey';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { FORMLABELS } from '../../../constants/document-constants';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import Iconify from '../../../components/iconify';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import { RHFTextField } from '../../../components/hook-form';
import { addPortalIntegrationDetails, addPortalIntegrationKey, getMachine } from '../../../redux/slices/products/machine';
import { fDateTime } from '../../../utils/formatTime';

const IntegrationViewForm = () => {
  const [openAddMoreInfoDialog, setOpenAddMoreInfoDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { machineId } = useParams();
  const dispatch = useDispatch();
  const { isLoading, machine } = useSelector((state) => state.machine);
  const { enqueueSnackbar } = useSnackbar();

  const { serialNo, portalKey, computerGUID, IPC_SerialNo } = machine;
  const currentPortalKey = portalKey?.[0];

  const methods = useForm({
    defaultValues: {
      computerGUID: computerGUID || null,
      ipcSerialNo: IPC_SerialNo || null
    },
  });

  useEffect(() => {
    dispatch(getMachine(machineId));
  }, [dispatch, machineId]);

  const handleGenerateKey = async (e, regen = false) => {
    if (regen) {
      setOpenConfirmDialog(true);
      return;
    }
    await generateAndSaveKey();
  };

  const generateAndSaveKey = async () => {
    const generatedPortalKey = await generate64BitSecureKey(machineId);
    const params = {
      machineSerialNo: serialNo,
      portalKey: generatedPortalKey,
    };
    await dispatch(addPortalIntegrationKey(machineId, params));
    enqueueSnackbar('Portal key generated successfully', { variant: 'success' });
  };

  const handleConfirmRegenerate = async () => {
    setOpenConfirmDialog(false);
    await generateAndSaveKey();
  };

  const onSubmitDetails = async (data) => {
    const params = {
      computerGUID: data?.computerGUID,
      IPC_SerialNo: data?.ipcSerialNo
    };

    await dispatch(addPortalIntegrationDetails(machineId, params));
    setOpenAddMoreInfoDialog(false);
    enqueueSnackbar('Integration Record Saved', { variant: 'success' });
  };

  const handleKeyDownload = () => {
    const fileContent = `Machine_Serial_No = ${serialNo}\nHowick_Portal_Key = ${currentPortalKey?.key}`;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'HowickPortal.config';
    link.click();
    window.URL.revokeObjectURL(url);
    enqueueSnackbar('Portal key download started', { variant: 'success' });
  };

  const handleKeyCopy = () => {
    navigator.clipboard.writeText(currentPortalKey?.key);
    enqueueSnackbar('Portal key copied to clipboard', { variant: 'success' });
  };

  const renderIntegrationField = (value, fieldName, label) => (
    value ? (
      <>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{value}</Typography>
        <StyledTooltip title={`Edit ${label}`} placement="top" disableFocusListener tooltipcolor="#2065D1" color="#2065D1">
          <Link onClick={() => setOpenAddMoreInfoDialog(fieldName)} color="inherit" sx={{ cursor: 'pointer', mx: 0.5 }}>
            <Iconify icon="bx:edit-alt" sx={{ position: 'relative', bottom: '-5px' }} color="#2065D1" />
          </Link>
        </StyledTooltip>
      </>
    ) : (
      <Link onClick={() => setOpenAddMoreInfoDialog(fieldName)} underline="none" sx={{ cursor: 'pointer', display: 'flex', columnGap: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>Add {label}</Typography>
        <Iconify icon="mdi:add-bold" color="#2065D1" />
      </Link>
    )
  );

  return (
    <>
      <Container maxWidth={false}>
        <MachineTabContainer currentTabValue="integration" />
        <Card sx={{ minHeight: '500px', width: '100%', p: '1rem', mb: 3, display: 'flex', flexDirection: 'column' }}>
          <ViewFormEditDeleteButtons
            sx={{ pt: 5 }}
            isActive={machine?.isArchived ? undefined : machine?.machineIntegrationSyncStatus}
            handleDownload={currentPortalKey?.key ? handleKeyDownload : undefined}
            downloadTooltip="Download Portal Key"
            handleRegenerate={currentPortalKey?.key ? (e) => handleGenerateKey(e, true) : undefined}
          />
          <FormLabel content={FORMLABELS.INTEGRATION.MAIN_HEADER} />
          <Grid container>
            <ViewFormField 
              isLoading={isLoading} 
              sm={6} 
              variant='h6' 
              heading="Computer GUID" 
              node={renderIntegrationField(computerGUID, "computerGUID", "Computer GUID")}
            />
            <ViewFormField 
              isLoading={isLoading} 
              sm={6} 
              variant='h6' 
              heading="IPC Serial No." 
              node={renderIntegrationField(IPC_SerialNo, "ipcSerialNo", "IPC Serial No")}
            />
            <ViewFormField 
              isLoading={isLoading} 
              sm={12} 
              variant='h6' 
              heading="Portal Key" 
              node={currentPortalKey?.key ? (
                <>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{currentPortalKey.key}</Typography>
                  <StyledTooltip title='Copy Portal Key' placement="top" disableFocusListener tooltipcolor="#2065D1" color="#2065D1">
                    <Link onClick={handleKeyCopy} color="inherit" sx={{ cursor: 'pointer', mx: 0.5 }}>
                      <Iconify icon="mdi:content-copy" sx={{ position: 'relative', bottom: '-5px' }} color="#2065D1" />
                    </Link>
                  </StyledTooltip>
                </>
              ) : (
                <Link onClick={(e) => handleGenerateKey(e, false)} underline="none" sx={{ cursor: 'pointer', display: 'flex', columnGap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Generate Portal Key</Typography>
                  <Iconify icon="mdi:key-add" color="#2065D1" />
                </Link>
              )}
            />
            {portalKey?.length > 0 && (
              <ViewFormField isLoading={isLoading} sm={12} heading="Portal Key Version" param={`v${portalKey?.length}`} />
            )}
          </Grid>
          {currentPortalKey ? (
            <Grid container sx={{ mt: 'auto', pt: 2 }}>
              <Grid item md={12} sx={{ overflowWrap: 'break-word', display: 'flex', mt:1, px:0.5  }}>
                <Typography paragraph variant="body2" sx={{color: 'text.disabled' }}>
                  <b>Portal Key Generated By:</b> {currentPortalKey?.createdBy?.name}{` at `}
                  {fDateTime(currentPortalKey?.createdAt)}{"  "}
                  {currentPortalKey?.createdIP}
                </Typography>
              </Grid>
            </Grid>
          ) : null}
        </Card>
      </Container>

      <Dialog open={!!openAddMoreInfoDialog} onClose={() => setOpenAddMoreInfoDialog(false)} maxWidth="sm" fullWidth>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmitDetails)}>
            <DialogTitle>Integration Details - {openAddMoreInfoDialog === "computerGUID" ? "Computer GUID" : "IPC Serial No"}</DialogTitle>
            <DialogContent>
              {openAddMoreInfoDialog && (
                <RHFTextField 
                  fullWidth 
                  name={openAddMoreInfoDialog} 
                  label={openAddMoreInfoDialog === "computerGUID" ? "Computer GUID" : "IPC Serial No"} 
                  sx={{ mt: 1, mb: 3 }} 
                />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAddMoreInfoDialog(false)} color="inherit">Cancel</Button>
              <Button type="submit" variant="contained">Submit</Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>

      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirm Re-generate Portal Key</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Are you sure you want to re-generate the portal key?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="inherit">Cancel</Button>
          <Button onClick={handleConfirmRegenerate} variant="contained" color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IntegrationViewForm;
