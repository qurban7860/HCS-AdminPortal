/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  Button,
  DialogTitle,
  Divider,
  DialogActions,
  Stack,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { resetActiveSPContacts } from '../../redux/slices/customer/contact';
import {
  approveServiceReportRequest,
  sendMachineServiceReportForApproval,
  setCompleteDialog,
} from '../../redux/slices/products/machineServiceReport';
import FormProvider from '../hook-form/FormProvider';
import { RHFAutocomplete, RHFTextField } from '../hook-form';
import { useAuthContext } from '../../auth/useAuthContext';
import SkeletonLine from '../skeleton/SkeletonLine';
import Iconify from '../iconify';

DialogServiceReportComplete.propTypes = {
  dialogType: PropTypes.string,
};

function DialogServiceReportComplete({ dialogType }) {
  const [approvingContacts, setApprovingContacts] = useState([]);
  const [allowApproval, setAllowApproval] = useState(false);
  const dispatch = useDispatch();
  const { machineServiceReport, completeDialog } = useSelector((state) => state.machineServiceReport);
  const { activeSpContacts, isLoading } = useSelector((state) => state.contact);
  const { user } = useAuthContext();

  useEffect(() => {
    const configs = JSON.parse(localStorage.getItem('configurations'))

    if (configs.length > 0 && activeSpContacts.length > 0) {
      let approvingContactsArray = [];

      const approvingContactsConfig = configs.find(
        (config) => config?.name === 'Service_Report_Approving_Contacts'
      );

      if (approvingContactsConfig?.value) {
        const configEmails = approvingContactsConfig.value
          ?.split(',')
          .map((email) => email.trim().toLowerCase());

        approvingContactsArray = activeSpContacts
          .map((activeSpUser) => activeSpUser?.contact)
          .filter((contact) => contact?.email && configEmails.includes(contact.email.toLowerCase()))
          .sort((a, b) => {
            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
            return nameA.localeCompare(nameB);
          });
      } else {
        approvingContactsArray = activeSpContacts.map((activeSpUser) => activeSpUser.contact);
      }
      setApprovingContacts(approvingContactsArray);
    }
  }, [activeSpContacts]);

  useEffect(() => {
    if (
      machineServiceReport?.approval?.approvingContacts?.length > 0 &&
      machineServiceReport?.approval?.approvingContacts?.includes(user?.contact) &&
      dialogType === "evaluate"
    ) {
      setAllowApproval(true);
    } else setAllowApproval(false);
    return () => {
      dispatch(resetActiveSPContacts());
    }
  }, [dialogType]);

  const handleCloseDialog = () => {
    dispatch(setCompleteDialog(false));
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={completeDialog} onClose={handleCloseDialog}>
      <DialogTitle variant="h4" sx={{ pb: 1, pt: 2 }}>
        {allowApproval
          ? 'Are you sure you want to Approve?'
          : 'Are you sure you want to send emails to Approve?'}
      </DialogTitle>
      <Divider orientation="horizontal" flexItem />
      {allowApproval ? (
        <ApproveSeviceReport
          isLoading={isLoading}
          approvingContacts={approvingContacts}
        />
      ) : (
        <SendApprovalEmails
          isLoading={isLoading}
          approvingContacts={approvingContacts}
        />
      )}
    </Dialog>
  );
}

export default DialogServiceReportComplete;

