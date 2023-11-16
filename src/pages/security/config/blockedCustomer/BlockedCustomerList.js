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
import { PATH_CUSTOMER, PATH_PAGE } from '../../../../routes/paths';
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
import BlockedCustomerListTableRow from './BlockedCustomerListTableRow';
import BlockedCustomerListTableToolbar from './BlockedCustomerListTableToolbar';
import { getBlockedCustomers , deleteBlockedCustomer,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
 } from '../../../../redux/slices/securityConfig/blockedCustomers';
import { Cover } from '../../../components/Defaults/Cover';
import { fDate } from '../../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Customer', align: 'left' },
  { id: 'blockedBy', label: 'Updated By', align: 'left' },
  { id: 'createdAt', label: 'Updated At', align: 'left' },
  { id: 'action', label: 'Action', align: 'right'},
];

// ----------------------------------------------------------------------

export default function BlockedCustomerList() {
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
  // const [selectedUser, setSelectedUser] = useState('');
  const { blockedCustomers, filterBy, page, rowsPerPage, isLoading, initial } = useSelector((state) => state.blockedCustomer);

  const userRolesString = localStorage.getItem('userRoles');
  const userRoles = JSON.parse(userRolesString);
  const isSuperAdmin = userRoles?.some((role) => role.roleType === 'SuperAdmin');

  useLayoutEffect(() => {
    dispatch(getBlockedCustomers());
  }, [dispatch]);

  useEffect(() => {
    if(!isSuperAdmin){
      navigate(PATH_PAGE.page403)
    }

    if (initial) {
      setTableData(blockedCustomers);
    }
  }, [blockedCustomers, initial, navigate, isSuperAdmin]);

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
      await dispatch(deleteBlockedCustomer(id));
      await dispatch(getBlockedCustomers());
      setSelected('');
      enqueueSnackbar('Customer unblocked successfully');
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
    navigate(PATH_CUSTOMER.view(id));
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
          <Cover generalSettings name="Blocked Customer" icon="ph:users-light" />
        </Card>

        <TableCard>
          <BlockedCustomerListTableToolbar
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
                        <BlockedCustomerListTableRow
                          key={row._id}
                          row={row}
                          onViewRow={() => {handleViewRow(row?.blockedCustomer?._id)}}
                          onDeleteRow={() => {setOpenConfirm(true); setSelected(row?._id);}}
                          style={index % 2 ? { background: 'red' } : { background: 'green' }}
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
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={()=> setOpenConfirm(false)}
        title="Unblock Customer"
        content='Are you sure want to unblock customer?'
        action={
          <Button
            variant="contained"
            onClick={() => {
              handleDeleteRow(selected);
              setOpenConfirm(false);
            }}
          >
            Unblock Customer
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
        blockedUser?.blockedCustomer.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0  ||
        blockedUser?.createdBy?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0  ||
        fDate(blockedUser?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((customer) => filterStatus.includes(customer.status));
  }

  return inputData;
}
