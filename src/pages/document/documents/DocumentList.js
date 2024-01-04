import React, {  useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
// @mui
import {
  Button,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_DOCUMENT } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
// import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
// sections
import DocumentListTableRow from './DocumentListTableRow';
import DocumentListTableToolbar from './DocumentListTableToolbar';
import {
  getDocument,
  resetDocument,
  getDocuments,
  resetDocuments,
  resetDocumentHistory,
  setDocumentViewFormVisibility,
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
  deleteDocument,
  setDocumentGalleryVisibility,
} from '../../../redux/slices/document/document';
import { getMachineForDialog, resetMachine, setMachineDialog } from '../../../redux/slices/products/machine';
import { getActiveDocumentCategories } from '../../../redux/slices/document/documentCategory';
import { getActiveDocumentTypes } from '../../../redux/slices/document/documentType';
import { getCustomer, resetCustomer, setCustomerDialog } from '../../../redux/slices/customer/customer';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { FORMLABELS } from '../../../constants/default-constants';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../components/ListTableTools/TableCard';
import MachineDialog from '../../components/Dialog/MachineDialog';
import { Snacks } from '../../../constants/document-constants';
import ConfirmDialog from '../../../components/confirm-dialog';
import CustomerDialog from '../../components/Dialog/CustomerDialog';

// ----------------------------------------------------------------------
DocumentList.propTypes = {
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
  machineDrawings: PropTypes.bool,
};
function DocumentList({ customerPage, machinePage, machineDrawings }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [tableData, setTableData] = useState([]);
  const [categoryVal, setCategoryVal] = useState(null);
  const [typeVal, setTypeVal] = useState(null);
  const [filterStatus, setFilterStatus] = useState([]);
  const { customer } = useSelector((state) => state.customer);
  const { machine } = useSelector((state) => state.machine);
  const { documents,
      documentFilterBy,  documentPage,  documentRowsPerPage,
      machineDrawingsFilterBy,  machineDrawingsPage,  machineDrawingsRowsPerPage,
      customerDocumentsFilterBy,   customerDocumentsPage,   customerDocumentsRowsPerPage,
      machineDocumentsFilterBy,  machineDocumentsPage,  machineDocumentsRowsPerPage,
      isLoading } = useSelector((state) => state.document );
  const {
    order,
    orderBy,
    selected,
    setSelected,
    onSort,
  } = useTable({
    defaultOrderBy: 'createdAt', defaultOrder: 'desc',
  });

const onChangeRowsPerPage = (event) => {
  if(machinePage){
    dispatch(machineDocumentChangePage(0))
    dispatch(machineDocumentChangeRowsPerPage(parseInt(event.target.value, 10)))
  }else if(customerPage){
    dispatch(customerDocumentChangePage(0))
    dispatch(customerDocumentChangeRowsPerPage(parseInt(event.target.value, 10)))
  }else if(machineDrawings){
    dispatch(machineDrawingsChangePage(0))
    dispatch(machineDrawingsChangeRowsPerPage(parseInt(event.target.value, 10)))
  }else if(!machineDrawings && !customerPage && !machinePage){
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10)));
  }
};

