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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Grid,
  TextField,
  Skeleton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
// Redux
import { deleteMachineLogRecord, updateMachineLogRecord } from '../../redux/slices/products/machineErpLogs';
// Components
import { Snacks } from '../../constants/machine-constants'
import IconTooltip from '../Icons/IconTooltip';
import ConfirmDialog from '../confirm-dialog/ConfirmDialog';
import CodeMirror from '../CodeMirror/JsonEditor';
import Iconify from '../iconify';
import { camelCaseToNormalText } from '../Utils/textHelpers';

const ResponsiveGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const extraInfo = [
  "customer",  "machine",  "createdBy",  "createdAt",  "updatedBy",  "updatedAt",  "isActive",  "isArchived", "createdIP",  "updatedIP", "archivedByMachine", "batchId", "apiLogId"
]


MachineLogDetailsDialog.propTypes = {
  logDetails: PropTypes.object,
  openLogDetailsDialog: PropTypes.bool,
  setOpenLogDetailsDialog: PropTypes.func,
  refreshLogsList: PropTypes.func,
  logType: PropTypes.string,
  allMachineLogsPage: PropTypes.bool,
};

function MachineLogDetailsDialog({
  logDetails,
  logType,
  openLogDetailsDialog,
  setOpenLogDetailsDialog,
  refreshLogsList,
  allMachineLogsPage
}) {
  const [logsToShow, setLogsToShow] = useState({});
  const [deleteConfirmationDialog, setDeleteConfirmationDialog] = useState(null);
  const [logEditState, setLogEditState] = useState(false);
  const [editedLogs, setEditedLogs] = useState({});
  const { isLoading } = useSelector((state) => state.machineErpLogs);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const isArchivedStatus = logDetails?.isArchived

  useEffect(() => {
    if (logDetails) {
      const formattedLog = formatMachineLogToShow(logDetails);
      setLogsToShow(formattedLog);
    }
  }, [logDetails]);

  const formatMachineLogToShow = (log) => {
    // eslint-disable-next-line no-unused-vars
    const { createdIP, updatedIP, __v, machine, customer, updatedBy, createdBy, createdByIdentifier, updatedByIdentifier, archivedByMachine, createdAt, updatedAt, isActive, isArchived, type, version, batchId, apiLogId, ...rest } = log;

    return {...rest};
  };

  const handleLogAction = async (action) => {
    // eslint-disable-next-line no-unused-vars
    const { archivedByMachine, createdAt, createdBy, createdIP, customer, machine, type, updatedAt, updatedBy, updatedIP, createdByIdentifier, updatedByIdentifier, __v, _id, apiLogId, ...rest } = { ...logDetails };
    
    let dataToSend;
    
    switch (action) {
      case 'update': {
        dataToSend = { ...editedLogs, isActive: true, isArchived: false };
        const res = await dispatch(updateMachineLogRecord(logDetails._id, logType, dataToSend));
        if (res?.success) enqueueSnackbar(Snacks.machineLogUpdated);
        break;
      }
      case 'archive': {
        dataToSend = { ...rest, isActive: false, isArchived: true };
        const res = await dispatch(updateMachineLogRecord(logDetails._id, logType, dataToSend));
        if (res?.success) enqueueSnackbar(Snacks.machineLogArchived);
        break;
      }
      case 'restore': {
        dataToSend = { ...rest, isActive: true, isArchived: false };
        const res = await dispatch(updateMachineLogRecord(logDetails._id, logType, dataToSend));
        if (res?.success) enqueueSnackbar(Snacks.machineLogRestored);
        break;
      }
      case 'delete': {
        const res = await dispatch(deleteMachineLogRecord(logDetails._id, logType));
        if (res?.success) enqueueSnackbar(Snacks.machineLogDeleted);
        break;
      }
      default:
        return;
    }

    if (action === 'update') {
      setLogsToShow({ ...logsToShow, ...editedLogs });
      setLogEditState(false)
    }
    else {
      setDeleteConfirmationDialog(false);
      setOpenLogDetailsDialog(false);
    }
    refreshLogsList();
  };


  const handleCloseDialog = () => {
    setOpenLogDetailsDialog(false);
  };

  const handleEdit = () => {
    // eslint-disable-next-line no-unused-vars
    const { archivedByMachine, createdAt, createdBy, createdIP, customer, machine, type, version, updatedAt, updatedBy, updatedIP, createdByIdentifier, updatedByIdentifier, __v, _id, isActive, isArchived, batchId, srcInfo, apiLogId, ...rest } = { ...logsToShow };
    setEditedLogs(rest);
    setLogEditState(true);
  };

  const handleArchiveDeleteConfirm = (type) => {
    setDeleteConfirmationDialog(type);
  };

  const handleLogChange = (key, value) => {
    setEditedLogs((prev) => ({ ...prev, [key]: value }));
  };

  const showEditButton = () => !logEditState && !isArchivedStatus

  const theme = useTheme();

  const renderDialogContent = () => {
    if (logEditState) {
      return <EditMachineLogDetails logsToEdit={editedLogs} handleChange={handleLogChange} />;
    }
    if (isLoading) {
      return <LoadingSkeletons />;
    }
    return <LogDetailsContent logsToShow={logsToShow} logDetails={logDetails} />;
  };

  return (
    <>
      <Dialog open={!!openLogDetailsDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1, pt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              {logEditState && 'Edit '}Log Details
            </Typography>
            {!allMachineLogsPage ? (
              <Stack direction="row" spacing={1.5} alignItems="center">
                {isArchivedStatus ? (
                  <IconTooltip
                    title="Restore"
                    onClick={() => handleLogAction('restore')}
                    color={theme.palette.primary.main}
                    icon="clarity:unarchive-solid"
                  />
                ) : null}
                {showEditButton() && (
                  <IconTooltip
                    title="Edit"
                    onClick={() => {
                      handleEdit();
                    }}
                    color={theme.palette.primary.main}
                    icon="mdi:pencil-outline"
                  />
                )}
                {!logEditState ? (
                  <IconTooltip
                    title={isArchivedStatus ? 'Delete' : 'Archive'}
                    onClick={() =>
                      handleArchiveDeleteConfirm(isArchivedStatus ? 'Delete' : 'Archive')
                    }
                    color="#FF0000"
                    icon={isArchivedStatus ? 'mdi:delete' : 'mdi:archive'}
                  />
                ) : null}
              </Stack>
            ) : null}
          </Stack>
        </DialogTitle>
        <Divider orientation="horizontal" flexItem sx={{ mb: 2 }} />
        <DialogContent>
          {renderDialogContent()}
        </DialogContent>
        <DialogActions>
          {logEditState ? (
            <>
              <Button
                variant="outlined"
                disabled={isLoading}
                onClick={() => setLogEditState(false)}
              >
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                loading={isLoading}
                color="primary"
                onClick={() => handleLogAction('update')}
              >
                Update
              </LoadingButton>
            </>
          ) : (
            <Button variant="outlined" onClick={handleCloseDialog}>
              Close
            </Button>
          )}
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
              onClick={() => handleLogAction(isArchivedStatus ? 'delete' : 'archive')}
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
export default MachineLogDetailsDialog;

EditMachineLogDetails.propTypes = {
  logsToEdit: PropTypes.object,
  handleChange: PropTypes.func,
};
function EditMachineLogDetails({ logsToEdit, handleChange }) {
  const disabledFields = ['measurementUnit']
  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {Object.entries(logsToEdit).map(([key, value]) => (
          <Grid item xs={12} sm={6} key={key}>
            <Typography variant="subtitle2" gutterBottom>
              {key}
            </Typography>
            <TextField
              fullWidth
              disabled={disabledFields.includes(key)}
              size='small'
              variant="outlined"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

const LoadingSkeletons = () => (
  <>
    <Skeleton variant="rectangular" width="100%" height={200} />
    <Skeleton variant="rectangular" width="100%" height={50} sx={{ mt: 2 }} />
    <Skeleton variant="rectangular" width="100%" height={100} sx={{ mt: 2 }} />
  </>
);

const LogDetailsContent = ({ logsToShow, logDetails }) => {
  const theme = useTheme();
  return (
  <>
    <CodeMirror
      value={JSON.stringify(logsToShow, null, 2)}
      HandleChangeIniJson={() => {}}
      editable={false}
      disableTopBar
      autoHeight
    />
    <Accordion>
      <AccordionSummary
        aria-controls="panel1-content"
        id="panel1-header"
        expandIcon={<Iconify icon="ep:arrow-down-bold" color={theme.palette.text.secondary} />}
      >
        <Typography variant="body2">Additional Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ResponsiveGrid container spacing={2}>
          {extraInfo.map((info, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  color={theme.palette.text.secondary}
                  sx={{ fontWeight: 'bold' }}
                >
                  {camelCaseToNormalText(info)}:
                </Typography>
                <Typography variant="body2" color={theme.palette.text.secondary}>
                  {JSON.stringify(logDetails[info])?.replaceAll('"', '')}
                </Typography>
              </Box>
            </Grid>
          ))}
        </ResponsiveGrid>
      </AccordionDetails>
    </Accordion>
  </>
)};

LogDetailsContent.propTypes = {
  logsToShow: PropTypes.object,
  logDetails: PropTypes.object,
};