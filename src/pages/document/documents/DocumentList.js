import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  Grid,
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  Stack,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD, PATH_DOCUMENT } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import { useSettingsContext } from '../../../components/settings';
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
  getDocuments,
  deleteDocument,
  resetDocuments,
  setDocumentViewFormVisibility,
} from '../../../redux/slices/document/document';
import { Cover } from '../../components/Defaults/Cover';
import { fDate } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'doctype', label: 'Type', align: 'left' },
  { id: 'doccategory', label: 'Category', align: 'left' },
  { id: 'customerAccess', label: 'Customer Access', align: 'center' },
  { id: 'active', label: 'Active', align: 'center' },
  { id: 'created_at', label: 'Created At', align: 'right' },
];

// ----------------------------------------------------------------------
DocumentList.propTypes = {
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
};

export default function DocumentList({ customerPage, machinePage }) {
  const {
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
    onChangePage,
    onChangeRowsPerPage,
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
  const { customer } = useSelector((state) => state.customer);
  const { machine } = useSelector((state) => state.machine);
  const { documents, isLoading, error, documentInitial, responseMessage } = useSelector(
    (state) => state.document
  );
  const { customerDocuments, customerDocumentInitial } = useSelector(
    (state) => state.customerDocument
  );
  const { machineDocuments, machineDocumentInitial } = useSelector(
    (state) => state.machineDocument
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch(resetDocuments());
      if (customerPage || machinePage) {
        // console.log("customerPage || machinePage : ",customerPage , machinePage)
        if (customer?._id || machine?._id) {
          // console.log("customer?._id || machine?._id : ", customer?._id || machine?._id)
          await dispatch(
            getDocuments(customerPage ? customer?._id : null, machinePage ? machine?._id : null)
          );
        }
      } else {
        // console.log("all documents")
        await dispatch(getDocuments());
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, customerPage, machinePage]);

  useEffect(() => {
    setTableData(documents);
  }, [documents]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });
  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const denseHeight = 60;
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

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

  const handleEditRow = (id) => {
    // console.log(id);
    navigate(PATH_DOCUMENT.document.edit(id));
  };

  const handleViewRow = (id) => {
    if (customerPage || machinePage) {
      dispatch(getDocument(id));
      dispatch(setDocumentViewFormVisibility(true));
    } else {
      navigate(PATH_DOCUMENT.document.view(id));
    }
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus([]);
  };

  return (
    <>
      <Card sx={{ mt: 3 }}>
        <DocumentListTableToolbar
          filterName={filterName}
          filterStatus={filterStatus}
          onFilterName={handleFilterName}
          onFilterStatus={handleFilterStatus}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
          customerDocList
          machineDocList
        />

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
            <Table size="small" sx={{ minWidth: 960 }}>
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
                      />
                    ) : (
                      !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    )
                  )}

                {/* <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  /> */}

                <TableNoData isNotFound={isNotFound} sx={{ mx: 'auto' }} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </Card>

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
        // (document?.isActive ? "Active" : "Deactive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(document?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((document) => filterStatus.includes(document.status));
  }

  return inputData;
}
