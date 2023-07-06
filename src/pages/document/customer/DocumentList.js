import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Stack,
  Card,
  Grid,
  Breadcrumbs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_CUSTOMER, PATH_DASHBOARD } from '../../../routes/paths';
// components
import useResponsive from '../../../hooks/useResponsive';
import { useTable, getComparator, TableNoData } from '../../../components/table';
// components
import Iconify from '../../../components/iconify';
import BreadcrumbsLink from '../../components/Breadcrumbs/BreadcrumbsLink';
import SearchInput from '../../components/Defaults/SearchInput';
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
import AddButtonAboveAccordion from '../../components/Defaults/AddButtonAboveAcoordion';
import ListSwitch from '../../components/Defaults/ListSwitch';
import { fDate } from '../../../utils/formatTime';
import { BUTTONS, BREADCRUMBS } from '../../../constants/default-constants';

// ----------------------------------------------------------------------

// const _accordions = [...Array(8)].map((_, index) => ({
//   id: _mock.id(index),
//   value: `panel${index + 1}`,
//   heading: `Site ${index + 1}`,
//   subHeading: _mock.text.title(index),
//   detail: _mock.text.description(index),
// }));

// ----------------------------------------------------------------------

export default function DocumentList() {
  const { order, orderBy } = useTable({ defaultOrderBy: '-createdAt' });
  const isMobile = useResponsive('down', 'sm');
  const dispatch = useDispatch();

  const {
    error,
    responseMessage,
    customerDocuments,
    customerDocumentEditFormVisibility,
    customerDocumentFormVisibility,
  } = useSelector((state) => state.customerDocument);

  const { documentCategoryFormVisibility } = useSelector((state) => state.documentCategory);
  const { documentTypeFormVisibility } = useSelector((state) => state.documentType);
  const { customer } = useSelector((state) => state.customer);
  // console.log("customerDocuments : ",customerDocuments)

  const [checked, setChecked] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (customer && customer?._id) {
      dispatch(getCustomerDocuments(customer?._id));
    }
    dispatch(setCustomerDocumentEditFormVisibility(false));
    dispatch(setCustomerDocumentFormVisibility(false));
    dispatch(setDocumentCategoryFormVisibility(false));
    dispatch(setDocumentTypeFormVisibility(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, customer._id]);

  useEffect(() => {
    setTableData(customerDocuments);
  }, [customerDocuments, error, responseMessage]);

  const toggleChecked = async () => {
    dispatch(setCustomerDocumentFormVisibility(!customerDocumentFormVisibility));
  };

  const toggleCancel = () => {
    dispatch(setCustomerDocumentFormVisibility(false));
    setChecked(false);
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

  const handleFilterName = (e) => {
    setFilterName(e.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus([]);
  };

  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound =
    !customerDocuments.length &&
    !customerDocumentFormVisibility &&
    !customerDocumentEditFormVisibility &&
    !documentTypeFormVisibility &&
    !documentCategoryFormVisibility;

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
            <BreadcrumbsLink to={PATH_CUSTOMER.list} name={BREADCRUMBS.CUSTOMERS} />
            <BreadcrumbsLink to={PATH_CUSTOMER.view(customer._id)} name={customer.name} />
            <BreadcrumbsLink
              to={PATH_DASHBOARD.customer.document}
              name={
                <Stack>
                  {!expanded &&
                    !customerDocumentEditFormVisibility &&
                    customerDocumentFormVisibility &&
                    BREADCRUMBS.NEWDOCUMENT}
                  {!customerDocumentFormVisibility &&
                    !customerDocumentEditFormVisibility &&
                    BREADCRUMBS.DOCUMENTS}
                  {customerDocumentEditFormVisibility && BREADCRUMBS.EDITDOCUMENT}
                  {documentTypeFormVisibility && BREADCRUMBS.NEWDOCUMENT_TYPE}
                  {documentCategoryFormVisibility && BREADCRUMBS.NEWDOCUMENT_CATEGORY}
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
                    FormVisibility={customerDocumentFormVisibility}
                    toggleCancel={toggleCancel}
                    disabled={customerDocumentEditFormVisibility}
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
                FormVisibility={customerDocumentFormVisibility}
                disabled={
                  customerDocumentEditFormVisibility ||
                  customerDocumentFormVisibility ||
                  customerDocuments.length === 0
                }
                size="small"
                isSearchBar
                display={customerDocuments.length === 0 ? 'none' : 'inline-flex'}
              />
            </Grid>
            {!isMobile && (
              <Grid item xs={12} md={3}>
                <Grid container justifyContent="flex-end">
                  <AddButtonAboveAccordion
                    name={BUTTONS.NEWDOCUMENT}
                    toggleChecked={toggleChecked}
                    FormVisibility={customerDocumentFormVisibility}
                    toggleCancel={toggleCancel}
                    disabled={customerDocumentEditFormVisibility}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

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

export function applyFilter({ inputData, comparator, filterName, filterStatus }) {
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
