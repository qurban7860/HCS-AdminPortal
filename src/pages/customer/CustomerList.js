import { useState, useEffect , useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// @mui
import {
  Grid,
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
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_CUSTOMER } from '../../routes/paths';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import { FORMLABELS } from '../../constants/default-constants';

// sections
import CustomerListTableRow from './CustomerListTableRow';
import CustomerListTableToolbar from './CustomerListTableToolbar';
import { getCustomers, ChangePage, ChangeRowsPerPage, setFilterBy } from '../../redux/slices/customer/customer';
import { Cover } from '../components/Defaults/Cover';
import TableCard from '../components/ListTableTools/TableCard';
import { fDate } from '../../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'customerType', label: '', align: 'center', width: 1.5 },
  { id: 'name', label: 'Customer', align: 'left' },
  { id: 'xs1', label: 'Trading Name', align: 'left' },
  { id: 'xs2', label: 'Address', align: 'left' },
  { id: 'active', label: 'Active', align: 'center' },
  { id: 'created_at', label: 'Created At', align: 'left' },
];

// ----------------------------------------------------------------------

export default function CustomerList() {
  const {
    order,
    orderBy,
    setPage,
    selected,
    onSelectRow,
    onSelectAllRows,
    onSort,
  } = useTable({
    defaultOrderBy: '-createdAt',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { customers, filterBy, page, rowsPerPage, isLoading } = useSelector(
    (state) => state.customer
  );

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };
  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  

  useEffect(() => {
      dispatch(getCustomers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    setTableData(customers);
  }, [customers]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });
  const denseHeight = 60;
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);
  
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


  const handleViewRow = (id) => {
    navigate(PATH_CUSTOMER.view(id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
    setFilterStatus([]);
  };

  return (
    <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name={FORMLABELS.COVER.CUSTOMERS} />
        </StyledCardContainer>
      <TableCard >
        <CustomerListTableToolbar
          filterName={filterName}
          filterStatus={filterStatus}
          onFilterName={handleFilterName}
          onFilterStatus={handleFilterStatus}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
          customerDocList
          machineDocList
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
                      <CustomerListTableRow
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
    </Container>
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
      (customer) =>
        customer?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        customer?.tradingName?.some((tName) => tName.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ) ||
        `${customer?.mainSite?.address?.city}, ${customer?.mainSite?.address?.country}`.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // customer?.mainSite?.address?.country?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // (customer?.isActive ? "Active" : "Deactive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(customer?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((customer) => filterStatus.includes(customer.status));
  }

  return inputData;
}
