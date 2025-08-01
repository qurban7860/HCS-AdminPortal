import React, { useState, useLayoutEffect, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
// @mui
import {
  Grid,
  Stack,
  Card,
  Box,
  Table,
  TableBody,
  TableContainer,
  TextField, Autocomplete
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_CRM, PATH_MACHINE, PATH_MACHINE_DRAWING } from '../../routes/paths';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TablePaginationFilter,
  TableHeadFilter,
} from '../../components/table';
import Scrollbar from '../../components/scrollbar';
// sections
import DocumentListTableRow from './DocumentListTableRow';
import DocumentListTableToolbar from './DocumentListTableToolbar';
import {
  getDocuments,
  resetDocuments,
  setFilterBy,
  ChangePage,
  ChangeRowsPerPage,
  // customer document pagination
  setCustomerDocumentFilterBy,
  customerDocumentChangePage,
  customerDocumentChangeRowsPerPage,
  // machine document pagination
  setMachineDocumentFilterBy,
  machineDocumentChangePage,
  machineDocumentChangeRowsPerPage,
  // machinee drawings pagination
  setMachineDrawingsFilterBy,
  machineDrawingsChangePage,
  machineDrawingsChangeRowsPerPage,
  setReportHiddenColumns,
} from '../../redux/slices/document/document';
import { getMachineForDialog, setMachineDialog } from '../../redux/slices/products/machine';
import { getActiveDocumentCategories } from '../../redux/slices/document/documentCategory';
import { getActiveDocumentTypes, getActiveDocumentTypesWithCategory } from '../../redux/slices/document/documentType';
import { getCustomer, setCustomerDialog } from '../../redux/slices/customer/customer';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import { FORMLABELS } from '../../constants/default-constants';
import { fDate } from '../../utils/formatTime';
import TableCard from '../../components/ListTableTools/TableCard';
import RHFFilteredSearchBar from '../../components/hook-form/RHFFilteredSearchBar';

// ----------------------------------------------------------------------
DocumentList.propTypes = {
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
  machineDrawingPage: PropTypes.bool,
  machineDrawings: PropTypes.bool,
};

