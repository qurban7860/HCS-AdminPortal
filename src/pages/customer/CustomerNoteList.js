import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Grid,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { fDateTime } from '../../utils/formatTime';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_CUSTOMER } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import { useSettingsContext } from '../../components/settings';
import { useTable, getComparator, TableNoData } from '../../components/table';
import Iconify from '../../components/iconify';
import BreadcrumbsProvider from '../components/Breadcrumbs/BreadcrumbsProvider';
import BreadcrumbsLink from '../components/Breadcrumbs/BreadcrumbsLink';
import AddButtonAboveAccordion from '../components/Defaults/AddButtonAboveAcoordion';
import ConfirmDialog from '../../components/confirm-dialog';
// sections
import NotesViewForm from './note/NotesViewForm';
import NoteEditForm from './note/NoteEditForm';
import NoteAddForm from './note/NoteAddForm';
import { getNotes, deleteNote, setNoteFormVisibility } from '../../redux/slices/customer/note';
import { getActiveSites } from '../../redux/slices/customer/site';
import { getActiveContacts } from '../../redux/slices/customer/contact';
import { BUTTONS, BREADCRUMBS, DIALOGS } from '../../constants/default-constants';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'note', label: 'Note', align: 'left' },
  { id: 'isDisabled', label: 'Disabled', align: 'left' },
  { id: 'created_at', label: 'Created At', align: 'left' },
  { id: 'action', label: 'Actions', align: 'left' },
];

// ----------------------------------------------------------------------

export default function CustomerNoteList() {
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    selected,
    setSelected,
  } = useTable({
    defaultOrderBy: '-createdAt',
  });
  const dispatch = useDispatch();
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const { customer } = useSelector((state) => state.customer);
  const [checked, setChecked] = useState(false);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const {
    notes,
    isLoading,
    error,
    initial,
    responseMessage,
    noteEditFormVisibility,
    formVisibility,
  } = useSelector((state) => state.note);

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const isNotFound = !notes.length && !noteEditFormVisibility && !formVisibility;

  // -----------------------------hooks-------------------------------

  useLayoutEffect(() => {
    if (!formVisibility && !noteEditFormVisibility) {
      dispatch(getNotes(customer._id));
      dispatch(getActiveContacts(customer._id));
      dispatch(getActiveSites(customer._id));
    }
  }, [dispatch, customer._id, noteEditFormVisibility, formVisibility]);
  // console.log(customer._id)
  useEffect(() => {
    if (initial) {
      setTableData(notes);
    }
  }, [notes, error, checked, customer, responseMessage, enqueueSnackbar, initial]);

  // -----------------------------handle functions---------------------------------

  const handleAccordianClick = (accordianIndex) => {
    if (accordianIndex === activeIndex) {
      setActiveIndex(null);
    } else {
      setActiveIndex(accordianIndex);
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    // console.log("Expended : ",expanded)
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };
  const toggleChecked = () => {
    setChecked((value) => !value);
    dispatch(setNoteFormVisibility(!formVisibility));
  };

  const handleDeleteRow = async (id) => {
    try {
      // console.log(id);
      await dispatch(deleteNote(id));
      setExpanded(false);
      dispatch(getNotes());
      setSelected([]);
    } catch (err) {
      console.log(err.message);
    }
  };

  const toggleCancel = () => {
    dispatch(setNoteFormVisibility(!formVisibility));
    setChecked(false);
  };

  return (
    <>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={12} md={6}>
          <BreadcrumbsProvider>
            <BreadcrumbsLink to={PATH_CUSTOMER.list} name={BREADCRUMBS.CUSTOMERS} />
            <BreadcrumbsLink to={PATH_CUSTOMER.view} name={customer.name} />
            <BreadcrumbsLink to={PATH_CUSTOMER.notes} name="Notes" />
          </BreadcrumbsProvider>
        </Grid>
        <AddButtonAboveAccordion
          name={BUTTONS.NEWNOTE}
          toggleChecked={toggleChecked}
          FormVisibility={formVisibility}
          toggleCancel={toggleCancel}
          disabled={noteEditFormVisibility}
        />
      </Grid>
      <Grid container mt={1}>
        <Grid item xs={12} md={12}>
          <Card>
            {noteEditFormVisibility && <NoteEditForm />}
            {formVisibility && !noteEditFormVisibility && <NoteAddForm />}
            {!formVisibility &&
              !noteEditFormVisibility &&
              notes.map((note, index) => {
                const borderTopVal = index !== 0 ? '1px solid lightGray' : '';
                return (
                  <Accordion
                    key={note._id}
                    expanded={expanded === index}
                    onChange={handleChange(index)}
                    sx={{ borderTop: borderTopVal }}
                  >
                    <AccordionSummary
                      mt={1}
                      expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                      onClick={() => handleAccordianClick(index)}
                    >
                      {index !== activeIndex ? (
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={9} md={10} >
                            <Typography 
                            sx={{
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              width: '100%',
                              '@media (min-width: 300px)': { 
                                width: '300px', 
                              },
                            }}
                            >
                              {note.note}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={3} md={2} sx={{ overflowWrap: 'break-word' }}>
                            <Typography> {fDateTime(note.createdAt)} </Typography>{' '}
                          </Grid>
                        </Grid>
                      ) : null}
                    </AccordionSummary>
                    <AccordionDetails sx={{ mt: -5 }}>
                      <NotesViewForm currentNote={note} />
                    </AccordionDetails>
                  </Accordion>
                );
              })}
          </Card>
        </Grid>
      </Grid>
      <Grid item lg={12}>
        <TableNoData isNotFound={isNotFound} />
      </Grid>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title={DIALOGS.DELETE.title}
        content={DIALOGS.DELETE.content}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRow(selected);
              handleCloseConfirm();
            }}
          >
            {BUTTONS.DELETE}
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);
  if (filterName) {
    inputData = inputData.filter(
      (note) => note.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }
  if (filterStatus.length) {
    inputData = inputData.filter((note) => filterStatus.includes(note.status));
  }
  return inputData;
}
