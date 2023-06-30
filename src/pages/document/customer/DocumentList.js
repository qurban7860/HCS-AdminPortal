import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Stack,
  Card,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Breadcrumbs,
  Typography,
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
import BreadcrumbsLink from '../../components/Breadcrumbs/BreadcrumbsLink';
// sections
import {
  setCustomerDocumentFormVisibility,
  setCustomerDocumentEditFormVisibility,
  getCustomerDocuments,
} from '../../../redux/slices/document/customerDocument';
import { setDocumentTypeFormVisibility } from '../../../redux/slices/document/documentType';
import { setDocumentCategoryFormVisibility } from '../../../redux/slices/document/documentCategory';
import DocumentAddForm from './DocumentAddForm';
import DocumentEditForm from './DocumentEditForm';
import DocumentViewForm from './DocumentViewForm';
import DocumentNameAddForm from '../documentType/DocumentTypeAddForm';
import DocumentCategoryAddForm from '../documentCategory/DocumentCategoryAddForm';
import _mock from '../../../_mock';
import SearchInputAndAddButton from '../../components/SearchInputAndAddButton';
import ListSwitch from '../../components/ListSwitch';
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

  const dispatch = useDispatch();

  const {
    error,
    responseMessage,
    customerDocuments,
    customerDocument,
    customerDocumentEditFormVisibility,
    customerDocumentFormVisibility,
  } = useSelector((state) => state.customerDocument);
  const { fileCategories, fileCategory, documentCategoryFormVisibility } = useSelector(
    (state) => state.documentCategory
  );
  const { documentName, documentNames, documentTypeFormVisibility } = useSelector(
    (state) => state.documentType
  );
  const { customer } = useSelector((state) => state.customer);
  // console.log("customerDocuments : ",customerDocuments)
  const toggleChecked = async () => {
    dispatch(setCustomerDocumentFormVisibility(!customerDocumentFormVisibility));
  };
  const [checked, setChecked] = useState(false);
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
    if (customer?._id) {
      dispatch(getCustomerDocuments(customer?._id));
    }
    dispatch(setCustomerDocumentEditFormVisibility(false));
    dispatch(setCustomerDocumentFormVisibility(false));
    dispatch(setDocumentCategoryFormVisibility(false));
    dispatch(setDocumentTypeFormVisibility(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, customer._id]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    setTableData(customerDocuments);
  }, [customerDocuments, error, responseMessage]);

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
    !customerDocuments.length &&
    !customerDocumentFormVisibility &&
    !customerDocumentEditFormVisibility &&
    !documentTypeFormVisibility &&
    !documentCategoryFormVisibility;

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus([]);
  };

  const toggleCancel = () => {
    dispatch(setCustomerDocumentFormVisibility(false));
    setChecked(false);
  };

  return (
    <>
      <SearchInputAndAddButton
        searchFormVisibility={customerDocumentFormVisibility || customerDocumentEditFormVisibility}
        filterName={filterName}
        handleFilterName={handleFilterName}
        addButtonName="Add Document"
        isFiltered={isFiltered}
        handleResetFilter={handleResetFilter}
        toggleChecked={toggleChecked}
        toggleCancel={toggleCancel}
        FormVisibility={customerDocumentFormVisibility}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Breadcrumbs
          aria-label="breadcrumb"
          separator="›"
          sx={{ fontSize: '12px', color: 'text.disabled' }}
        >
          <BreadcrumbsLink to={PATH_DASHBOARD.customer.list} name="Customers" />
          <BreadcrumbsLink to={PATH_DASHBOARD.customer.view} name={customer.name} />
          <BreadcrumbsLink
            to={PATH_DASHBOARD.customer.document}
            name={
              <Stack>
                {!expanded &&
                  !customerDocumentEditFormVisibility &&
                  customerDocumentFormVisibility &&
                  'New Document'}
                {!customerDocumentFormVisibility &&
                  !customerDocumentEditFormVisibility &&
                  'Documents'}
                {customerDocumentEditFormVisibility && 'Edit Document'}
                {documentTypeFormVisibility && 'New Document Type'}
                {documentCategoryFormVisibility && 'New Document Category'}
              </Stack>
            }
          />
        </Breadcrumbs>
      </Stack>
      <Grid item mt={1}>
        <TableNoData isNotFound={isNotFound} />
      </Grid>
      {!customerDocumentEditFormVisibility &&
        !documentTypeFormVisibility &&
        !documentCategoryFormVisibility &&
        customerDocumentFormVisibility && (
          <Grid item md={12}>
            <DocumentAddForm />
          </Grid>
        )}
      {!customerDocumentEditFormVisibility &&
        !customerDocumentFormVisibility &&
        !documentTypeFormVisibility &&
        documentCategoryFormVisibility && <DocumentCategoryAddForm />}
      {!customerDocumentEditFormVisibility &&
        !customerDocumentFormVisibility &&
        documentTypeFormVisibility &&
        !documentCategoryFormVisibility && <DocumentNameAddForm />}
      {customerDocumentEditFormVisibility &&
        !customerDocumentFormVisibility &&
        !documentTypeFormVisibility &&
        !documentCategoryFormVisibility && (
          <Grid item md={12}>
            <DocumentEditForm />
          </Grid>
        )}

      {/* {customerDocumentEditFormVisibility && <DocumentEditForm/>} */}
      <Card>
        {!customerDocumentEditFormVisibility &&
          !customerDocumentFormVisibility &&
          !documentTypeFormVisibility &&
          !documentCategoryFormVisibility &&
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
                    <Grid container>
                      <Grid item xs={12} sm={4} md={4.4}>
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
                        md={1.4}
                      >
                        <ListSwitch isActive={document?.customerAccess} />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        display={{ xs: 'none', sm: 'none', md: 'block', lg: 'block' }}
                        md={1.4}
                      >
                        {fDate(document?.createdAt || '')}
                      </Grid>
                      <Divider />
                    </Grid>
                  ) : null}
                </AccordionSummary>
                <AccordionDetails sx={{ mt: -5 }}>
                  <DocumentViewForm currentCustomerDocument={document} sx={{ pt: -2 }} />
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
