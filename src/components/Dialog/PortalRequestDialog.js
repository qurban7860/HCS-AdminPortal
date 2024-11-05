import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import { Grid, Dialog, DialogContent, DialogTitle, Divider, Typography } from '@mui/material';
import { setRequestDialog, resetPortalRegistration } from '../../redux/slices/customer/portalRegistration';
import ViewFormField from '../ViewForms/ViewFormField';
import { PATH_PORTAL_REGISTRATION } from '../../routes/paths';
import DialogLink from './DialogLink';

function PortalRequestDialog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { portalRegistration, requestDialog, isLoading } = useSelector((state) => state.portalRegistration);

  const defaultValues = useMemo(
    () => ({
        customerName: portalRegistration?.customerName || "",
        contactPersonName: portalRegistration?.contactPersonName || "",
        email: portalRegistration?.email || "",
        phoneNumber: portalRegistration?.phoneNumber || "",
        address: portalRegistration?.address || "",
        customerNote: portalRegistration?.customerNote || "",
        machineSerialNos: Array.isArray(portalRegistration?.machineSerialNos) ? portalRegistration?.machineSerialNos : [],
        status: portalRegistration?.status || null,
        internalNote: portalRegistration?.internalNote || "",
      }
    ),[ portalRegistration ]);
  
  const handleCloseDialog = async () => {
      await dispatch(setRequestDialog(false));
      await dispatch(resetPortalRegistration())
  };

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={ portalRegistration && requestDialog }
      onClose={ handleCloseDialog }
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <DialogTitle variant='h3' sx={{ my: -2 }}>Portal Request</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <DialogContent dividers >
        <Grid container >
          <ViewFormField isLoading={isLoading} sm={6} heading="Customer Name" param={ defaultValues?.customerName } />
          <ViewFormField isLoading={isLoading} sm={6} heading='Machine Serial Nos' chips={ defaultValues?.machineSerialNos } />
          <ViewFormField isLoading={isLoading} sm={6} heading="Contact Person Name" param={ defaultValues?.contactPersonName } />
          
          <ViewFormField isLoading={isLoading} sm={6} heading='Status'
            node={
              <Typography variant='h4' sx={{mr: 1,
                color: (
                  portalRegistration?.status === 'REJECTED' && 'red' ||
                  portalRegistration?.status === 'APPROVED' && 'green'
                ) || 'inherit'
                }}
              >
                { portalRegistration?.status }
              </Typography>
            }
          />

          <ViewFormField isLoading={isLoading} sm={6} heading="Email" param={ defaultValues?.email}/>
          <ViewFormField isLoading={isLoading} sm={6} heading='Phone Number' param={defaultValues?.phoneNumber} />
          <ViewFormField isLoading={isLoading} sm={6} heading="country" param={defaultValues?.country } />
          <ViewFormField isLoading={isLoading} sm={12} heading='Customer Note' param={defaultValues?.customerNote} />
          <ViewFormField isLoading={isLoading} sm={12} heading='Internal Note' param={defaultValues?.internalNote} />
        </Grid>
      </DialogContent>
      <DialogLink
        onClose={handleCloseDialog}
        onClick={() => {
          handleCloseDialog();
          navigate(PATH_PORTAL_REGISTRATION.view( portalRegistration?._id ));
        }}
        content="Go to Security User"
      />
    </Dialog>
  );
}


export default PortalRequestDialog;
