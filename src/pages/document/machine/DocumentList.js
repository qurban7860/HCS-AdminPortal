import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Stack,
  Card,
  Grid,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import { useSettingsContext } from '../../../components/settings';
import { useTable, getComparator, TableNoData } from '../../../components/table';
import Iconify from '../../../components/iconify';
// sections
import {
  getMachineDocuments,
  setMachineDocumentFormVisibility,
  setMachineDocumentEditFormVisibility,
} from '../../../redux/slices/document/machineDocument';
import { setDocumentTypeFormVisibility } from '../../../redux/slices/document/documentType';
import { setDocumentCategoryFormVisibility } from '../../../redux/slices/document/documentCategory';

import DocumentAddForm from '../dashboard/documents/DocumentAddForm';
import DocumentEditForm from './DocumentEditForm';
import DocumentViewForm from './DocumentViewForm';
import DocumentNameAddForm from '../documentType/DocumentTypeAddForm';
import DocumentCategoryAddForm from '../documentCategory/DocumentCategoryAddForm';
import ListSwitch from '../../components/ListSwitch';
import { BUTTONS } from '../../../constants/default-constants';
import _mock from '../../../_mock';
import { fDate } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

const _accordions = [...Array(8)].map((_, index) => ({
  id: _mock.id(index),
  value: `panel${index + 1}`,
  heading: `Site ${index + 1}`,
  subHeading: _mock.text.title(index),
  detail: _mock.text.description(index),
}));

// ----------------------------------------------------------------------

