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
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_CRM, PATH_DOCUMENT, PATH_MACHINE, PATH_MACHINE_DRAWING } from '../../routes/paths';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
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
} from '../../redux/slices/document/document';
import { getMachineForDialog,  setMachineDialog } from '../../redux/slices/products/machine';
import { getActiveDocumentCategories } from '../../redux/slices/document/documentCategory';
import { getActiveDocumentTypes } from '../../redux/slices/document/documentType';
import { getCustomer, setCustomerDialog } from '../../redux/slices/customer/customer';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import { FORMLABELS } from '../../constants/default-constants';
import { fDate } from '../../utils/formatTime';
import TableCard from '../../components/ListTableTools/TableCard';
import MachineDialog from '../../components/Dialog/MachineDialog';
import CustomerDialog from '../../components/Dialog/CustomerDialog';
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
    isLoading } = useSelector((state) => state.document );
    console.log("isLoading : ",isLoading)
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory );
  const { activeDocumentTypes } = useSelector((state) => state.documentType );
  const [totalRows, setTotalRows] = useState( documentRowsTotal );
  const [selectedSearchFilter, setSelectedSearchFilter] = useState('');

  const {
    order,
    orderBy,
    onSort,
  } = useTable({
    defaultOrderBy: machineDrawings ? 'doNotOrder' : 'createdAt', defaultOrder: 'desc',
  });

const onChangeRowsPerPage = (event) => {
  if(machineDrawingPage){
    dispatch(machineDocumentChangePage(0))
    dispatch(machineDocumentChangeRowsPerPage(parseInt(event.target.value, 10)))
  }else if(customerPage){
    dispatch(customerDocumentChangePage(0))
    dispatch(customerDocumentChangeRowsPerPage(parseInt(event.target.value, 10)))
  }else if(machineDrawings){
    dispatch(machineDrawingsChangePage(0))
    dispatch(machineDrawingsChangeRowsPerPage(parseInt(event.target.value, 10)))
  }else if(!machineDrawings && !customerPage && !machineDrawingPage){
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10)));
  }
};

const onChangePage = (event, newPage) => {
  if(machineDrawingPage){
    dispatch(machineDocumentChangePage(newPage))
  }else if(customerPage){
    dispatch(customerDocumentChangePage(newPage))
  }else if(machineDrawings){
    dispatch(machineDrawingsChangePage(newPage))
  }else if(!machineDrawings && !customerPage && !machineDrawingPage){
    dispatch(ChangePage(newPage))
  }
}

const TABLE_HEAD = useMemo(() => {
  const baseHeaders = [
    { id: 'displayName', label: 'Name', align: 'left' },
    { id: 'referenceNumber', visibility: 'xs2', label: 'Ref. No.', align: 'left' },
    { id: 'docCategory.name', visibility: 'xs1', label: 'Category', align: 'left' },
    { id: 'docType.name', visibility: 'xs2', label: 'Type', align: 'left' },
    { id: 'createdAt', label: 'Created At', align: 'right' },
  ];

  if (machineDrawings) {
    return [
      ...baseHeaders.slice(0, 4),
      { id: 'stockNumber', visibility: 'xs2', label: 'Stock No.', align: 'left' },
      { id: 'productDrawings', visibility: 'xs2', label: 'Machines', align: 'left' },
      ...baseHeaders.slice(4),
    ];
  }

  if (!customerPage && !machineDrawingPage && !machineDrawings) {
    return [
      ...baseHeaders.slice(0, 4),
      { id: 'machine.serialNo', visibility: 'md4', label: 'Machine', align: 'left' },
      ...baseHeaders.slice(4),
    ];
  }
  return baseHeaders;
}, [customerPage, machineDrawingPage, machineDrawings]);

