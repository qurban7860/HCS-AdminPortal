import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid, Typography, Link } from '@mui/material';
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
import { setContactDialog, getContact } from '../../../redux/slices/customer/contact';
import { setCustomerDialog, getCustomer } from '../../../redux/slices/customer/customer';
import { setSecurityUserDialog, getDialogSecurityUser } from '../../../redux/slices/securityUser/securityUser';
// components
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import PortalRequestInviteDialog from '../../../components/Dialog/PortalRequestInviteDialog';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import IconButtonTooltip from '../../../components/Icons/IconButtonTooltip';
import Iconify from '../../../components/iconify/Iconify';
import { StyledTooltip } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

export default function PortalRegistrationViewForm() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { portalRegistration, acceptRequestDialog, rejectRequestDialog, isLoading } = useSelector((state) => state.portalRegistration);
  const { enqueueSnackbar } = useSnackbar();
  const { customerId } = useParams();
  const defaultValues = useMemo(
    () => ({
      customerName: portalRegistration?.customerName || "",
      customer: portalRegistration?.customer || null,
      contactPersonName: portalRegistration?.contactPersonName || "",
      contact: portalRegistration?.contact || null,
      email: portalRegistration?.email || "",
      securityUser: portalRegistration?.securityUser || null,
      phoneNumber: portalRegistration?.phoneNumber || "",
      status: portalRegistration?.status || "",
      customerNote: portalRegistration?.customerNote || "",
      internalNote: portalRegistration?.internalNote || "",
      machineSerialNos: portalRegistration?.machineSerialNos || "",
      country: portalRegistration?.country || "",
      address: portalRegistration?.address || "",
      isActive: portalRegistration?.isActive || false,
      createdAt: portalRegistration?.createdAt || '',
      createdByFullName: portalRegistration?.createdBy?.name || '',
      createdIP: portalRegistration?.createdIP || '',
      updatedAt: portalRegistration?.updatedAt || '',
      updatedByFullName: portalRegistration?.updatedBy?.name || '',
      updatedIP: portalRegistration?.updatedIP || '',
    }),
    [portalRegistration]
  );

  const handleEdit = async () => customerId && navigate(PATH_PORTAL_REGISTRATION.edit(customerId));

  const onArchive = async () => {
    try {
      const data = {
        isActive: false,
        isArchived: true,
      }
      await dispatch(updatePortalRegistration(customerId, data));
      enqueueSnackbar("Portal request archived successfully!");
      await navigate(PATH_PORTAL_REGISTRATION.root);
    } catch (err) {
      enqueueSnackbar(err, { variant: `error` });
      console.log('Error:', err);
    }
  };

  const handleCustomerDialog = async (id) => {
    await dispatch(getCustomer(portalRegistration?.customer?._id))
    await dispatch(setCustomerDialog(true))
  }

  const handleContactDialog = async () => {
    await dispatch(getContact(portalRegistration?.customer?._id, portalRegistration?.contact?._id))
    await dispatch(setContactDialog(true))
  }

  const handleSecurityUserDialog = async () => {
    await dispatch(getDialogSecurityUser(portalRegistration?.securityUser?._id))
    await dispatch(setSecurityUserDialog(true))
  }

  return (
    <Grid container >
      <Grid item xs={12} md={12}>
        <Card sx={{ p: '1rem', mb: 3 }}>
          <ViewFormEditDeleteButtons
            isActive={defaultValues.isActive}
            handleEdit={portalRegistration?.status !== 'APPROVED' ? handleEdit : undefined}
            onArchive={portalRegistration?.status !== 'APPROVED' ? onArchive : undefined}
            backLink={() => navigate(PATH_PORTAL_REGISTRATION.root)}
          />
          <Grid container >
            <ViewFormField isLoading={isLoading} sm={6} heading="Customer Name" param={defaultValues?.customer?._id ? undefined : defaultValues?.customerName}
              node={
                defaultValues?.customer?._id && (
                  <Link onClick={handleCustomerDialog} href="#" underline="none">
                    {defaultValues?.customer?.name || ""}
                    {!defaultValues?.customer?.isActive &&
                      <StyledTooltip title="Customer is Inactive" placement='top' disableFocusListener tooltipcolor="#FF0000" color="#FF0000">
                        <Iconify color="#FF0000" sx={{ height: '24px', width: '24px', verticalAlign: "middle", ml: 1 }} icon="mdi:ban" />
                      </StyledTooltip>
                    }
                  </Link>)
              }
            />

            <ViewFormField isLoading={isLoading} sm={6} heading='Machine Serial Nos' chips={defaultValues?.machineSerialNos} />

            <ViewFormField isLoading={isLoading} sm={6} heading="Contact Person Name" param={defaultValues?.contact?._id ? undefined : defaultValues?.contactPersonName}
              node={
                defaultValues?.contact?._id && (
                  <Link onClick={handleContactDialog} href="#" underline="none">
                    {defaultValues?.contact?.firstName || ''} {defaultValues?.contact?.lastName || ''}
                    {!defaultValues?.contact?.isActive &&
                      <StyledTooltip title="Contact is Inactive" placement='top' disableFocusListener tooltipcolor="#FF0000" color="#FF0000">
                        <Iconify color="#FF0000" sx={{ height: '24px', width: '24px', verticalAlign: "middle", ml: 1 }} icon="mdi:ban" />
                      </StyledTooltip>
                    }
                  </Link>)
              }
            />

            <ViewFormField isLoading={isLoading} sm={6} heading='Status'
              node={<>
                <Typography variant='h4' sx={{
                  mr: 1,
                  color: (
                    portalRegistration?.status === 'REJECTED' && 'red' ||
                    portalRegistration?.status === 'APPROVED' && 'green'
                  ) || 'inherit'
                }}
                >
                  {portalRegistration?.status}
                </Typography>
                {portalRegistration?.status?.toLowerCase() !== "approved" &&
                  <IconButtonTooltip title='Approve' color='#388e3c' icon="mdi:approve" onClick={() => dispatch(setAcceptRequestDialog(true))} />
                }
                {(portalRegistration?.status?.toLowerCase() !== "approved" && portalRegistration?.status?.toLowerCase() !== "rejected") &&
                  <IconButtonTooltip title='Reject' color='#d32f2f' icon="mdi:cross-circle" onClick={() => dispatch(setRejectRequestDialog(true))} />
                }
                {portalRegistration?.status?.toLowerCase() === "new" &&
                  <IconButtonTooltip title='Pending' icon="ph:clock-countdown-bold" onClick={() => dispatch(updatePortalRegistration(customerId, { status: 'PENDING' }))} />
                }
              </>}
            />

            <ViewFormField isLoading={isLoading} sm={6} heading="Email" param={defaultValues?.securityUser?._id ? undefined : defaultValues?.email}
              node={defaultValues?.securityUser?._id &&
                (<Link onClick={handleSecurityUserDialog} href="#" underline="none">
                  {defaultValues?.email || ''}
                  {!defaultValues?.securityUser?.isActive &&
                    <StyledTooltip title="Security user is Inactive" placement='top' disableFocusListener tooltipcolor="#FF0000" color="#FF0000">
                      <Iconify color="#FF0000" sx={{ height: '24px', width: '24px', verticalAlign: "middle", ml: 1 }} icon="mdi:ban" />
                    </StyledTooltip>
                  }
                </Link>)
              }
            />
            <ViewFormField isLoading={isLoading} sm={6} heading='Phone Number' param={defaultValues?.phoneNumber} />
            <ViewFormField isLoading={isLoading} sm={6} heading="country" param={defaultValues?.country} />
            <ViewFormField isLoading={isLoading} sm={12} heading='Customer Note' param={defaultValues?.customerNote} />
            <ViewFormField isLoading={isLoading} sm={12} heading='Internal Note' param={defaultValues?.internalNote} />
            <ViewFormAudit defaultValues={defaultValues} />
          </Grid>
        </Card>
        {(acceptRequestDialog || rejectRequestDialog) && <PortalRequestInviteDialog />}
      </Grid>
    </Grid>
  );
}