const  onChangePage = (event, newPage) => {
  if(machinePage){
    dispatch(machineDocumentChangePage(newPage))
  }else if(customerPage){
    dispatch(customerDocumentChangePage(newPage))
  }else if(machineDrawings){
    dispatch(machineDrawingsChangePage(newPage))
  }else if(!machineDrawings && !customerPage && !machinePage){
    dispatch(ChangePage(newPage))
  }
}

  const TABLE_HEAD = [
    { id: 'docCategory.name', visibility: 'xs1', label: 'Category', align: 'left' },
    { id: 'docType.name', visibility: 'xs2', label: 'Type', align: 'left' },
    { id: 'referenceNumber', visibility: 'xs2', label: 'Ref. No.', align: 'left' },
    { id: 'displayName', label: 'Name', align: 'left' },
    { id: 'documentVersions.versionNo.[]', visibility: 'md1', label: 'Version', align: 'center' },
    // { id: 'customerAccess', visibility: 'md2', label: 'Customer Access', align: 'center' },
    // { id: 'isActive', label: 'Active', align: 'center' },
    { id: 'createdAt', label: 'Created At', align: 'right' },
  ];
  
  if (machineDrawings) {
    const insertIndex = 5; // Index after which you want to insert the new objects
    TABLE_HEAD.splice(insertIndex, 0,// 0 indicates that we're not removing any elements
    { id: 'stockNumber', visibility: 'xs2', label: 'Stock No.', align: 'left' },
    { id: 'productDrawings.serialNumbers', visibility: 'xs2', label: 'Machines', align: 'left' },
    );
  }

  if (!customerPage && !machinePage && !machineDrawings) {
    const insertIndex = 5; // Index after which you want to insert the new objects
    TABLE_HEAD.splice(insertIndex, 0,// 0 indicates that we're not removing any elements
      { id: 'customer.name', visibility: 'md3', label: 'Customer', align: 'left' },
      { id: 'machine.serialNo', visibility: 'md4', label: 'Machine', align: 'left' }
    );
  }

  
  useEffect(() => {
    const fetchData = async () => {
      dispatch(resetDocuments());
      if(machinePage || machineDrawings ){
        dispatch(getActiveDocumentCategories());
        dispatch(getActiveDocumentTypes());
      }
      if (customerPage || machinePage) {
        if (customer?._id || machine?._id) {
          await dispatch(getDocuments(customerPage ? customer?._id : null, machinePage ? machine?._id : null));
        }
      }else if(machineDrawings){
        await dispatch(getDocuments(null, null,machineDrawings));
      } else {
        await dispatch(getDocuments());
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, customerPage, machinePage]);

  useEffect(()=>{
    if(machinePage){
      setPage(machineDocumentsPage)
    }else if(customerPage){
      setPage(customerDocumentsPage)
    }else if(machineDrawings){
      setPage(machineDrawingsPage)
    }else if(!customerPage && !machinePage && !machineDrawings){
      setPage(documentPage)
    }
  },[customerPage, machinePage, machineDrawings, machineDocumentsPage, customerDocumentsPage, machineDrawingsPage, documentPage])

  useEffect(()=>{
    if(machinePage){
      setRowsPerPage(machineDocumentsRowsPerPage)
    }else if(customerPage){
      setRowsPerPage(customerDocumentsRowsPerPage)
    }else if(machineDrawings){
      setRowsPerPage(machineDrawingsRowsPerPage)
    }else{
      setRowsPerPage(documentRowsPerPage)
    }
  },[customerPage, machinePage, machineDrawings, machineDocumentsRowsPerPage, customerDocumentsRowsPerPage, machineDrawingsRowsPerPage, documentRowsPerPage])

  useEffect(() => {
    setTableData(documents);
  }, [documents]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
    categoryVal, 
    typeVal,
  });
  // const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const denseHeight = 60;
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const filterNameDebounce = (value) => {
    if(machinePage){
      dispatch(machineDocumentChangePage(0))
      dispatch(setMachineDocumentFilterBy(value))
    }else if(customerPage){
      dispatch(customerDocumentChangePage(0))
      dispatch(setCustomerDocumentFilterBy(value))
    }else if(machineDrawings){
      dispatch(machineDrawingsChangePage(0))
      dispatch(setMachineDrawingsFilterBy(value))
    }else if(!customerPage && !machinePage && !machineDrawings){
      dispatch(ChangePage(0));
      dispatch(setFilterBy(value))
    }
  }
  const debouncedSearch = useRef(debounce(async (criteria) => {
      filterNameDebounce(criteria);
    }, 500))

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value);
    setFilterName(event.target.value)
  };

  useEffect(() => {
      debouncedSearch.current.cancel();
  }, [debouncedSearch]);

  useEffect(()=>{
    if(machinePage){
      setFilterName(machineDocumentsFilterBy)
    }else if(customerPage){
      setFilterName(customerDocumentsFilterBy)
    }else if(machineDrawings){
      setFilterName(machineDrawingsFilterBy)
    }else if(!customerPage && !machinePage && !machineDrawings){
      setFilterName(documentFilterBy)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ ])
  // customerPage, machinePage, machineDrawings, documentFilterBy, machineDocumentsFilterBy, customerDocumentsFilterBy, machineDrawingsFilterBy

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleViewRow = (id) => {
      dispatch(resetDocument())
    if (customerPage || machinePage) {
      dispatch(getDocument(id));
      dispatch(setDocumentViewFormVisibility(true));
    } else if(machineDrawings){
      dispatch(resetDocumentHistory())
      navigate(PATH_DOCUMENT.document.machineDrawings.view(id));
    } else{
      dispatch(resetDocumentHistory())
      navigate(PATH_DOCUMENT.document.view(id));
    }
  };

  const handleResetFilter = () => {
    setFilterName('');
    if(machinePage){
      dispatch(setMachineDocumentFilterBy(""))
    }else if(customerPage){
      dispatch(setCustomerDocumentFilterBy(""))
    }else if(machineDrawings){
      dispatch(setMachineDrawingsFilterBy(""))
    }else if(!customerPage && !machinePage && !machineDrawings){
      dispatch(setFilterBy(""))
    }
    setFilterStatus([]);
  };

  const handleCustomerDialog = (e, id) => {
    dispatch(getCustomer(id))
    dispatch(setCustomerDialog(true))
  }
  
  const handleMachineDialog = (e, id) => {
    dispatch(getMachineForDialog(id))
    dispatch(setMachineDialog(true))
  }


  const { enqueueSnackbar } = useSnackbar();
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  const handleDeleteDoc = async (id) => {
    try {
      await dispatch(deleteDocument(id, (!customerPage && !machinePage )));
      dispatch(resetDocuments());

      dispatch(resetDocuments());
      if (customerPage || machinePage) {
        if (customer?._id || machine?._id) {
          await dispatch(getDocuments(customerPage ? customer?._id : null, machinePage ? machine?._id : null));
        }
      }else if(machineDrawings){
        await dispatch(getDocuments(null, null,machineDrawings));
      } else {
        await dispatch(getDocuments());
      }

      enqueueSnackbar(machineDrawings?Snacks.deletedDrawing:Snacks.deletedDoc, { variant: `success` });
    } catch (err) {
      console.log(err);
      enqueueSnackbar(err, { variant: `error` });
    }
  };

  const handleGalleryView = () => {
    dispatch(setDocumentGalleryVisibility(true));
  };

  return (
    <>
    {/* <Container sx={{mb:3}}> */}
      {!customerPage && !machinePage &&
      <StyledCardContainer>
        <Cover name={machineDrawings ? FORMLABELS.COVER.MACHINE_DRAWINGS :  FORMLABELS.COVER.DOCUMENTS} />
      </StyledCardContainer>}
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
          handleGalleryView={handleGalleryView}
        />
        {!isNotFound && <TablePaginationCustom
          count={dataFiltered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />}
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
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    row ? (
                      <DocumentListTableRow
                        key={row._id}
                        row={row}
                        onViewRow={() => handleViewRow(row._id)}
                        style={index % 2 ? { background: 'red' } : { background: 'green' }}
                        customerPage={customerPage}
                        machinePage={machinePage}
                        machineDrawings={machineDrawings}
                        handleCustomerDialog={(e)=> row?.customer && handleCustomerDialog(e,row?.customer?._id)}
                        handleMachineDialog={(e)=> row?.machine && handleMachineDialog(e,row?.machine?._id)}
                      />
                    ) : (
                      !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    )
                  )}
                  <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        {!isNotFound && <TablePaginationCustom
          count={dataFiltered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />}
      </TableCard>
      {/* </Container> */}
      
      <CustomerDialog />
      <MachineDialog />

      <ConfirmDialog open={openConfirm} onClose={handleCloseConfirm} title="Delete" content="Are you sure you want to delete?"
        action={
          <Button variant="contained" color="error"
            onClick={() => {
              handleDeleteDoc(selected)
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus, categoryVal, typeVal }) {
  const stabilizedThis = inputData && inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);


  inputData = stabilizedThis.map((el) => el[0]);
  if(categoryVal)
    inputData = inputData.filter((drawing)=> drawing.docCategory?._id  === categoryVal?._id );

  if(typeVal)
    inputData = inputData.filter((drawing)=> drawing.docType?._id === typeVal?._id );


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
        document?.documentVersions[0].versionNo?.toString().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(document?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((document) => filterStatus.includes(document.status));
  }

  return inputData;
}

export default DocumentList
