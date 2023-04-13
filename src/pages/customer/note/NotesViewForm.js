import PropTypes from 'prop-types';
// import * as Yup from 'yup';
import { useCallback, useLayoutEffect, useMemo ,useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

// @mui
// import { LoadingButton } from '@mui/lab';
import { Switch,Box, Card, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link } from '@mui/material';
import { fDate,fDateTime } from '../../../utils/formatTime';

// global
// import { CONFIG } from '../../config-global';
// routes
// import { PATH_DASHBOARD } from '../../routes/paths';
// components
// import { useSnackbar } from '../../components/snackbar';
// import { getNotes, getNote } from '../../redux/slices/note';
import { getNotes, deleteNote, getNote ,setNoteEditFormVisibility} from '../../../redux/slices/customer/note';
import ConfirmDialog from '../../../components/confirm-dialog';
import Iconify from '../../../components/iconify';
import ViewFormAudit from '../../components/ViewFormAudit';

NoteViewForm.propTypes = {
  currentNote: PropTypes.object,

};
export default function NoteViewForm({currentNote = null}) {
  const { note } = useSelector((state) => state.note);
  // console.log("Note : ",note)
  // console.log("Current note : ",currentNote)
  // const navigate = useNavigate();
  // const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { customer } = useSelector((state) => state.customer);

  const  handleEdit = async () => {
    await dispatch(getNote(customer._id,currentNote._id));
    dispatch(setNoteEditFormVisibility(true));
  };

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const onDelete = async () => {
    await dispatch(deleteNote(customer._id,currentNote._id));
    handleCloseConfirm();
    dispatch(getNotes(customer._id));
    // dispatch(getContacts());
  };

//   const dateFormat = async (date) => {
//     const month = date.getMonth();
//     const day = date.getDate();
//     const monthString = month >= 10 ? month : `0${month}`;
//     const dayString = day >= 10 ? day : `0${day}`;
//     return `${date.getFullYear()}-${monthString}-${dayString}`;
// }

  const defaultValues = useMemo(
    () => ({
      id: currentNote?._id || 'N/A',
      site_name:  currentNote.site === null || currentNote.site === undefined ? "" : currentNote.site.name,
      contact_firstName: currentNote.contact === undefined || currentNote.contact === null ? ""  : currentNote.contact.firstName,
      contact_lastName:  currentNote.contact === undefined || currentNote.contact === null ? ""  : currentNote.contact.lastName,
      note: currentNote?.note || "",
      isActive: currentNote.isActive,
      createdAt:                currentNote?.createdAt || "",
      createdByFullname:           currentNote?.createdBy?.name || "",
      createdIP:                currentNote?.createdIP || "",
      updatedAt:                currentNote?.updatedAt || "",
      updatedByFullname:           currentNote?.updatedBy?.name || "",
      updatedIP:                currentNote?.updatedIP || "",

      
    }),
    [currentNote]
  );
  return (
    <Grid sx={{ p: 2 }}>
             <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mb: -4 }}>
            <Button
              onClick={() => handleEdit()}
              variant="outlined"
              startIcon={<Iconify icon="eva:edit-fill" />}
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                handleOpenConfirm();
                handleClosePopover();
              }}
              variant="outlined"
              color="error"
              startIcon={<Iconify icon="eva:trash-2-fill" />}
            >
              Delete
            </Button>
            
            </Stack>

        <Grid container>
            <Grid item xs={12} sm={6} >
              <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                Site
              </Typography>
              <Typography variant="body2">
                  {defaultValues.site_name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} >
              <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                  Contact
              </Typography>
              <Typography variant="body2">
                  {defaultValues.contact_firstName} {defaultValues.contact_lastName !== 'N/A' ?defaultValues.contact_lastName:""}
              </Typography>
            </Grid>
          <Grid item xs={18} sm={12} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
                  Note
              </Typography>
            </Grid>
            <Typography variant="string" sx={{ whiteSpace: 'pre-line'}}>
                {defaultValues.note}
            </Typography>
            <Grid item xs={12} sm={12} >
            Active
            <Switch sx={{mb:1}} checked = { defaultValues.isActive } disabled  />
          </Grid>
          </Grid>
          <Grid container>
          <ViewFormAudit defaultValues={defaultValues}/>
        </Grid>

          <ConfirmDialog
            open={openConfirm}
            onClose={handleCloseConfirm}
            title="Delete"
            content="Are you sure want to delete?"
            action={
              <Button variant="contained" color="error" onClick={onDelete}>
                Delete
              </Button>
            }
          />
      </Grid>
    </Grid>
  );
}
