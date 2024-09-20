import PropTypes from 'prop-types';
// MUI
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
  useTheme,
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
// Redux
import { deleteMachineLogRecord, updateMachineLogRecord } from '../../redux/slices/products/machineErpLogs';
// Components
import IconTooltip from '../Icons/IconTooltip';
import ConfirmDialog from '../confirm-dialog/ConfirmDialog';
import CodeMirror from '../CodeMirror/JsonEditor';


DialogViewMachineLogDetails.propTypes = {
  logDetails: PropTypes.object,
  openLogDetailsDialog: PropTypes.bool,
  setOpenLogDetailsDialog: PropTypes.func,
  refreshLogsList: PropTypes.func,
  logType: PropTypes.string,
};

function DialogViewMachineLogDetails({
  logDetails,
  logType,
  openLogDetailsDialog,
  setOpenLogDetailsDialog,
  refreshLogsList
}) {
  const [logsToShow, setLogsToShow] = useState([]);
  const [deleteConfirmationDialog, setDeleteConfirmationDialog] = useState(null);
  const [logstoEdit, setLogstoEdit] = useState(null);
  const { isLoading } = useSelector((state) => state.machineErpLogs);
  const dispatch = useDispatch();

  const isArchived = logDetails?.isArchived

  useEffect(() => {
    if (logDetails) {
      const formattedLog = formatMachineErpLog(logDetails);
      setLogsToShow(formattedLog);
    }
  }, [logDetails]);

  const formatMachineErpLog = (log) => {
    const { _id, createdIP, updatedIP, __v, ...rest } = log;

    const formatted = {
      ...rest,
      customer: log.customer?.name || '',
      machine: log.machine?.name || '',
      createdBy: log.createdBy?.name || '',
      updatedBy: log.updatedBy?.name || '',
    };

    return formatted;
  };

  const handleDeleteArchiveAction = async () => {
    if (isArchived) {
      await dispatch(deleteMachineLogRecord(logDetails._id, logType));
    } else {
      // eslint-disable-next-line no-unused-vars
      const {archivedByMachine, createdAt, createdBy, createdIP, customer, machine, type, updatedAt, updatedBy, updatedIP, __v, _id, ...rest} = {...logDetails}
      const dataToSend = {...rest, isActive: false, isArchived: true}
      await dispatch(updateMachineLogRecord(logDetails._id, logType, {...dataToSend}));
    }
    setDeleteConfirmationDialog(false);
    setOpenLogDetailsDialog(false);
    refreshLogsList();
  };

  const handleRestoreArchive = async () => {
    // eslint-disable-next-line no-unused-vars
    const {archivedByMachine, createdAt, createdBy, createdIP, customer, machine, type, updatedAt, updatedBy, updatedIP, __v, _id, ...rest} = {...logDetails}
    const dataToSend = {...rest, isActive: true, isArchived: false}
    await dispatch(updateMachineLogRecord(logDetails._id, logType, {...dataToSend}));
    setDeleteConfirmationDialog(false);
    setOpenLogDetailsDialog(false);
    refreshLogsList();
  };

  const handleCloseDialog = () => {
    setOpenLogDetailsDialog(false);
  };

  const handleEdit = () => {
    setOpenLogDetailsDialog(false);
  };

  const handleArchiveDeleteConfirm = (type) => {
    setDeleteConfirmationDialog(type);
  };

  const theme = useTheme();

  return (
    <>
      <Dialog open={!!openLogDetailsDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1, pt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              Log Details
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
            {isArchived ? (
              <IconTooltip
                title="Restore"
                onClick={() => {
                  handleRestoreArchive();
                }}
                color={theme.palette.primary.main}
                icon="clarity:unarchive-solid"
              />
            ) : null}
            {/* {!isArchived ? (
              <IconTooltip
                title="Edit"
                onClick={() => {
                  handleEdit();
                }}
                color={theme.palette.primary.main}
                icon="mdi:pencil-outline"
              />
            ) : null} */}
              <IconTooltip
                title={ isArchived ? "Delete" : "Archive"}
                onClick={() => handleArchiveDeleteConfirm(isArchived ? "Delete" : "Archive")}
                color="#FF0000"
                icon={ isArchived ? "mdi:delete" : "mdi:archive" } 
              />
            </Stack>
          </Stack>
        </DialogTitle>
        <Divider orientation="horizontal" flexItem sx={{ mb: 2 }} />
        <DialogContent>
          <CodeMirror
            value={JSON.stringify(logsToShow, null, 2)}
            HandleChangeIniJson={()=>{}}
            editable={false}
            disableTopBar
          />
          {/* <pre>{JSON.stringify(logsToShow, null, 2)}</pre> */}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {deleteConfirmationDialog ? (
        <ConfirmDialog
          title={`${deleteConfirmationDialog} Log Confirmation`}
          content={`Are you sure you want to ${deleteConfirmationDialog.toLowerCase()} this log?`}
          action={
            <LoadingButton
              color="error"
              loading={isLoading}
              variant="contained"
              onClick={handleDeleteArchiveAction}
            >
              {deleteConfirmationDialog}
            </LoadingButton>
          }
          SubButtonDisabled={isLoading}
          open={!!deleteConfirmationDialog}
          onClose={() => setDeleteConfirmationDialog(null)}
        />
      ) : null}
    </>
  );
}
export default DialogViewMachineLogDetails;
