import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// @mui
import {
  Card,
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
  Grid,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
// routes
import { PATH_PAGE, PATH_SECURITY } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../../components/table';
import Scrollbar from '../../../../components/scrollbar';
import ConfirmDialog from '../../../../components/confirm-dialog';
// sections
import BlockedUserListTableRow from './BlockedUserListTableRow';
import BlockedUserListTableToolbar from './BlockedUserListTableToolbar';
import { getBlockedUsers , deleteBlockedUser,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
 } from '../../../../redux/slices/securityConfig/blockedUsers';
import { Cover } from '../../../components/Defaults/Cover';
import { fDate } from '../../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Users', align: 'left' },
  { id: 'email', label: 'User Email', align: 'left' },
  { id: 'customer', label: 'Customer', align: 'left' },
  { id: 'blockedBy', label: 'Updated By', align: 'left' },
  { id: 'createdAt', label: 'Updated At', align: 'left' },
  { id: 'action', label: 'Action', align: 'right'},
];

// ----------------------------------------------------------------------

export default function BlockedUserList() {
  const {
    // page,
    order,
    orderBy,
    // rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
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

  const onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { blockedUsers, filterBy, page, rowsPerPage, isLoading, initial } = useSelector((state) => state.blockedUser);

  const userRolesString = localStorage.getItem('userRoles');
  const userRoles = JSON.parse(userRolesString);
  const isSuperAdmin = userRoles?.some((role) => role.roleType === 'SuperAdmin');

  useLayoutEffect(() => {
    dispatch(getBlockedUsers());
  }, [dispatch]);

  useEffect(() => {
    if(!isSuperAdmin){
      navigate(PATH_PAGE.page403)
    }

    if (initial) {
      setTableData(blockedUsers);
    }
  }, [blockedUsers, initial, navigate, isSuperAdmin]);

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
      await dispatch(deleteBlockedUser(id));
      await dispatch(getBlockedUsers());
      setSelected('');
      enqueueSnackbar('User unblocked successfully');

      if (page > 0) {
        if (dataInPage.length < 2) {
          setPage(page - 1);
        }
      }
    } catch (error) {
      if (error.Message) {
        enqueueSnackbar(error.Message, { variant: `error` });
      } else if (error.message) {
        enqueueSnackbar(error.message, { variant: `error` });
      } else {
        enqueueSnackbar('Something went wrong!', { variant: `error` });
      }
      console.log('Error:', error);
    }
  };

  
  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  const handleViewRow = (id) => {
    navigate(PATH_SECURITY.users.view(id));
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
          <Cover generalSettings name="Blocked User" icon="ph:users-light" />
        </Card>

        <TableCard>
          <BlockedUserListTableToolbar
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
                        <BlockedUserListTableRow
                          key={row._id}
                          row={row}
                          onViewRow={() => {handleViewRow(row?.blockedUser?._id)}}
                          onDeleteRow={() => {
                            setSelected(row?._id);
                            setOpenConfirm(true);
                          }
                          }
                          style={index % 2 ? { background: 'red' } : { background: 'green' }}
                        />
                      ) : (
                        !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )}
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

          <Grid md={12}>
            <TableNoData isNotFound={isNotFound} />
          </Grid>
        </TableCard>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={()=> setOpenConfirm(false)}
        title="Unblock User"
        content='Are you sure want to unblock user?'
        action={
          <Button
            variant="contained"
            onClick={() => {
              handleDeleteRow(selected);
              setOpenConfirm(false);
            }}
          >
            Unblock User
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

  if (filterName) {
    inputData = inputData.filter(
      (blockedUser) =>
        blockedUser?.blockedUser.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0  ||
        blockedUser?.createdBy?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0  ||
        fDate(blockedUser?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((customer) => filterStatus.includes(customer.status));
  }

  return inputData;
}
