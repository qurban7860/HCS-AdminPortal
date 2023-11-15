import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
// @mui
import {
  Card,
  Table,
  TableBody,
  Container,
  TableContainer,
} from '@mui/material';
// redux
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from '../../../redux/store';
// routes
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
import { PATH_PAGE, PATH_SECURITY } from '../../../routes/paths';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'user.name', label: 'User Name', align: 'left' },
  { id: 'xs1', visibility: 'md1', label: 'User Login', align: 'left' },
  { id: 'xs2', visibility: 'md2', label: 'User IP', align: 'left' },
  { id: 'loginTime', label: 'Login Time', align: 'left' },
  { id: 'logoutTime', label: 'Logout Time', align: 'left' },
  { id: 'logoutBy', label: 'Logout By', align: 'left' },
  { id: 'xs3', visibility: 'xs3', label: 'Status', align: 'left' },
];

// ----------------------------------------------------------------------

export default function SignInLogList() {
  const {
    order,
    orderBy,
    setPage,
    //
    onSort,
  } = useTable({
    defaultOrderBy: 'loginTime', defaultOrder: 'desc'
  });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filterRequestStatus, setFilterRequestStatus] = useState(-1);
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const userId = localStorage.getItem('userId');

  const { signInLogs, filterBy, page, rowsPerPage, isLoading, initial } = useSelector((state) => state.user);

  const userRolesString = localStorage.getItem('userRoles');
  const userRoles = JSON.parse(userRolesString);
  const isSuperAdmin = userRoles?.some((role) => role.roleType === 'SuperAdmin');

  useLayoutEffect(() => {
    dispatch(getSignInLogs(userId));
  }, [dispatch, userId]);

  useEffect(() => {

    if(!isSuperAdmin){
      navigate(PATH_PAGE.page403)
    }

    if (initial) {
      setTableData(signInLogs);
    }
  }, [signInLogs, initial, isSuperAdmin, navigate]);

  const reloadList = () => {
    dispatch(getSignInLogs(userId));
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
    filterRequestStatus
  });

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

  const handleFilterRequestStatus = (event) => {
    dispatch(ChangePage(0))
    setFilterRequestStatus(event.target.value);
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

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  const handleViewRow = (id) => {
    navigate(PATH_SECURITY.users.view(id));
  };

  const configurations = JSON.parse(localStorage.getItem('configurations'));
  const AUTH = configurations?.filter((config) => config.type === 'AUTH');
  
  return (
      <Container maxWidth={false}>
        <Card sx={{ mb: 3, height: 160, position: 'relative'}}>
          <Cover generalSettings name="Sign In Logs" icon="ph:users-light" />
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
            filterRequestStatus={filterRequestStatus}
            onFilterRequestStatus={handleFilterRequestStatus}
          />
          {!isNotFound && <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            refresh={reloadList}
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
                        <RoleListTableRow
                          key={row._id}
                          row={row}
                          status={AUTH?.find((config) => (config.name === `${row?.statusCode}`))}
                          // status={AUTH?.find((config) => (config.name === row?.statusCode))}
                          onViewRow={()=> handleViewRow(row?.user?._id)}
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
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus, filterRequestStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if(filterRequestStatus===200)
    inputData = inputData.filter((log)=> log.statusCode===200);
  else if(filterRequestStatus===401)
    inputData = inputData.filter((log)=> log.statusCode!==200);

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
