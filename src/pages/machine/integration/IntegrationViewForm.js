import React, { useEffect, useState } from 'react';
import { Box, Button, Card, Container, Grid, Link, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import MachineTabContainer from '../util/MachineTabContainer';
// import Image from '../../../components/image';
import {
  addIntegrationRecord,
  getIntegrationRecord,
} from '../../../redux/slices/products/machineIntegration';
import generate32BitSecureKey from '../../../utils/generate32BitKey';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { FORMLABELS } from '../../../constants/document-constants';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import Iconify from '../../../components/iconify';

const IntegrationViewForm = () => {
  const [openAddMoreInfoDialog, setOpenAddMoreInfoDialog] = useState(false);
  const { machineId } = useParams();
  const dispatch = useDispatch();
  const { machine } = useSelector((state) => state.machine);
  const { isLoading, integtrationDetails, portalKey, machineSerialNo, computerGUID, IPC_SerialNo } = useSelector(
    (state) => state.machineIntegrationRecord
  );
  
  const [formData, setFormData] = useState({
    computerGUID: computerGUID || '',
    ipcSerialNo: IPC_SerialNo || ''
  });
  
  useEffect(() => {
    fetchIntegrationRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchIntegrationRecord() {
    await dispatch(getIntegrationRecord(machineId));
  }

  const handleGenerateKey = async (machineid) => {
    const generatedPortalKey = await generate32BitSecureKey(machineid);
    const params = {
      machineSerialNo: machine?.serialNo,
      portalKey: generatedPortalKey,
    };
    await dispatch(addIntegrationRecord(machineid, params));
  };

  const handleAddMoreInfoDialog = () => {
    setOpenAddMoreInfoDialog(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    const params = {
      machineSerialNo,
      portalKey,
      computerGUID: formData.computerGUID,
      IPC_SerialNo: formData.ipcSerialNo,
    };
    await dispatch(addIntegrationRecord(machineId, params));
    setOpenAddMoreInfoDialog(false);
  };

  const handleKeyDownload = () => {
    const fileContent = `Machine_Serial_No = ${machineSerialNo}\nHowick_Portal_Key = ${portalKey}`;
    
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `HowickPortal-${machineSerialNo}.config`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  
  return (
    <>
      <Container maxWidth={false}>
        <MachineTabContainer currentTabValue="integration" />
        {!portalKey ? (
          <Card
            sx={{
              position: 'relative',
              minHeight: '500px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(/assets/illustrations/machine-integration.svg)',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.1,
                zIndex: 1,
              },
            }}
          >
            <Box
              sx={{
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: 3,
                borderRadius: 2,
                position: 'relative',
                zIndex: 2,
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                This machine currently does not have a portal key generated.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleGenerateKey(machineId)}
                sx={{ mt: 2 }}
              >
                Generate Portal Key
              </Button>
            </Box>
          </Card>
        ) : (
          <Card
            sx={{
              position: 'relative',
              minHeight: '500px',
              display: 'flex',
              flexDirection: 'column',
              width: '100%', 
              p: '1rem', 
              mb: 3,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(/assets/illustrations/machine-integration.svg)',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.1,
                zIndex: 1,
              }}
            />
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <FormLabel content={FORMLABELS.INTEGRATION.MAIN_HEADER} />
              <Grid container>
                <ViewFormField isLoading={isLoading} sm={6} variant='h6' heading="Portal Key" 
                  node={
                  <>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {portalKey}
                    </Typography>
                    <StyledTooltip
                      title='Download Portal Key'
                      placement="top"
                      disableFocusListener
                      tooltipcolor="#2065D1" 
                      color="#2065D1"
                    >
                      <Link onClick={handleKeyDownload} color="inherit" target="_blank" rel="noopener" sx={{ cursor: 'pointer',mx: 0.5}}>
                        <Iconify icon="mdi:file-key" width={30} sx={{position:'relative', bottom:'-5px',}} color="#2065D1" />
                      </Link>
                    </StyledTooltip>
                  </>
                }
                />
                <ViewFormField isLoading={isLoading} sm={6} variant='h6' heading="Machine Serial No." param={machineSerialNo} />
                <ViewFormField isLoading={isLoading} sm={6} variant='h6' heading="Computer GUID" 
                  node={
                  <>
                    {computerGUID ? (
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {computerGUID}
                      </Typography>
                    ) : (
                      <Link onClick={handleAddMoreInfoDialog} underline="none" sx={{ cursor: 'pointer'}} >
                        Click here to add
                      </Link>
                    )}
                  </>
                }
                />
                <ViewFormField isLoading={isLoading} sm={6} variant='h6' heading="IPC Serial No." 
                  node={
                  <>
                    {IPC_SerialNo ? (
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {IPC_SerialNo}
                      </Typography>
                    ) : (
                      <Link onClick={handleAddMoreInfoDialog} underline="none" sx={{ cursor: 'pointer'}} >
                        Click here to add
                      </Link>
                    )}
                  </>
                }
                />
              </Grid>
            </Box>
          </Card>
        )}
        {/* <Box sx={{ mt: 4, textAlign: 'center', maxWidth: '500px', mx: 'auto' }}>
        <Image
          alt="Machine Integration"
          src='/assets/illustrations/machine-integration.svg'
          sx={{ minHeight: 400, mb:2, opacity: 0.65 }}
        />
        </Box> */}
      </Container>
      <Dialog open={openAddMoreInfoDialog} onClose={() => setOpenAddMoreInfoDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Integration Details</DialogTitle>
        <DialogContent>
        <TextField
          fullWidth
          label="Computer GUID"
          name="computerGUID"
          value={formData.computerGUID}
          onChange={handleInputChange}
          sx={{ mt: 1, mb: 3 }}
          disabled={!!computerGUID}
        />
        <TextField
          fullWidth
          label="IPC Serial No"
          name="ipcSerialNo"
          value={formData.ipcSerialNo}
          onChange={handleInputChange}
          disabled={!!IPC_SerialNo}
        />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddMoreInfoDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IntegrationViewForm;
