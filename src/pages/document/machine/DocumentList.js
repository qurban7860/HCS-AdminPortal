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
  Breadcrumbs,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// hooks
import { useSnackbar } from '../../../components/snackbar';
import { useSettingsContext } from '../../../components/settings';
import useResponsive from '../../../hooks/useResponsive';
// routes
import { PATH_DOCUMENT, PATH_MACHINE } from '../../../routes/paths';
// components
import BreadcrumbsLink from '../../components/Breadcrumbs/BreadcrumbsLink';
import AddButtonAboveAccordion from '../../components/Defaults/AddButtonAboveAcoordion';
import SearchInput from '../../components/Defaults/SearchInput';
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
import DocumentAddForm from './DocumentAddForm';
import DocumentEditForm from './DocumentEditForm';
import DocumentViewForm from './DocumentViewForm';
import DocumentNameAddForm from '../documentType/DocumentTypeAddForm';
import DocumentCategoryAddForm from '../documentCategory/DocumentCategoryAddForm';
import ListSwitch from '../../components/Defaults/ListSwitch';
import _mock from '../../../_mock';
import { fDate } from '../../../utils/formatTime';
// constants
import { BUTTONS, BREADCRUMBS } from '../../../constants/default-constants';
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
  const { dense, page, order, orderBy, rowsPerPage } = useTable({
    defaultOrderBy: '-createdAt',
  });

  const [controlled, setControlled] = useState(false);

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
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useResponsive('down', 'sm');
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (machine?._id) {
      dispatch(getMachineDocuments(machine?._id));
    }
    dispatch(setMachineDocumentEditFormVisibility(false));
    dispatch(setMachineDocumentFormVisibility(false));
    dispatch(setDocumentCategoryFormVisibility(false));
    dispatch(setDocumentTypeFormVisibility(false));
  }, [dispatch, machine._id]);

  useEffect(() => {
    setTableData(machineDocuments);
  }, [machineDocuments, error, responseMessage]);

  const toggleChecked = async () => {
    dispatch(setMachineDocumentFormVisibility(!machineDocumentFormVisibility));
  };

  const toggleCancel = () => {
    dispatch(setMachineDocumentFormVisibility(false));
    // setChecked(false);
  };

  const handleChangeControlled = (panel) => (event, isExpanded) => {
    setControlled(isExpanded ? panel : false);
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

  return (
    <>
      <Grid
        container
        direction={{ sm: 'column', lg: 'row' }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={12} md={6}>
          <Breadcrumbs
            aria-label="breadcrumb"
            separator="›"
            sx={{ fontSize: '12px', color: 'text.disabled' }}
          >
            <BreadcrumbsLink to={PATH_MACHINE.list} name={BREADCRUMBS.MACHINES} />
            <BreadcrumbsLink to={PATH_MACHINE.machines.view(machine._id)} name={machine.serialNo} />
            <BreadcrumbsLink
              to={PATH_DOCUMENT.document.machine}
              name={
                <Stack>
                  {!expanded &&
                    !machineDocumentEditFormVisibility &&
                    machineDocumentFormVisibility &&
                    'New Document'}
                  {!machineDocumentFormVisibility &&
                    !machineDocumentEditFormVisibility &&
                    'Documents'}
                  {machineDocumentEditFormVisibility && 'Edit Document'}
                  {documentTypeFormVisibility && 'New Document Type'}
                  {documentCategoryFormVisibility && 'New Document Category'}
                </Stack>
              }
            />
          </Breadcrumbs>
        </Grid>

        {/* conditional reactive */}
        <Grid item xs={12} md={6}>
          <Grid
            container
            direction={{ sm: 'column', lg: 'row' }}
            justifyContent="flex-end"
            alignItems="center"
          >
            {isMobile && (
              <Grid item xs={12} md={3}>
                <Grid container justifyContent="flex-end">
                  <AddButtonAboveAccordion
                    name={BUTTONS.NEWDOCUMENT}
                    toggleChecked={toggleChecked}
                    FormVisibility={machineDocumentFormVisibility}
                    toggleCancel={toggleCancel}
                    disabled={machineDocumentEditFormVisibility}
                  />
                </Grid>
              </Grid>
            )}
            <Grid item xs={12} md={9} mt={1}>
              <SearchInput
                // searchFormVisibility={formVisibility || contactEditFormVisibility}
                filterName={filterName}
                handleFilterName={handleFilterName}
                isFiltered={isFiltered}
                handleResetFilter={handleResetFilter}
                toggleChecked={toggleChecked}
                toggleCancel={toggleCancel}
                FormVisibility={machineDocumentFormVisibility}
                disabled={
                  machineDocumentEditFormVisibility ||
                  machineDocumentFormVisibility ||
                  machineDocuments.length === 0
                }
                size="small"
                isSearchBar
                display={machineDocuments.length === 0 ? 'none' : 'inline-flex'}
              />
            </Grid>
            {!isMobile && (
              <Grid item xs={12} md={3}>
                <Grid container justifyContent="flex-end">
                  <AddButtonAboveAccordion
                    name={BUTTONS.NEWDOCUMENT}
                    toggleChecked={toggleChecked}
                    FormVisibility={machineDocumentFormVisibility}
                    toggleCancel={toggleCancel}
                    disabled={machineDocumentEditFormVisibility}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      {!machineDocumentEditFormVisibility &&
        !documentTypeFormVisibility &&
        !documentCategoryFormVisibility &&
        machineDocumentFormVisibility && <DocumentAddForm />}
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
      <Card>
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
      </Card>
      <Grid md={12}>
        <TableNoData isNotFound={isNotFound} />
      </Grid>
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
