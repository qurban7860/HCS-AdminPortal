// import { Helmet } from 'react-helmet-async';
// import { paramCase } from 'change-case';
import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  // Switch,
  // Grid,
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  // Stack,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_SETTING } from '../../../routes/paths';
// components
// import { useSnackbar } from '../../../components/snackbar';
// import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  // emptyRows,
  TableNoData,
  TableSkeleton,
  // TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog';
// sections
import DocumentTypeListTableRow from './DocumentTypeListTableRow';
import DocumentTypeListTableToolbar from './DocumentTypeListTableToolbar';
import {
  // getDocumentType,
  deleteDocumentType,
  getDocumentTypes,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy
} from '../../../redux/slices/document/documentType';
import { Cover } from '../../components/Defaults/Cover';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../components/ListTableTools/TableCard';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Type Name', align: 'left' },
  { id: 'xs1', label: 'Category', align: 'left' },
  { id: 'xs2', label: 'Customer Access', align: 'center' },
  { id: 'active', label: 'Active', align: 'center' },
  { id: 'created_at', label: 'Created At', align: 'right' },
];

// ----------------------------------------------------------------------

export default function DocumentTypeList() {
  const {
    // page,
    order,
    orderBy,
    // rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    // onChangePage,
    // onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'name',
  });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  const dispatch = useDispatch();
  // const { themeStretch } = useSettingsContext();
  // const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  // const { customer } = useSelector((state) => state.customer);
  const { documentTypes, filterBy, page, rowsPerPage, isLoading , initial } = useSelector(
    (state) => state.documentType
  );

  // console.log("documentTypes : ", documentTypes )

  useLayoutEffect(() => {
    dispatch(getDocumentTypes());
  }, [dispatch]);

  useEffect(() => {
    if (initial) {
      setTableData(documentTypes);
    }
  }, [documentTypes, initial]);

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

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const debouncedSearch = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterBy(value))
  }, 500))

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value);
    setFilterName(event.target.value)
    setPage(0);
  };
  
  useEffect(() => {
      debouncedSearch.current.cancel();
  }, [debouncedSearch]);
  
  useEffect(()=>{
      setFilterName(filterBy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleDeleteRow = async (id) => {
    try {
      // console.log(id);
      await dispatch(deleteDocumentType(id));
      dispatch(getDocumentTypes());
      setSelected([]);

      if (page > 0) {
        if (dataInPage.length < 2) {
          setPage(page - 1);
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row._id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleViewRow = (id) => {
    navigate(PATH_SETTING.documentType.view(id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
    <>
      <Container maxWidth={false}>
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
          }}
        >
          <Cover name="Document Types" icon="ph:users-light" generalSettings />
        </Card>

        <TableCard>
          <DocumentTypeListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
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
                        <DocumentTypeListTableRow
                          key={row._id}
                          row={row}
                          selected={selected.includes(row._id)}
                          onSelectRow={() => onSelectRow(row._id)}
                          onDeleteRow={() => handleDeleteRow(row._id)}
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
      </Container>

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
              handleDeleteRows(selected);
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
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  // (customer) => customer.name.toLowerCase().indexOf(filterName.toLowerCase()) || customer.tradingName.toLowerCase().indexOf(filterName.toLowerCase()) || customer.mainSite?.address?.city.toLowerCase().indexOf(filterName.toLowerCase()) || customer.mainSite?.address?.country.toLowerCase().indexOf(filterName.toLowerCase()) || customer.createdAt.toLowerCase().indexOf(filterName.toLowerCase()) !== -1

  if (filterName) {
    inputData = inputData.filter(
      (docType) =>
        docType?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        docType?.docCategory?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // (docType?.isActive ? "Active" : "Deactive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(docType?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((customer) => filterStatus.includes(customer.status));
  }

  return inputData;
}
