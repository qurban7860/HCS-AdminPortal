import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {  useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// @mui
import {
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
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
import RoleListTableToolbar from './SignInLogListTableToolbar';
import RoleListTableRow from './SignInLogListTableRow';
import { getSignInLogs,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
 } from '../../../redux/slices/securityUser/securityUser';
import { Cover } from '../../components/Defaults/Cover';
import { fDateTime } from '../../../utils/formatTime';
import TableCard from '../../components/ListTableTools/TableCard';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'userName', label: 'User Name', align: 'left' },
  { id: 'xs1', label: 'User Login', align: 'left' },
  { id: 'xs2', label: 'User IP', align: 'left' },
  { id: 'loginTime', label: 'Login Time', align: 'left' },
  { id: 'logoutTime', label: 'Logout Time', align: 'left' },
];

// ----------------------------------------------------------------------

export default function SignInLogList() {
  const {
    // page,
    order,
    orderBy,
    // rowsPerPage,
    setPage,
    //
    selected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    // onChangePage,
    // onChangeRowsPerPage,
  } = useTable({
    // defaultOrderBy: 'loginTime',
  });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  const dispatch = useDispatch();



  const navigate = useNavigate();

  const [filterName, setFilterName] = useState('');

  const [tableData, setTableData] = useState([]);

  const [filterStatus, setFilterStatus] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const userId = localStorage.getItem('userId');

  const { signInLogs, filterBy, page, rowsPerPage, isLoading, initial } = useSelector((state) => state.user);
  useLayoutEffect(() => {
    dispatch(getSignInLogs(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (initial) {
      setTableData(signInLogs);
    }
  }, [signInLogs, initial]);

  const reloadList = () => {
    dispatch(getSignInLogs(userId));
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });


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

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.role.view(id));
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
            // mt: '24px',
          }}
        >
          <Cover generalSettings="enabled" name="Sign In Logs" icon="ph:users-light" />
        </Card>

        <TableCard>
          <RoleListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
            buttonAction={reloadList}
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
                        <RoleListTableRow
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
      (logs) =>
        logs?.user?.name?.toLowerCase().indexOf(filterName.trim().toLowerCase()) >= 0 ||
        logs?.user?.login?.toLowerCase().indexOf(filterName.trim().toLowerCase()) >= 0 ||
        logs?.loginIP?.toLowerCase().indexOf(filterName.trim().toLowerCase()) >= 0 ||
        fDateTime(logs?.loginTime)?.toLowerCase().indexOf(filterName.trim().toLowerCase()) >= 0 ||
        fDateTime(logs?.logoutTime)?.toLowerCase().indexOf(filterName.trim().toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((customer) => filterStatus.includes(customer.status));
  }

  return inputData;
}
