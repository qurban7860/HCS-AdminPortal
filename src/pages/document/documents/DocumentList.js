import React, {  useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
// @mui
import {
  Grid,
  Table,
  Button,
  Tooltip,
  TableBody,
  IconButton,
  TableContainer,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_DOCUMENT } from '../../../routes/paths';
// components
// import { useSnackbar } from '../../../components/snackbar';
// import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog';
// sections
import DocumentListTableRow from './DocumentListTableRow';
import DocumentListTableToolbar from './DocumentListTableToolbar';
import {
  getDocument,
  resetDocument,
  getDocuments,
  // deleteDocument,
  resetDocuments,
  resetDocumentHistory,
  setDocumentViewFormVisibility,
  // document pagination
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
} from '../../../redux/slices/document/document';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { FORMLABELS } from '../../../constants/default-constants';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../components/ListTableTools/TableCard';

// ----------------------------------------------------------------------



// ----------------------------------------------------------------------
DocumentList.propTypes = {
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
  machineDrawings: PropTypes.bool,
};
function DocumentList({ customerPage, machinePage, machineDrawings }) {
  const dispatch = useDispatch();
  // const { themeStretch } = useSettingsContext();
  // const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  // const [documentBy, setDocumentBy] = useState({});
  const { customer } = useSelector((state) => state.customer);
  const { machine } = useSelector((state) => state.machine);
  const { documents,
      documentFilterBy,  documentPage,  documentRowsPerPage,
      machineDrawingsFilterBy,  machineDrawingsPage,  machineDrawingsRowsPerPage,
      customerDocumentsFilterBy,   customerDocumentsPage,   customerDocumentsRowsPerPage,
      machineDocumentsFilterBy,  machineDocumentsPage,  machineDocumentsRowsPerPage,
      isLoading } = useSelector((state) => state.document );

  const {
    // page,
    order,
    orderBy,
    // rowsPerPage,
    // setPage,
    //
    selected,
    // setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    // onChangePage,
    // onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: '-createdAt',
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
    { id: 'name', label: 'Name', align: 'left' },
    { id: 'xs1', label: 'Category', align: 'left' },
    { id: 'xs2', label: 'Type', align: 'left' },
    { id: 'md1', label: 'Version', align: 'center' },
    { id: 'md2', label: 'Customer Access', align: 'center' },
    { id: 'active', label: 'Active', align: 'center' },
    { id: 'created_at', label: 'Created At', align: 'right' },
  ];
  
  if (!customerPage && !machinePage && !machineDrawings) {
    const insertIndex = 1; // Index after which you want to insert the new objects
    TABLE_HEAD.splice(insertIndex, 0, // 0 indicates that we're not removing any elements
      { id: 'md3', label: 'Customer', align: 'left' },
      { id: 'md4', label: 'Machine', align: 'left' }
    );
  }

  useEffect(() => {
    const fetchData = async () => {
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

  // useEffect(()=>{
  //   if(customerPage){
  //     setDocumentBy({customer: true});
  //   }else if(machinePage){
  //     setDocumentBy({machine: true});
  //   }
  //   else if(machineDrawings){
  //     setDocumentBy({drawing: true});
  //   }
  // },[customerPage, machinePage, machineDrawings ])
  
    // useEffect(() => {
    //   if(documentBy && (customerPage || machinePage || machineDrawings ) ){
    //     if(customer?._id || machine?._id){
    //     }
    //     await dispatch(getDocuments(documentBy));
    //   }
    // },[dispatch, documentBy])

  useEffect(() => {
    setTableData(documents);
  }, [documents]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });
  // const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const denseHeight = 60;
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

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

  // const handleDeleteRow = async (id) => {
  //   try {
  //     await dispatch(deleteDocument(id));
  //     dispatch(deleteDocument());
  //     setSelected([]);

  //     if (page > 0) {
  //       if (dataInPage.length < 2) {
  //         setPage(page - 1);
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // };

  // const handleDeleteRows = (selectedRows) => {
  //   const deleteRows = tableData.filter((row) => !selectedRows.includes(row._id));
  //   setSelected([]);
  //   setTableData(deleteRows);

  //   if (page > 0) {
  //     if (selectedRows.length === dataInPage.length) {
  //       setPage(page - 1);
  //     } else if (selectedRows.length === dataFiltered.length) {
  //       setPage(0);
  //     } else if (selectedRows.length > dataInPage.length) {
  //       const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
  //       setPage(newPage);
  //     }
  //   }
  // };

  // const handleEditRow = (id) => {
  //   // console.log(id);
  //   navigate(PATH_DOCUMENT.document.edit(id));
  // };

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
        />
        {!isNotFound && <TablePaginationCustom
          count={dataFiltered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />}
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            numSelected={selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              onSelectAllRows(
                checked,
                tableData.map((row) => row._id)
              )
            }
            action={
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={handleOpenConfirm}>
                  <Iconify icon="eva:trash-2-outline" />
                </IconButton>
              </Tooltip>
            }
          />

          <Scrollbar>
            <Table size="small" sx={{ minWidth: 360 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                // rowCount={tableData.length}
                // numSelected={selected.length}
                onSort={onSort}
                // onSelectAllRows={(checked) =>
                //   onSelectAllRows(
                //     checked,
                //     tableData.map((row) => row._id)
                //   )
                // }
              />

              <TableBody>
                {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    row ? (
                      <DocumentListTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        // onDeleteRow={() => handleDeleteRow(row._id)}
                        // onEditRow={() => handleEditRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        style={index % 2 ? { background: 'red' } : { background: 'green' }}
                        customerPage={customerPage}
                        machinePage={machinePage}
                        machineDrawings={machineDrawings}
                      />
                    ) : (
                      !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    )
                  )}

                {/* <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  /> */}

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
        <Grid item md={12}>
          <TableNoData isNotFound={isNotFound} />
        </Grid>
      </TableCard>

      <ConfirmDialog
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
              // handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
     {/* </Container> */}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData && inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  if (filterName) {
    inputData = inputData.filter(
      (document) =>
        document?.displayName?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        document?.docType?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        document?.customer?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        document?.machine?.serialNo?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        document?.docCategory?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        document?.documentVersions[0].versionNo?.toString().indexOf(filterName.toLowerCase()) >= 0 ||
        // (document?.isActive ? "Active" : "Deactive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(document?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((document) => filterStatus.includes(document.status));
  }

  return inputData;
}

export default DocumentList