function DocumentList({ customerPage, machinePage, machineDrawingPage, machineDrawings }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customerId, machineId } = useParams();
  const axiosToken = () => axios.CancelToken.source();
  const cancelTokenSource = axiosToken();
  const methods = useForm({
    defaultValues: {
      filteredSearchKey: '',
    },
  });
  const [filterName, setFilterName] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [categoryVal, setCategoryVal] = useState(null);
  const [typeVal, setTypeVal] = useState(null);
  const [filterStatus, setFilterStatus] = useState([]);
  const { customer } = useSelector((state) => state.customer);
  const { machine } = useSelector((state) => state.machine);
  const { documents,
    documentFilterBy, documentPage, documentRowsPerPage, documentRowsTotal,
    machineDrawingsFilterBy, machineDrawingsPage, machineDrawingsRowsPerPage,
    customerDocumentsFilterBy, customerDocumentsRowsPerPage,
    machineDocumentsFilterBy, machineDocumentsRowsPerPage,
    isLoading, reportHiddenColumns } = useSelector((state) => state.document);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const [totalRows, setTotalRows] = useState(documentRowsTotal);
  const [selectedSearchFilter, setSelectedSearchFilter] = useState('');

  const {
    order,
    orderBy,
    onSort,
  } = useTable({
    defaultOrderBy: machineDrawings ? 'doNotOrder' : 'updatedAt', defaultOrder: 'desc',
  });

  const onChangeRowsPerPage = (event) => {
    if (machineDrawingPage) {
      dispatch(machineDocumentChangePage(0))
      dispatch(machineDocumentChangeRowsPerPage(parseInt(event.target.value, 10)))
    } else if (customerPage) {
      dispatch(customerDocumentChangePage(0))
      dispatch(customerDocumentChangeRowsPerPage(parseInt(event.target.value, 10)))
    } else if (machineDrawings) {
      dispatch(machineDrawingsChangePage(0))
      dispatch(machineDrawingsChangeRowsPerPage(parseInt(event.target.value, 10)))
      dispatch(
        getDocuments(null, null, machineDrawings || null, page,
          machineDrawings ? machineDrawingsRowsPerPage : documentRowsPerPage,
          null, null, cancelTokenSource, filteredSearchKey || null, selectedSearchFilter || null, categoryVal, typeVal
        )
      );
    } else if (!machineDrawings && !customerPage && !machineDrawingPage) {
      dispatch(ChangePage(0));
      dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10)));
      dispatch(
        getDocuments(null, null, null, page, documentRowsPerPage,
          null, null, cancelTokenSource, filteredSearchKey || null, selectedSearchFilter || null, categoryVal, typeVal
        )
      );
    }
  };

  const onChangePage = (event, newPage) => {
    if (machineDrawingPage) {
      dispatch(machineDocumentChangePage(newPage))
    } else if (customerPage) {
      dispatch(customerDocumentChangePage(newPage))
    } else if (machineDrawings) {
      dispatch(machineDrawingsChangePage(newPage))
      dispatch(
        getDocuments(null, null, machineDrawings || null, page,
          machineDrawings ? machineDrawingsRowsPerPage : documentRowsPerPage,
          null, null, cancelTokenSource, filteredSearchKey || null, selectedSearchFilter || null, categoryVal, typeVal
        )
      );
    } else if (!machineDrawings && !customerPage && !machineDrawingPage) {
      dispatch(ChangePage(newPage))
      dispatch(
        getDocuments(null, null, null, page, documentRowsPerPage,
          null, null, cancelTokenSource, filteredSearchKey || null, selectedSearchFilter || null, categoryVal, typeVal
        )
      );
    }

  }

  const TABLE_HEAD = useMemo(() => {
    const baseHeaders = [
      { id: 'displayName', label: 'Name', align: 'left', allowSearch: true },
      { id: 'referenceNumber', visibility: 'xs2', label: 'Ref. No.', align: 'left', allowSearch: true },
      { id: 'docCategory.name', visibility: 'xs1', label: 'Category', align: 'left', allowSearch: false },
      { id: 'docType.name', visibility: 'xs2', label: 'Type', align: 'left', allowSearch: false },
      { id: 'updatedAt', visibility: 'xs2', label: 'Updated At', align: 'right' },
    ];

    if (machineDrawings) {
      return [
        ...baseHeaders.slice(0, 4),
        { id: 'stockNumber', visibility: 'xs2', label: 'Stock No.', align: 'left', allowSearch: true },
        { id: 'machine.serialNo', visibility: 'md4', label: 'Machines', align: 'left', allowSearch: true },
        ...baseHeaders.slice(4),
      ];
    }

    if (!customerPage && !machineDrawingPage && !machineDrawings && !machinePage) {
      return [
        ...baseHeaders.slice(0, 4),
        { id: 'machine.serialNo', visibility: 'md4', label: 'Machine', align: 'left', allowSearch: true },
        ...baseHeaders.slice(4),
      ];
    }
    return baseHeaders;
  }, [customerPage, machineDrawingPage, machineDrawings, machinePage]);

  // useLayoutEffect(() => {
  //     if(machineDrawingPage || machineDrawings || machinePage ){

  //       if(machineDrawings){
  //         dispatch(getActiveDocumentCategories(null, null, machineDrawings));
  //         dispatch(getActiveDocumentTypes(null, machineDrawings));
  //       }else{
  //         dispatch(getActiveDocumentCategories(null));  
  //         dispatch(getActiveDocumentTypes());
  //       }

  //       if(machineDrawings){
  //         const defaultType = activeDocumentTypes.find((typ) => typ?.isDefault === true);
  //         const defaultCategory = activeDocumentCategories.find((cat) => cat?.isDefault === true);

  //         if(typeVal===null && defaultType){
  //           setTypeVal(defaultType);
  //           setCategoryVal(defaultType?.docCategory)
  //         }else{
  //           setTypeVal(null);
  //           setCategoryVal(null);
  //         }
  //         if(!defaultType && categoryVal===null){
  //           setCategoryVal(defaultCategory);
  //         }
  //       }
  //     }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [ dispatch, machineDrawingPage, machineDrawings ]);

  useEffect(() => {
    if (customerPage && customerId) {
      dispatch(getDocuments(customer?._id, null, null, page, customerDocumentsRowsPerPage, customer?.isArchived, null, cancelTokenSource, filteredSearchKey, selectedSearchFilter));
    } else if (machineDrawingPage && machineId) {
      dispatch(getDocuments(null, machineId, null, page, machineDocumentsRowsPerPage, null, null, cancelTokenSource, filteredSearchKey, selectedSearchFilter));
    }
    else if (machinePage) {
      dispatch(getDocuments(null, machineId, null, page, machineDrawingsRowsPerPage, null, machine?.isArchived, cancelTokenSource));
    }
    // else if( machineDrawings || machineDrawingPage ){
    //   dispatch(getDocuments(null, null, ( machineDrawings || machineDrawingPage ), page, machineDrawingsRowsPerPage, null, null, cancelTokenSource, filteredSearchKey, selectedSearchFilter));
    // } 
    // else if(!customerPage && !machineDrawingPage && !machinePage && !machineDrawings  ) {
    //   dispatch(getDocuments(null, null, null, page, documentRowsPerPage, null, null, cancelTokenSource, filteredSearchKey, selectedSearchFilter));
    // }
    return () => { cancelTokenSource.cancel(); dispatch(resetDocuments()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    customerPage,
    machineDrawingPage,
    machineDrawings,
    page,
    customerDocumentsRowsPerPage,
    machineDocumentsRowsPerPage,
    machineDrawingsRowsPerPage,
    documentRowsPerPage,
    machine,
  ]);

  useLayoutEffect(() => {
    setTotalRows(documentRowsTotal || 0);
  }, [documentRowsTotal])

  useLayoutEffect(() => {
    if (machineDrawingPage || customerPage) {
      setPage(0)
    } else if (machineDrawings) {
      setPage(machineDrawingsPage)
    } else if (!customerPage && !machineDrawingPage && !machineDrawings) {
      setPage(documentPage)
    }
  }, [customerPage, machineDrawingPage, machineDrawings, machineDrawingsPage, documentPage])

  useLayoutEffect(() => {
    if (machineDrawingPage) {
      setRowsPerPage(machineDocumentsRowsPerPage)
    } else if (customerPage) {
      setRowsPerPage(customerDocumentsRowsPerPage)
    } else if (machineDrawings) {
      setRowsPerPage(machineDrawingsRowsPerPage)
    } else {
      setRowsPerPage(documentRowsPerPage)
    }
  }, [
    customerPage,
    machineDrawingPage,
    machineDrawings,
    machineDocumentsRowsPerPage,
    customerDocumentsRowsPerPage,
    machineDrawingsRowsPerPage,
    documentRowsPerPage
  ])

  const dataFiltered = applyFilter({
    inputData: documents?.data || [],
    comparator: getComparator(order, orderBy),
    orderBy,
    filterName,
    filterStatus,
    categoryVal,
    typeVal, machinePage, machineDrawingPage
  });

  const { watch, handleSubmit } = methods;
  const filteredSearchKey = watch('filteredSearchKey');

  const isFiltered = filterName !== '';
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const filterNameDebounce = (value) => {
    if (machineDrawingPage) {
      dispatch(setMachineDocumentFilterBy(value))
    } else if (customerPage) {
      dispatch(setCustomerDocumentFilterBy(value))
    } else if (machineDrawings) {
      dispatch(setMachineDrawingsFilterBy(value))
    } else if (!customerPage && !machineDrawingPage && !machineDrawings) {
      dispatch(setFilterBy(value))
    }
  }

  const debouncedSearch = useRef(debounce(async (criteria) => {
    filterNameDebounce(criteria);
  }, 500))

  const handleFilterName = useCallback((event) => {
    const { value } = event.target;
    debouncedSearch.current(value);
    setFilterName(value);
  }, []);

  useLayoutEffect(() => {
    debouncedSearch.current.cancel();
  }, [debouncedSearch]);

  useLayoutEffect(() => {
    if (machineDrawingPage) {
      setFilterName(machineDocumentsFilterBy)
    } else if (customerPage) {
      setFilterName(customerDocumentsFilterBy)
    } else if (machineDrawings) {
      setFilterName(machineDrawingsFilterBy)
    } else if (!customerPage && !machineDrawingPage && !machineDrawings) {
      setFilterName(documentFilterBy)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilterStatus = (event) => {
    // setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleViewRow = (Id) => {
    if (customerPage) {
      navigate(PATH_CRM.customers.documents.view.root(customer?._id, Id));
    } else if (machineDrawingPage) {
      navigate(PATH_MACHINE.machines.drawings.view.root(machineId, Id));
    } else if (machinePage) {
      navigate(PATH_MACHINE.machines.documents.view.root(machineId, Id));
    } else if (machineDrawings) {
      navigate(PATH_MACHINE_DRAWING.machineDrawings.view.root(Id));
    } else if (!customerPage && !machinePage && !machineDrawingPage && !machineDrawings) {
      navigate(PATH_MACHINE.documents.document.view.root(Id));
    }
  };

  const handleResetFilter = () => {
    setFilterName('');
    if (machineDrawingPage) {
      dispatch(setMachineDocumentFilterBy(""))
    } else if (customerPage) {
      dispatch(setCustomerDocumentFilterBy(""))
    } else if (machineDrawings) {
      dispatch(setMachineDrawingsFilterBy(""))
    } else if (!customerPage && !machineDrawingPage && !machineDrawings) {
      dispatch(setFilterBy(""))
    }
    setFilterStatus([]);
  };

  useEffect(() => {
    handleResetFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCustomerDialog = (e, Id) => {
    dispatch(getCustomer(Id))
    dispatch(setCustomerDialog(true))
  }

  const handleMachineDialog = async (Id) => {
    await dispatch(getMachineForDialog(Id))
    await dispatch(setMachineDialog(true))
  }

  const handleGalleryView = () => {
    if (customerPage) {
      navigate(PATH_CRM.customers.documents.viewGallery(customer?._id))
    } else if (machinePage) {
      navigate(PATH_MACHINE.machines.documents.gallery(machineId))
    }
  };

  const onGetDocuments = () => {
    const docCategoryId = categoryVal?._id || null;
    const docTypeId = typeVal?._id || null;
    if ((filteredSearchKey && selectedSearchFilter) || (docCategoryId || docTypeId)) {
      dispatch(
        getDocuments(null, null, machineDrawings || null, page,
          machineDrawings ? machineDrawingsRowsPerPage : documentRowsPerPage,
          null, null, cancelTokenSource, filteredSearchKey || null, selectedSearchFilter || null, docCategoryId, docTypeId
        )
      );
    }
  };

  const afterClearHandler = () => {
    dispatch(
      resetDocuments()
    );
  };

  useEffect(() => {
    dispatch(getActiveDocumentCategories(null, null, machineDrawings || false));
    dispatch(getActiveDocumentTypes(null, machineDrawings || false));
  }, [dispatch, machineDrawings]);

  const handleCategoryChange = (event, newValue) => {
    if (newValue) {
      setCategoryVal(newValue);
      dispatch(getActiveDocumentTypesWithCategory(newValue._id));

      if (typeVal?.docCategory?._id !== newValue._id) {
        setTypeVal(null);
      }
    } else {
      setCategoryVal(null);
      setTypeVal(null);
      dispatch(getActiveDocumentTypesWithCategory(null));
      afterClearHandler();
    }
  };

  const handleTypeChange = (event, newValue) => {
    if (newValue) {
      setTypeVal(newValue);

      if (!categoryVal) {
        setCategoryVal(newValue.docCategory);
        dispatch(getActiveDocumentTypesWithCategory(newValue.docCategory._id));
      }
    } else {
      setTypeVal(null);
    }
  };

  const handleHiddenColumns = async (arg) => {
    dispatch(setReportHiddenColumns(arg));
  };

  return (
    <>
      {/* <Container sx={{mb:3}}> */}
      {!customerPage && !machineDrawingPage && !machinePage && (
        <StyledCardContainer>
          <Cover
            name={machineDrawings ? FORMLABELS.COVER.MACHINE_DRAWINGS : FORMLABELS.COVER.DOCUMENTS}
          />
        </StyledCardContainer>
      )}
      <FormProvider {...methods} onSubmit={handleSubmit(onGetDocuments)}>
        {!customerPage && !machinePage && !machineDrawingPage && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Box rowGap={2} columnGap={2} mb={3} display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)' }} sx={{ flexGrow: 1, width: { xs: '100%', sm: '100%' } }}>
                  <Autocomplete
                    id="category-autocomplete"
                    value={categoryVal || null}
                    options={activeDocumentCategories || []}
                    getOptionLabel={(option) => option.name || ''}
                    onChange={handleCategoryChange}
                    renderInput={(params) => <TextField {...params} size="small" label="Category" />}
                  />
                  <Autocomplete
                    id="type-autocomplete"
                    value={categoryVal ? typeVal : null}
                    options={categoryVal ? activeDocumentTypes : []}
                    getOptionLabel={(option) => option.name || ''}
                    onChange={handleTypeChange}
                    renderInput={(params) => <TextField {...params} size="small" label="Type" />}
                  />
                </Box>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
                    <RHFFilteredSearchBar
                      name="filteredSearchKey"
                      filterOptions={TABLE_HEAD.filter((item) => item?.allowSearch)}
                      setSelectedFilter={setSelectedSearchFilter}
                      selectedFilter={selectedSearchFilter}
                      placeholder="Enter Search here..."
                      afterClearHandler={afterClearHandler}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSubmit(onGetDocuments)();
                        }
                      }}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ justifyContent: 'flex-end', display: 'flex' }}>
                    <LoadingButton
                      type="button"
                      onClick={handleSubmit(onGetDocuments)}
                      variant="contained"
                      size="large"
                    >
                      Search
                    </LoadingButton>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        )}</FormProvider>
      <TableCard>
        <DocumentListTableToolbar
          filterName={filterName}
          filterStatus={filterStatus}
          onFilterName={handleFilterName}
          onFilterStatus={handleFilterStatus}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
          machineDrawings={machineDrawings}
          customerPage={customerPage}
          machinePage={machinePage}
          machineDrawingPage={machineDrawingPage}
          categoryVal={categoryVal}
          setCategoryVal={(machinePage || machineDrawingPage) ? setCategoryVal : undefined}
          typeVal={typeVal}
          setTypeVal={(machinePage || machineDrawingPage) ? setTypeVal : undefined}
          handleGalleryView={
            !isNotFound && (customerPage || machinePage) ? handleGalleryView : undefined
          }
        />
        <Box sx={{ mt: 2 }}>
          {!isNotFound && <TablePaginationFilter
            columns={TABLE_HEAD}
            hiddenColumns={reportHiddenColumns}
            handleHiddenColumns={handleHiddenColumns}
            count={documentRowsTotal}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table stickyHeader size="small" sx={{ minWidth: 360 }}>
                {(!isNotFound || machinePage || customerPage) && (
                  <TableHeadFilter
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    onSort={onSort}
                    hiddenColumns={reportHiddenColumns}
                  />)}

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <DocumentListTableRow
                          key={row._id}
                          row={row}
                          onViewRow={() => handleViewRow(row._id)}
                          style={index % 2 ? { background: 'red' } : { background: 'green' }}
                          customerPage={customerPage}
                          machinePage={machinePage}
                          machineDrawingPage={machineDrawingPage}
                          machineDrawings={machineDrawings}
                          handleCustomerDialog={(e) =>
                            row?.customer && handleCustomerDialog(e, row?.customer?._id)
                          }
                          handleMachineDialog={(docMachineId) => handleMachineDialog(docMachineId)}
                          hiddenColumns={reportHiddenColumns}
                        />
                      ) : (
                        !isNotFound && <TableSkeleton key={index} sx={{ height: 60 }} />
                      )
                    )}
                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          {(!isNotFound || machinePage || customerPage) && (
            <TablePaginationFilter
              count={totalRows}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          )}
        </Box>
      </TableCard>
      {/* </Container> */}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, orderBy, filterName, filterStatus, categoryVal, typeVal, machineDrawingPage, machinePage }) {

  if (inputData) {
    const stabilizedThis = inputData && inputData.map((el, index) => [el, index]);
    if (orderBy !== 'doNotOrder') {
      stabilizedThis?.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
      });
    }

    inputData = stabilizedThis?.map((el) => el[0]);

    if (machineDrawingPage || machinePage) {
      if (categoryVal)
        inputData = inputData?.filter((drawing) => drawing.docCategory?._id === categoryVal?._id);

      if (typeVal)
        inputData = inputData?.filter((drawing) => drawing.docType?._id === typeVal?._id);
    }

    if (filterName) {
      inputData = inputData.filter(
        (document) =>
          document?.displayName?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
          document?.docType?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
          document?.customer?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
          document?.machine?.serialNo?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
          document?.docCategory?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
          document?.referenceNumber?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
          document?.stockNumber?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
          document?.productDrawings?.some((m) => m?.machine?.serialNo?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0) ||
          document?.documentVersions[0]?.versionNo?.toString().indexOf(filterName.toLowerCase()) >= 0 ||
          fDate(document?.updatedAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
      );
    }

    if (filterStatus.length) {
      inputData = inputData.filter((document) => filterStatus.includes(document.status));
    }
  }

  return inputData;
}

export default memo(DocumentList)
