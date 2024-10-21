import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid, Typography } from '@mui/material';
// routes
import { PATH_PORTAL_REGISTRATION } from '../../../routes/paths';
// hooks
import { useSnackbar } from '../../../components/snackbar';
// slices
import {
  setAcceptRequestDialog,
  setRejectRequestDialog,
  updatePortalRegistration,
} from '../../../redux/slices/customer/portalRegistration';
// components
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import PortalRequestInviteDialog from '../../../components/Dialog/PortalRequestInviteDialog';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import IconButtonTooltip from '../../../components/Icons/IconButtonTooltip';

// ----------------------------------------------------------------------

export default function CustomerViewForm() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { portalRegistration, isLoading } = useSelector((state) => state.portalRegistration);
  const { enqueueSnackbar } = useSnackbar();
  const { customerId } = useParams();
  const defaultValues = useMemo(
    () => ({
      customerName: portalRegistration?.customerName || "",
      contactPersonName: portalRegistration?.contactPersonName || "",
      email: portalRegistration?.email || "",
      phoneNumber: portalRegistration?.phoneNumber || "",
      status: portalRegistration?.status || "",
      customerNote: portalRegistration?.customerNote || "",
      internalNote: portalRegistration?.internalNote || "",
      machineSerialNos: portalRegistration?.machineSerialNos || "",
      address: portalRegistration?.address || "",
      isActive: portalRegistration?.isActive || false,
      createdAt: portalRegistration?.createdAt || '',
      createdByFullName: portalRegistration?.createdBy?.name || '',
      createdIP: portalRegistration?.createdIP || '',
      updatedAt: portalRegistration?.updatedAt || '',
      updatedByFullName: portalRegistration?.updatedBy?.name || '',
      updatedIP: portalRegistration?.updatedIP || '',
    }),
    [ portalRegistration ]
  );
  
  const handleEdit = async () =>  customerId && navigate(PATH_PORTAL_REGISTRATION.edit(customerId));
  
  const onArchive = async () => {
      try {
        const data = {
          isActive: false,
          isArchived: true,
        }
        await dispatch( updatePortalRegistration( customerId, data ) );
        await navigate( PATH_PORTAL_REGISTRATION.root );
      } catch (err) {
        enqueueSnackbar(err, { variant: `error` });
        console.log('Error:', err);
      }
  };

  return (
  <Grid container >
    <Grid item xs={12} md={12}>
    <Card sx={{ p: '1rem', mb:3 }}>
            <ViewFormEditDeleteButtons
              isActive={ defaultValues.isActive}
              handleEdit={ handleEdit }
              onArchive={  onArchive }
              backLink={() => navigate(PATH_PORTAL_REGISTRATION.root)}
            />
                <Grid container >
                  <ViewFormField isLoading={isLoading} sm={6} heading='Customer Name' param={defaultValues?.customerName} />
                  <ViewFormField isLoading={isLoading} sm={6} heading='Machine Serial Nos' param={defaultValues?.machineSerialNos} />
                  <ViewFormField isLoading={isLoading} sm={6} heading='Contact Person Name' param={defaultValues?.contactPersonName} />
                  <ViewFormField isLoading={isLoading} sm={6} heading='Status' 
                                      node={<>
                            <Typography variant='h4' sx={{mr: 1,
                              color: (
                                portalRegistration?.status === 'REJECTED' && 'red' ||
                                portalRegistration?.status === 'APPROVED' && 'green'
                              ) || 'inherit'
                              }}
                            >
                              { portalRegistration?.status }
                            </Typography>
                            { portalRegistration?.status?.toLowerCase() !== "approved" && 
                              <IconButtonTooltip title='Approve' color='#388e3c' icon="mdi:approve" onClick={()=> dispatch(setAcceptRequestDialog(true))} /> 
                            }
                            { ( portalRegistration?.status?.toLowerCase() !== "approved" && portalRegistration?.status?.toLowerCase() !==  "rejected" ) && 
                              <IconButtonTooltip title='Reject' color='#d32f2f' icon="mdi:cross-circle" onClick={()=> dispatch(setRejectRequestDialog(true))} /> 
                            }
                            { portalRegistration?.status?.toLowerCase() === "new" && 
                              <IconButtonTooltip title='Pending' icon="ph:clock-countdown-bold" onClick={()=> dispatch(updatePortalRegistration( customerId, { status: 'PENDING' }))} /> 
                            }
                          </>}
                  />
                  <ViewFormField isLoading={isLoading} sm={6} heading='Email' param={defaultValues?.email} />
                  <ViewFormField isLoading={isLoading} sm={6} heading='Phone Number' param={defaultValues?.phoneNumber} />
                  <ViewFormField isLoading={isLoading} sm={12} heading="Address" param={defaultValues?.address } />
                  <ViewFormField isLoading={isLoading} sm={12} heading='Customer Note' param={defaultValues?.customerNote} />
                  <ViewFormField isLoading={isLoading} sm={12} heading='Internal Note' param={defaultValues?.internalNote} />
                  <ViewFormAudit defaultValues={defaultValues} />
                </Grid>
          </Card>
          <PortalRequestInviteDialog />
    </Grid>
  </Grid>
  );
}
