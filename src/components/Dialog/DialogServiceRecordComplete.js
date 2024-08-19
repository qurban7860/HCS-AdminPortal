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
  Alert,
  Stack,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';

import {
  approveServiceRecordRequest,
  getMachineServiceRecord,
  sendMachineServiceRecordForApproval,
  setCompleteDialog,
} from '../../redux/slices/products/machineServiceRecord';
import FormProvider from '../hook-form/FormProvider';
import { RHFAutocomplete, RHFTextField } from '../hook-form';
import { useAuthContext } from '../../auth/useAuthContext';
import SkeletonLine from '../skeleton/SkeletonLine';

DialogServiceRecordComplete.propTypes = {
  recordStatus: PropTypes.object,
};

function DialogServiceRecordComplete({ recordStatus }) {
  const [approvingContacts, setApprovingContacts] = useState([]);
  const [allowApproval, setAllowApproval] = useState(false);
  const dispatch = useDispatch();
  const { machineServiceRecord, completeDialog } = useSelector(
    (state) => state.machineServiceRecord
  );
  const { activeSpContacts, isLoading } = useSelector((state) => state.contact);
  const { user } = useAuthContext();
  const { configs } = useSelector((state) => state.config);

  // To get the approving contacts from the configs
  // Filter to find if the config email is in the activeSpContacts array to avoid errors
  // Map to get the full contact object from the activeSpContacts array

  useEffect(() => {
    if (configs.length > 0 && activeSpContacts.length > 0) {
      let approvingContactsArray;
      if (configs.some((config) => config.name === 'Approving_Contacts')) {
        approvingContactsArray = configs
          .find((config) => config.name === 'Approving_Contacts')
          ?.value.split(',')
          .filter((configEmail) =>
            activeSpContacts.some(
              (activeSpUser) =>
                activeSpUser.contact[0].email.toLowerCase() === configEmail.trim().toLowerCase()
            )
          )
          .map((configEmail) => {
            const fullContactObj = activeSpContacts.find(
              (activeSpUser) =>
                activeSpUser.contact[0].email.toLowerCase() === configEmail.trim().toLowerCase()
            );
            return fullContactObj.contact[0];
          })
          .sort((a, b) => {
            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
            if (nameA < nameB) return -1; // nameA comes first
            if (nameA > nameB) return 1; // nameB comes first
            return 0; // names are equal
          });
      } else {
        approvingContactsArray = activeSpContacts.map((activeSpUser) => activeSpUser.contact[0]);
      }
      setApprovingContacts(approvingContactsArray);
    }
  }, [configs, activeSpContacts]);

  useEffect(() => {
    // // eslint-disable-next-line no-debugger
    // debugger
    if (
      machineServiceRecord?.approval?.approvingContacts?.length > 0 &&
      machineServiceRecord?.approval?.approvingContacts?.includes(user?.contact)
    ) {
      setAllowApproval(true);
    }
  }, [machineServiceRecord, user]);

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
        <ApproveSeviceRecord
          isLoading={isLoading}
          recordStatus={recordStatus}
          approvingContacts={approvingContacts}
        />
      ) : (
        <SendApprovalEmails
          isLoading={isLoading}
          recordStatus={recordStatus}
          approvingContacts={approvingContacts}
        />
      )}
    </Dialog>
  );
}

export default DialogServiceRecordComplete;

const SendApprovalEmails = ({ isLoading, recordStatus, approvingContacts }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);
  const { user } = useAuthContext();

  const CompleteServiceRecordSchema = Yup.object().shape({
    contacts: Yup.array().min(1, 'At least one contact is required').required(),
  });

  const methods = useForm({
    resolver: yupResolver(CompleteServiceRecordSchema),
    defaultValues: {
      contacts: [],
    },
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = methods;

  const { contacts } = watch();

  const handleCloseDialog = () => {
    dispatch(setCompleteDialog(false));
    reset();
  };

  const onSendEmailsSubmit = async (data) => {
    try {
      const params = {
        approvingContacts: data?.contacts,
        status: recordStatus?.value || '',
        serviceId: machineServiceRecord?.serviceId || '',
        submittedBy: user,
        submittedAt: new Date(),
      };

      await dispatch(
        sendMachineServiceRecordForApproval(
          machineServiceRecord?.machine?._id,
          machineServiceRecord?._id,
          params
        )
      );
      await enqueueSnackbar(`Service Record Approval Email Sent Successfully!`);
      await handleCloseDialog();
      await dispatch(
        getMachineServiceRecord(machineServiceRecord?.machine?._id, machineServiceRecord?._id)
      );
    } catch (err) {
      enqueueSnackbar(`Service Record Approval Email Failed to Send! `, { variant: 'error' });
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
              // disableCloseOnSelect
              filterSelectedOptions
              label="Send Approval Email to Contacts"
              name="contacts"
              options={approvingContacts}
              isOptionEqualToValue={(option, value) => option?._id === value?._id}
              getOptionLabel={(option) => `${option.firstName || ''} ${option.lastName || ''}`}
              renderOption={(props, option) => (
                <li {...props} key={option?._id}>{`${option?.firstName || ''} ${
                  option?.lastName || ''
                }`}</li>
              )}
            />
          ) : (
            <SkeletonLine />
          )}
          {contacts?.length > 0 && (
            <Alert severity="info" variant="filled">
              Email will be sent to selected contacts?
            </Alert>
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
        >
          Send Email
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

const ApproveSeviceRecord = ({ isLoading, recordStatus }) => {
  const [approvalSubmitting, setApprovalSubmitting] = useState(false);
  const [rejectionSubmitting, setRejectionSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);
  const { user } = useAuthContext();
  const maxLength = 500;

  const CompleteServiceRecordSchema = Yup.object().shape({
    comments: Yup.string().required('You need to enter a comment in order to proceed'),
  });

  const methods = useForm({
    resolver: yupResolver(CompleteServiceRecordSchema),
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
    handleSubmit(approveServiceRecord)();
  };

  const handleCloseDialog = () => {
    dispatch(setCompleteDialog(false));
    reset();
  };

  const approveServiceRecord = async (data) => {
    try {
      if (data?.status === 'APPROVED') {
        setApprovalSubmitting(true);
      } else {
        setRejectionSubmitting(true);
      }
      const params = {
        status: data?.status,
        comments: data?.comments,
        evaluatedBy: user?.contact,
        evaluationDate: new Date(),
      };

      await dispatch(
        approveServiceRecordRequest(
          machineServiceRecord?.machine?._id,
          machineServiceRecord?._id,
          params
        )
      );
      await enqueueSnackbar(
        `Service Record ${data?.status === 'APPROVED' ? 'Approved' : 'Rejected'} Successfully!`
      );
      await dispatch(
        getMachineServiceRecord(machineServiceRecord?.machine?._id, machineServiceRecord?._id)
      );
    } catch (err) {
      enqueueSnackbar(
        `Service Record ${data?.status === 'APPROVED' ? 'Approval' : 'Rejection'} Failed! `,
        { variant: 'error' }
      );
      console.error(err.message);
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
              label="Service Record Comments"
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
              onClick={() => handleStatusChange('REJECTED')}
            >
              Reject
            </LoadingButton>
            <LoadingButton
              disabled={isSubmitting}
              loading={approvalSubmitting}
              variant="contained"
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
  recordStatus: PropTypes.object,
  approvingContacts: PropTypes.array,
};

ApproveSeviceRecord.propTypes = {
  isLoading: PropTypes.bool,
  recordStatus: PropTypes.object,
};