export default function DocumentList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: '-createdAt',
  });

  const [controlled, setControlled] = useState(false);

  const handleChangeControlled = (panel) => (event, isExpanded) => {
    setControlled(isExpanded ? panel : false);
  };
  const dispatch = useDispatch();

  const {
    initial,
    error,
    responseMessage,
    machineDocuments,
    machineDocumentEditFormVisibility,
    machineDocumentFormVisibility,
  } = useSelector((state) => state.machineDocument);
  const { documentCategoryFormVisibility } = useSelector((state) => state.documentCategory);
  const { documentTypeFormVisibility } = useSelector((state) => state.documentType);
  const { machine } = useSelector((state) => state.machine);
  const toggleChecked = async () => {
    dispatch(setMachineDocumentFormVisibility(!machineDocumentFormVisibility));
  };
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleAccordianClick = (accordianIndex) => {
    if (accordianIndex === activeIndex) {
      setActiveIndex(null);
    } else {
      setActiveIndex(accordianIndex);
    }
  };

  useEffect(() => {
    if (machine && machine?._id && !machineDocumentFormVisibility && ! machineDocumentEditFormVisibility) {
      console.log("machineDocumentFormVisibility : ",machineDocumentFormVisibility)
      dispatch(getMachineDocuments(machine?._id));
    }
    if(!machineDocumentEditFormVisibility){
      dispatch(setMachineDocumentEditFormVisibility(false));
    }
    if(!machineDocumentFormVisibility){
      dispatch(setMachineDocumentFormVisibility(false))
    }
    dispatch(setDocumentCategoryFormVisibility(false));
    dispatch(setDocumentTypeFormVisibility(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, machine._id, machineDocumentFormVisibility, machineDocumentEditFormVisibility]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    dispatch(setMachineDocumentFormVisibility(false))
    dispatch(setMachineDocumentEditFormVisibility(false));
    setTableData(machineDocuments);
  }, [machineDocuments, dispatch]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const denseHeight = dense ? 60 : 80;
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound =
    !machineDocuments.length &&
    !machineDocumentFormVisibility &&
    !machineDocumentEditFormVisibility &&
    !documentTypeFormVisibility &&
    !documentCategoryFormVisibility;

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus([]);
  };

  const handleFormVisibility = () => {
    dispatch(setMachineDocumentFormVisibility(false));
  }
  return (
    <>
      {!machineDocumentEditFormVisibility &&
        !documentTypeFormVisibility &&
        !documentCategoryFormVisibility && (
          <Stack
            spacing={2}
            alignItems="center"
            direction={{ xs: 'column', md: 'row' }}
            sx={{ py: 2 }}
          >
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={12} sm={9} sx={{ display: 'inline-flex' }}>
                <Grid item xs={12} sm={8}>
                  {!machineDocumentFormVisibility && (
                    <TextField
                      fullWidth
                      value={filterName}
                      onChange={handleFilterName}
                      placeholder="Search..."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                </Grid>
                {isFiltered && (
                  <Button
                    color="error"
                    sx={{ flexShrink: 0, ml: 1 }}
                    onClick={handleResetFilter}
                    startIcon={<Iconify icon="eva:trash-2-outline" />}
                  >
                    {BUTTONS.CLEAR}
                  </Button>
                )}
              </Grid>
              <Grid item xs={8} sm={3}>
                <Stack alignItems="flex-end" sx={{ my: 'auto' }}>
                {!machine.transferredMachine && <Button
                    sx={{ p: 1 }}
                    onClick={toggleChecked}
                    variant="contained"
                    startIcon={
                      !machineDocumentFormVisibility ? (
                        <Iconify icon="eva:plus-fill" />
                      ) : (
                        <Iconify icon="eva:minus-fill" />
                      )
                    }
                  >
                    {BUTTONS.DOCUMENT}
                  </Button>
                }
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        )}

      {!machineDocumentEditFormVisibility &&
        !documentTypeFormVisibility &&
        !documentCategoryFormVisibility &&
        machineDocumentFormVisibility && <DocumentAddForm machinePage handleFormVisibility={handleFormVisibility}/>}
      {!machineDocumentEditFormVisibility &&
        !documentTypeFormVisibility &&
        documentCategoryFormVisibility &&
        !machineDocumentFormVisibility && <DocumentCategoryAddForm />}
      {!machineDocumentEditFormVisibility &&
        documentTypeFormVisibility &&
        !documentCategoryFormVisibility &&
        !machineDocumentFormVisibility && <DocumentNameAddForm />}
      {machineDocumentEditFormVisibility &&
        !documentTypeFormVisibility &&
        !documentCategoryFormVisibility &&
        !machineDocumentFormVisibility && <DocumentEditForm />}

      {/* {machineDocumentEditFormVisibility  && <DocumentEditForm/>} */}
      <Card sx={{ mt: 2 }}>
        {!machineDocumentEditFormVisibility &&
          !machineDocumentFormVisibility &&
          !documentCategoryFormVisibility &&
          !documentTypeFormVisibility &&
          dataFiltered.map((document, index) => {
            const borderTopVal = index !== 0 ? '1px solid lightGray' : '';
            return (
              <Accordion
                key={document._id}
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
                      <Grid item xs={12} sm={4} md={2.4}>
                        {document?.displayName || ''}
                      </Grid>
                      <Grid item xs={12} sm={4} md={2.4}>
                        {document?.docType?.name || ''}
                      </Grid>
                      <Grid item xs={12} sm={4} md={2.4}>
                        {document?.docCategory?.name || ''}
                      </Grid>
                      {/* <Grid
                        item
                        xs={12}
                        display={{ xs: 'none', sm: 'none', md: 'block', lg: 'block' }}
                        md={2.4}
                      >
                        {document?.customerAccess !== true
                          ? 'customer Access : No'
                          : 'customer Access : Yes'}
                      </Grid> */}
                      <Grid
                        item
                        xs={12}
                        display={{ xs: 'none', sm: 'none', md: 'block', lg: 'block' }}
                        md={2.4}
                      >
                        <ListSwitch isActive={document?.customerAccess} />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        display={{ xs: 'none', sm: 'none', md: 'block', lg: 'block' }}
                        md={2.4}
                      >
                        <Typography>{fDate(document?.createdAt || '')}</Typography>
                      </Grid>
                      <Divider />
                    </Grid>
                  ) : null}
                </AccordionSummary>
                <AccordionDetails sx={{ mt: -5 }}>
                  <DocumentViewForm currentMachineDocument={document} />
                </AccordionDetails>
              </Accordion>
            );
          })}
        <TableNoData isNotFound={isNotFound} />
      </Card>

      {/* <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      /> */}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  // console.log(filterName)
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (document) =>
        document?.category?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        document?.documentName?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        document?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // (document?.isActive ? "Active" : "Deactive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(document?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  return inputData;
}