useLayoutEffect(() => {
    if(machineDrawingPage || machineDrawings || machinePage ){

      if(machineDrawings){
        dispatch(getActiveDocumentCategories(null, null, machineDrawings));
        dispatch(getActiveDocumentTypes(null, machineDrawings));
      }else{
        dispatch(getActiveDocumentCategories(null));  
        dispatch(getActiveDocumentTypes());
      }

      if(machineDrawings){
        const defaultType = activeDocumentTypes.find((typ) => typ?.isDefault === true);
        const defaultCategory = activeDocumentCategories.find((cat) => cat?.isDefault === true);

        if(typeVal===null && defaultType){
          setTypeVal(defaultType);
          setCategoryVal(defaultType?.docCategory)
        }else{
          setTypeVal(null);
          setCategoryVal(null);
        }
        if(!defaultType && categoryVal===null){
          setCategoryVal(defaultCategory);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [ dispatch, machineDrawingPage, machineDrawings ]);

  useEffect(() => {
      if (customerPage && customerId) {
        dispatch(getDocuments( customer?._id , null, null, page, customerDocumentsRowsPerPage, customer?.isArchived, null, cancelTokenSource, filteredSearchKey, selectedSearchFilter));
      } else if(machineDrawingPage &&  machineId ){
        dispatch(getDocuments( null, machineId, null, page, machineDocumentsRowsPerPage, null, null, cancelTokenSource, filteredSearchKey, selectedSearchFilter));
      } else if( machinePage ){
        dispatch(getDocuments(null, machineId, null, page, machineDrawingsRowsPerPage, null, machine?.isArchived, cancelTokenSource, filteredSearchKey, selectedSearchFilter));
      } else if( machineDrawings || machineDrawingPage ){
        dispatch(getDocuments(null, null, ( machineDrawings || machineDrawingPage ), page, machineDrawingsRowsPerPage, null, null, cancelTokenSource, filteredSearchKey, selectedSearchFilter));
      } else if(!customerPage && !machineDrawingPage && !machinePage && !machineDrawings  ) {
        dispatch(getDocuments(null, null, null, page, documentRowsPerPage, null, null, cancelTokenSource, filteredSearchKey, selectedSearchFilter));
      }
      return()=>{ cancelTokenSource.cancel(); dispatch(resetDocuments()) }
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
  
  useLayoutEffect(()=>{
    setTotalRows( documentRowsTotal || 0 );
  },[ documentRowsTotal ])

  useLayoutEffect(()=>{
    if(machineDrawingPage || customerPage){
      setPage(0)
    }else if(machineDrawings){
      setPage(machineDrawingsPage)
    }else if(!customerPage && !machineDrawingPage && !machineDrawings){
      setPage(documentPage)
    }
  },[ customerPage, machineDrawingPage, machineDrawings, machineDrawingsPage, documentPage ] )

  useLayoutEffect(()=>{
    if(machineDrawingPage){
      setRowsPerPage(machineDocumentsRowsPerPage)
    }else if(customerPage){
      setRowsPerPage(customerDocumentsRowsPerPage)
    }else if(machineDrawings){
      setRowsPerPage(machineDrawingsRowsPerPage)
    }else{
      setRowsPerPage(documentRowsPerPage)
    }
  },[ 
    customerPage, 
    machineDrawingPage, 
    machineDrawings, 
    machineDocumentsRowsPerPage, 
    customerDocumentsRowsPerPage, 
    machineDrawingsRowsPerPage, 
    documentRowsPerPage 
  ] )


  const dataFiltered = applyFilter({
    inputData: documents?.data || [],
    comparator: getComparator(order, orderBy),
    orderBy,
    filterName,
    filterStatus,
    categoryVal, 
    typeVal,
  });
  
  const { watch, handleSubmit } = methods;
  const filteredSearchKey = watch('filteredSearchKey');

  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!isLoading && !dataFiltered?.length);

  const filterNameDebounce = (value) => {
    if(machineDrawingPage){
      dispatch(setMachineDocumentFilterBy(value))
    }else if(customerPage){
      dispatch(setCustomerDocumentFilterBy(value))
    }else if(machineDrawings){
      dispatch(setMachineDrawingsFilterBy(value))
    }else if(!customerPage && !machineDrawingPage && !machineDrawings){
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

  useLayoutEffect(()=>{
    if(machineDrawingPage){
      setFilterName(machineDocumentsFilterBy)
    }else if(customerPage){
      setFilterName(customerDocumentsFilterBy)
    }else if(machineDrawings){
      setFilterName(machineDrawingsFilterBy)
    }else if(!customerPage && !machineDrawingPage && !machineDrawings){
      setFilterName(documentFilterBy)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ ])

  const handleFilterStatus = (event) => {
    // setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleViewRow = (Id) => {
    if ( customerPage ) {
        navigate(PATH_CRM.customers.documents.view.root( customer?._id, Id));
    } else if( machineDrawingPage ){
        navigate(PATH_MACHINE.machines.drawings.view.root( machineId, Id));
    } else if( machinePage ){
        navigate(PATH_MACHINE.machines.documents.view.root(machineId, Id));
    } else if( machineDrawings ){
        navigate(PATH_MACHINE_DRAWING.machineDrawings.view.root(Id));
    } else if( !customerPage && !machinePage && !machineDrawingPage && !machineDrawings ){
        navigate(PATH_DOCUMENT.document.view.root(Id));
    }
  };
  
  const handleResetFilter = () => {
    setFilterName('');
    if(machineDrawingPage){
      dispatch(setMachineDocumentFilterBy(""))
    }else if(customerPage){
      dispatch(setCustomerDocumentFilterBy(""))
    }else if(machineDrawings){
      dispatch(setMachineDrawingsFilterBy(""))
    }else if(!customerPage && !machineDrawingPage && !machineDrawings){
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
  
  const handleMachineDialog = (e, Id) => {
    dispatch(getMachineForDialog(Id))
    dispatch(setMachineDialog(true))
  }

  const handleGalleryView = () => {
    if( customerPage ){
      navigate(PATH_CRM.customers.documents.viewGallery(customer?._id))
    } else if(machinePage){
      navigate(PATH_MACHINE.machines.documents.gallery(machineId))
    }
  };
  
  const onGetDocuments = (data) => {
    if (filteredSearchKey && selectedSearchFilter && !customerPage && !machineDrawingPage && !machinePage && !machineDrawings) {
      dispatch(getDocuments(null, null, null, page, documentRowsPerPage, null, null, cancelTokenSource, filteredSearchKey, selectedSearchFilter));
    } else if(filteredSearchKey && selectedSearchFilter && machineDrawingPage &&  machineId ){
      dispatch(getDocuments( null, machineId, null, page, machineDocumentsRowsPerPage, null, null, cancelTokenSource, filteredSearchKey, selectedSearchFilter));
    }  else if( filteredSearchKey && selectedSearchFilter && machineDrawings || machineDrawingPage ){
      dispatch(getDocuments(null, null, ( machineDrawings || machineDrawingPage ), page, machineDrawingsRowsPerPage, null, null, cancelTokenSource, filteredSearchKey, selectedSearchFilter));
    }  
  };
  
  const afterClearHandler = (data) => {
    if (filteredSearchKey && selectedSearchFilter && !customerPage && !machineDrawingPage && !machinePage && !machineDrawings) {
      dispatch(getDocuments(null, null, null, page, documentRowsPerPage, null, null, cancelTokenSource, null, null));
    } else if(filteredSearchKey && selectedSearchFilter && machineDrawingPage &&  machineId ){
      dispatch(getDocuments( null, machineId, null, page, machineDocumentsRowsPerPage, null, null, cancelTokenSource, null, null));
    }  else if( filteredSearchKey && selectedSearchFilter && machineDrawings || machineDrawingPage ){
      dispatch(getDocuments(null, null, ( machineDrawings || machineDrawingPage ), page, machineDrawingsRowsPerPage, null, null, cancelTokenSource, null, null));
    }  
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
      {!customerPage && !machinePage && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
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
                    filterOptions={TABLE_HEAD}
                    setSelectedFilter={setSelectedSearchFilter}
                    selectedFilter={selectedSearchFilter}
                    placeholder="Enter Search here..."
                    afterClearHandler={afterClearHandler}
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
        )}
        <TableCard>
          <DocumentListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
            customerPage={customerPage}
            machinePage={machinePage}
            machineDrawings={machineDrawings}
            categoryVal={categoryVal}
            setCategoryVal={setCategoryVal}
            typeVal={typeVal}
            setTypeVal={setTypeVal}
            handleGalleryView={
              !isNotFound && (customerPage || machinePage) ? handleGalleryView : undefined
            }
          />
          <TablePaginationCustom
            count={documentRowsTotal}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size="small" sx={{ minWidth: 360 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                />

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
                          machinePage={machineDrawingPage}
                          machineDrawings={machineDrawings}
                          handleCustomerDialog={(e) =>
                            row?.customer && handleCustomerDialog(e, row?.customer?._id)
                          }
                          handleMachineDialog={(e) =>
                            row?.machine && handleMachineDialog(e, row?.machine?._id)
                          }
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

          {!isNotFound && (
            <TablePaginationCustom
              count={totalRows}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          )}
        </TableCard>
        {/* </Container> */}
      </FormProvider>
      <CustomerDialog />
      <MachineDialog />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, orderBy, filterName, filterStatus, categoryVal, typeVal }) {

  if(inputData){
    const stabilizedThis = inputData && inputData.map((el, index) => [el, index]);
    if( orderBy !== 'doNotOrder' ){
      stabilizedThis?.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
      });
    }
  
    inputData = stabilizedThis?.map((el) => el[0]);
  
  
    inputData = stabilizedThis?.map((el) => el[0]);
    if(categoryVal)
      inputData = inputData?.filter((drawing)=> drawing.docCategory?._id  === categoryVal?._id );
  
    if(typeVal)
      inputData = inputData?.filter((drawing)=> drawing.docType?._id === typeVal?._id );
  
  
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
          fDate(document?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
      );
    }
  
    if (filterStatus.length) {
      inputData = inputData.filter((document) => filterStatus.includes(document.status));
    }
  }

  return inputData;
}

export default memo( DocumentList )
