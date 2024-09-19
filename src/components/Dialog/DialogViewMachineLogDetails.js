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

// Components
import IconTooltip from '../Icons/IconTooltip';
import ConfirmDialog from '../confirm-dialog/ConfirmDialog';
import { deleteMachineLogRecord } from '../../redux/slices/products/machineErpLogs';

DialogViewMachineLogDetails.propTypes = {
  logDetails: PropTypes.object,
  openLogDetailsDialog: PropTypes.bool,
  setOpenLogDetailsDialog: PropTypes.func,
  logType: PropTypes.string,
};

function DialogViewMachineLogDetails({
  logDetails,
  logType,
  openLogDetailsDialog,
  setOpenLogDetailsDialog,
}) {
  const [logsToShow, setLogsToShow] = useState([]);
  const [deleteConfirmationDialog, setDeleteConfirmationDialog] = useState(false);
  const [logstoEdit, setLogstoEdit] = useState(null);
  const { isLoading } = useSelector((state) => state.machineErpLogs);
  const dispatch = useDispatch();

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

  const handleDelete = async () => {
    await dispatch(deleteMachineLogRecord(logDetails._id, logType));
    setDeleteConfirmationDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenLogDetailsDialog(false);
  };

  const handleEdit = () => {
    setOpenLogDetailsDialog(false);
  };

  const handleDeleteConfirm = () => {
    setDeleteConfirmationDialog(true);
  };

  const theme = useTheme();

  return (
    <>
      <Dialog open={openLogDetailsDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1, pt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              Log Details
            </Typography>
            {/* <Stack direction="row" spacing={1.5} alignItems="center">
              <IconTooltip
                title="Edit"
                onClick={() => {
                  handleEdit();
                }}
                color={theme.palette.primary.main}
                icon="mdi:pencil-outline"
              />
              <IconTooltip
                title="Delete"
                // disabled={ isDisableDelete || disableDeleteButton }
                onClick={() => {
                  handleDeleteConfirm('delete');
                }}
                color="#FF0000"
                icon="mdi:delete"
              />
            </Stack> */}
          </Stack>
        </DialogTitle>
        <Divider orientation="horizontal" flexItem />
        <DialogContent>
          <pre>{JSON.stringify(logsToShow, null, 2)}</pre>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {deleteConfirmationDialog ? (
        <ConfirmDialog
          title="Delete Log Confirmation"
          content="Are you sure you want to delete this log?"
          action={
            <LoadingButton
              color="error"
              loading={isLoading}
              variant="contained"
              onClick={handleDelete}
            >
              Delete
            </LoadingButton>
          }
          open={deleteConfirmationDialog}
          onClose={() => setDeleteConfirmationDialog(false)}
        />
      ) : null}
    </>
  );
}
export default DialogViewMachineLogDetails;
