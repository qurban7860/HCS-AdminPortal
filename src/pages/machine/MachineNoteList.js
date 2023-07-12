import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Grid,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Breadcrumbs,
} from '@mui/material';
import { fDate } from '../../utils/formatTime';

// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_MACHINE } from '../../routes/paths';
// hooks
import { useSnackbar } from '../../components/snackbar';
import { useSettingsContext } from '../../components/settings';
// components
import { useTable, getComparator, TableNoData } from '../../components/table';
import BreadcrumbsProvider from '../components/Breadcrumbs/BreadcrumbsProvider';
import BreadcrumbsLink from '../components/Breadcrumbs/BreadcrumbsLink';
import Iconify from '../../components/iconify';
// sections
import NotesViewForm from './Note/NotesViewForm';
import NoteEditForm from './Note/NoteEditForm';
import NoteAddForm from './Note/NoteAddForm';
import AddButtonAboveAccordion from '../components/Defaults/AddButtonAboveAcoordion';
import {
  getNotes,
  deleteNote,
  setNoteFormVisibility,
} from '../../redux/slices/products/machineNote';
// constants
import { BUTTONS, BREADCRUMBS } from '../../constants/default-constants';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'note', label: 'Note', align: 'left' },
  { id: 'isDisabled', label: 'Disabled', align: 'left' },
  { id: 'created_at', label: 'Created At', align: 'left' },
  { id: 'action', label: 'Actions', align: 'left' },
];

const STATUS_OPTIONS = [
  // { id: '1', value: 'Order Received' },
  // { id: '2', value: 'In Progress' },
  // { id: '3', value: 'Ready For Transport' },
  // { id: '4', value: 'In Freight' },
  // { id: '5', value: 'Deployed' },
  // { id: '6', value: 'Archived' },
];

// const STATUS_OPTIONS = [
//   { value: 'all_notes', label: 'All Note' },
//   { value: 'deployable', label: 'All Deployable' },
//   { value: 'pending', label: 'All Pending' },
//   { value: 'archived', label: 'All Archived' },
//   { value: 'undeployable', label: 'All Undeployable' }
// ];

// ----------------------------------------------------------------------

export default function MachineNoteList() {
  const { page, order, orderBy, rowsPerPage, setSelected } = useTable({
    defaultOrderBy: 'createdAt',
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
  const { machine } = useSelector((state) => state.machine);
  const [checked, setChecked] = useState(false);

  const {
    notes,
    isLoading,
    error,
    initial,
    responseMessage,
    noteEditFormVisibility,
    formVisibility,
  } = useSelector((state) => state.machinenote);

  useLayoutEffect(() => {
    if (!formVisibility && !noteEditFormVisibility) {
      dispatch(getNotes(machine._id));
    }
  }, [dispatch, machine._id, noteEditFormVisibility, formVisibility]);

  useEffect(() => {
    if (initial) {
      setTableData(notes);
    }
  }, [notes, error, checked, machine, responseMessage, enqueueSnackbar, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  //  -----------------------------------------------------------------------
  const toggleChecked = () => {
    setChecked((value) => !value);
    dispatch(setNoteFormVisibility(!formVisibility));
  };

  const toggleCancel = () => {
    dispatch(setNoteFormVisibility(false));
  };

  const handleAccordianClick = (accordianIndex) => {
    if (accordianIndex === activeIndex) {
      setActiveIndex(null);
    } else {
      setActiveIndex(accordianIndex);
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleDeleteRow = async (id) => {
    try {
      await dispatch(deleteNote(id));
      setExpanded(false);
      dispatch(getNotes(machine._id));
      setSelected([]);
    } catch (err) {
      console.log(err.message);
    }
  };

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  return (
    <>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={12} md={6}>
          <BreadcrumbsProvider>
            <BreadcrumbsLink to={PATH_MACHINE.machines.list} name={BREADCRUMBS.MACHINES} />
            <BreadcrumbsLink to={PATH_MACHINE.machines.view(machine._id)} name={machine.serialNo} />
            <BreadcrumbsLink
              to={PATH_MACHINE.machines.settings}
              name={
                <Stack>
                  {!expanded &&
                    !noteEditFormVisibility &&
                    formVisibility &&
                    BREADCRUMBS.MACHINE_NEWNOTE}
                  {!formVisibility && !noteEditFormVisibility && BREADCRUMBS.MACHINE_NOTE}
                  {noteEditFormVisibility && BREADCRUMBS.MACHINE_EDITNOTE}
                </Stack>
              }
            />
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
      <Grid md={12}>
        <TableNoData isNotFound={isNotFound} />
      </Grid>
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
                  expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                  onClick={() => handleAccordianClick(index)}
                >
                  {index !== activeIndex ? (
                    <Grid container spacing={0}>
                      <Grid item xs={12} sm={9} md={10}>
                        <Typography>
                          {window.innerWidth > 1200 ? note.note.substring(0, 100) : note.note}
                          {note.note.length > 50 ? '...' : null}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3} md={2}>
                        <Typography>{fDate(note.createdAt)}</Typography>
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