const SendApprovalEmails = ({ isLoading, approvingContacts }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { machineServiceReport } = useSelector((state) => state.machineServiceReport);
  const { user } = useAuthContext();

  const CompleteServiceReportSchema = Yup.object().shape({
    contacts: Yup.array().min(1).label("Contacts").required(),
  });

  const methods = useForm({
    resolver: yupResolver(CompleteServiceReportSchema),
    defaultValues: {
      contacts: [],
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleCloseDialog = () => {
    dispatch(setCompleteDialog(false));
    reset();
  };

  const onSendEmailsSubmit = async (data) => {
    try {
      const params = {
        approvingContacts: data?.contacts,
        primaryServiceReportId: machineServiceReport?.primaryServiceReportId || '',
        submittedBy: user,
        submittedAt: new Date(),
      };

      await dispatch(
        sendMachineServiceReportForApproval(
          machineServiceReport?.machine?._id,
          machineServiceReport?._id,
          params
        )
      );

      await enqueueSnackbar(`Service Report Approval Email Sent Successfully!`);
      await handleCloseDialog();
    } catch (err) {
      enqueueSnackbar(`Service Report Approval Email Failed to Send! `, { variant: 'error' });
      console.error(err.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSendEmailsSubmit)} mb={5}>
      <DialogContent dividers>
        <Stack spacing={2} pt={3}>
          {!isLoading ? (
            <RHFAutocomplete
              multiple
              disableCloseOnSelect
              filterSelectedOptions
              label="Contacts*"
              name="contacts"
              options={approvingContacts}
              isOptionEqualToValue={(option, value) => option?._id === value?._id}
              getOptionLabel={(option) => `${option.firstName || ''} ${option.lastName || ''}`}
              renderOption={(props, option) => (
                <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''
                  }`}</li>
              )}
            />
          ) : (
            <SkeletonLine />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleCloseDialog}>
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          disabled={isLoading}
          loading={isSubmitting}
          variant="contained"
          endIcon={<Iconify icon="streamline:send-email-solidmdi:send" />}
        >
          Send Email
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

const ApproveSeviceReport = ({ isLoading }) => {
  const [approvalSubmitting, setApprovalSubmitting] = useState(false);
  const [rejectionSubmitting, setRejectionSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { machineServiceReport } = useSelector((state) => state.machineServiceReport);
  const maxLength = 500;

  const CompleteServiceReportSchema = Yup.object().shape({
    comments: Yup.string().required('You need to enter a comment in order to proceed'),
  });

  const methods = useForm({
    resolver: yupResolver(CompleteServiceReportSchema),
    defaultValues: {
      comments: '',
      status: 'APPROVED',
    },
  });

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  const { comments } = watch();

  const handleStatusChange = (status = 'APPROVED') => {
    setValue('status', status);
    handleSubmit(approveServiceReport)();
  };

  const handleCloseDialog = () => {
    dispatch(setCompleteDialog(false));
    reset();
  };

  const approveServiceReport = async (data) => {
    try {
      if (data?.status === 'APPROVED') {
        setApprovalSubmitting(true);
      } else {
        setRejectionSubmitting(true);
      }
      const params = {
        status: data?.status,
        comments: data?.comments,
      };

      await dispatch(
        approveServiceReportRequest(
          machineServiceReport?.machine?._id,
          machineServiceReport?._id,
          params
        )
      );
      await enqueueSnackbar(
        `Service Report ${data?.status === 'APPROVED' ? 'Approved' : 'Rejected'} Successfully!`
      );
    } catch (err) {
      enqueueSnackbar(
        `Service Report ${data?.status === 'APPROVED' ? 'Approval' : 'Rejection'} Failed! `,
        { variant: 'error' }
      );
      console.error(err);
    } finally {
      setApprovalSubmitting(false);
      setRejectionSubmitting(false);
      await handleCloseDialog();
    }
  };

  return (
    <FormProvider methods={methods} mb={5}>
      <DialogContent dividers>
        <Stack spacing={2} pt={3}>
          {!isLoading ? (
            <RHFTextField
              multiline
              rows={3}
              label="Service Report Comments"
              name="comments"
              placeholder="Add your comments here"
              inputProps={{ maxLength }}
              helperText={`${comments?.length}/${maxLength}`}
            />
          ) : (
            <SkeletonLine />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Button variant="outlined" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Stack direction="row" spacing={1}>
            <LoadingButton
              disabled={isSubmitting}
              loading={rejectionSubmitting}
              variant="contained"
              color="error"
              sx={{
                backgroundColor: 'red',
                '&:hover': {
                  backgroundColor: 'darkred',
                },
              }}
              onClick={() => handleStatusChange('REJECTED')}
            >
              Reject
            </LoadingButton>
            <LoadingButton
              disabled={isSubmitting}
              loading={approvalSubmitting}
              variant="contained"
              sx={{
                backgroundColor: 'green',
                '&:hover': {
                  backgroundColor: 'darkgreen',
                },
              }}
              onClick={() => handleStatusChange('APPROVED')}
            >
              Approve
            </LoadingButton>
          </Stack>
        </Stack>
      </DialogActions>
    </FormProvider>
  );
};

SendApprovalEmails.propTypes = {
  isLoading: PropTypes.bool,
  approvingContacts: PropTypes.array,
};

ApproveSeviceReport.propTypes = {
  isLoading: PropTypes.bool,
};
