import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// @mui
import { Card, Table, TableBody, Container, TableContainer } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_SECURITY } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import Scrollbar from '../../../components/scrollbar';
import { Cover } from '../../../components/Defaults/Cover';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
// sections
import SecurityUserTableToolbar from './SecurityUserTableToolbar';
import UserTableRow from './SecurityUserTableRow';
import {
  getSecurityUsers,
  resetSecurityUsers,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  setActiveFilterList,
  setEmployeeFilterList,
  setFilterRegion,
} from '../../../redux/slices/securityUser/securityUser';
import { getActiveRegions, resetActiveRegions } from '../../../redux/slices/region/region';
import { fDate } from '../../../utils/formatTime';
// constants
import TableCard from '../../../components/ListTableTools/TableCard';

// ----------------------------------------------------------------------

// const STATUS_OPTIONS = ['all', 'active', 'banned'];

const ROLE_OPTIONS = ['Administrator', 'Normal User', 'Guest User', 'Restriced User'];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'email', visibility: 'xs1', label: 'Email', align: 'left' },
  { id: 'phone', visibility: 'xs2', label: 'Phone Number', align: 'left' },
  { id: 'roles.name.[]', visibility: 'md1', label: 'Roles', align: 'left' },
  // { id: 'regions.name.[]', visibility: 'md1', label: 'Regions', align: 'left' },
  { id: 'isOnline', label: 'Online', align: 'center' },
  { id: 'currentEmployee', label: 'Employed', align: 'center' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'createdAt', label: 'Created At', align: 'right' },
];

// ----------------------------------------------------------------------

export default function SecurityUserList() {
  const {
    dense,
    order,
    orderBy,
    setPage,
    selected,
    onSelectRow,
    onSort,
  } = useTable({
    defaultOrderBy: 'isOnline', defaultOrder: 'desc',
  });

  const dispatch = useDispatch();
  const {
    securityUsers,
    error,
    responseMessage,
    initial,
    securityUserEditFormVisibility,
    securityUserFormVisibility,
    filterBy, 
    employeeFilterList, 
    filterRegion,
    activeFilterList, 
    page, 
    rowsPerPage, 
    isLoading
  } = useSelector((state) => state.user);

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };
  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }
  
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [ tableData, setTableData ] = useState([]);
  const [ filterName, setFilterName ] = useState('');
  const [ filterRole, setFilterRole ] = useState('all');
  const [ filterStatus, setFilterStatus ] = useState('all');
  const [ activeFilterListBy, setActiveFilterListBy ] = useState(activeFilterList);
  const [ employeeFilterListBy, setEmployeeFilterListBy ] = useState(employeeFilterList);
  const [ filterByRegion, setFilterByRegion ] = useState(filterRegion);


  useLayoutEffect(() => {
    dispatch(getSecurityUsers());
    dispatch(getActiveRegions());
    return ()=>{
      dispatch(resetSecurityUsers());
      dispatch(resetActiveRegions());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, securityUserEditFormVisibility, securityUserFormVisibility]);

  useEffect(() => {
    if (initial) {
      setTableData(securityUsers);
    }
  }, [securityUsers, error, enqueueSnackbar, responseMessage, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
    activeFilterListBy,
    employeeFilterListBy,
    filterByRegion,
  });
  

  
  const denseHeight = 60;
  const isFiltered = filterName !== '' || filterRole !== 'all' || filterStatus !== 'all';
  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus) || 
    (!dataFiltered.length && !isLoading);

  const debouncedSearch = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterBy(value))
  }, 500))

const handleFilterName = (event) => {
  debouncedSearch.current(event.target.value);
  setFilterName(event.target.value)
  setPage(0);
};

const debouncedVerified = useRef(debounce((value) => {
  dispatch(ChangePage(0))
  dispatch(setActiveFilterList(value))
}, 500))

const handleFilterListBy = (event) => {
  debouncedVerified.current(event.target.value);
  setActiveFilterListBy(event.target.value)
  setPage(0);
};

const debouncedEmployeeFilter= useRef(debounce((value) => {
  dispatch(ChangePage(0))
  dispatch(setEmployeeFilterList(value))
}, 500))

const handleEmployeeFilterListBy = (event) => {
  debouncedEmployeeFilter.current(event.target.value);
  setEmployeeFilterListBy(event.target.value)
  setPage(0);
};


const debouncedFilterRegion = useRef(debounce((value) => {
  dispatch(ChangePage(0))
  dispatch(setFilterRegion(value))
}, 500))

const handleFilterListByRegion = (value) => {
  debouncedFilterRegion.current(value);
  setFilterByRegion(value)
  setPage(0);
};

useEffect(() => {
    debouncedVerified.current.cancel();
    debouncedSearch.current.cancel();
    debouncedFilterRegion.current.cancel();
}, [debouncedSearch]);

useEffect(()=>{
    setFilterName(filterBy)
  // eslint-disable-next-line react-hooks/exhaustive-deps
},[])

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
  };

  const handleViewRow = (id) => {
    // dispatch(getSecurityUser(id))
    navigate(PATH_SECURITY.users.view(id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
    setFilterRole('all');
    setFilterStatus('all');
  };

  const onRefresh = () => {
    dispatch(getSecurityUsers());
  };

  return (
      <Container maxWidth={false}>
        <Card sx={{ height: 160, position: 'relative' }}>
          <Cover name="Users" icon="ph:users-light" />
        </Card>
        <TableCard>
          <SecurityUserTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterRole={filterRole}
            optionsRole={ROLE_OPTIONS}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            onResetFilter={handleResetFilter}
            filterListBy={activeFilterListBy}
            onFilterListBy={handleFilterListBy}
            employeeFilterListBy={employeeFilterListBy}
            onEmployeeFilterListBy={handleEmployeeFilterListBy}
            filterByRegion={filterByRegion}
            onFilterListByRegion={handleFilterListByRegion}
            onReload={onRefresh}
          />

        {!isNotFound && <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            // refresh={onRefresh}
          />}
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
            />

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
                        <UserTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
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

function applyFilter({ inputData, comparator, filterName, filterStatus, filterRole, activeFilterListBy, employeeFilterListBy, filterByRegion }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if(activeFilterListBy ==='active' )
    inputData = inputData.filter((user)=> user.isActive === true );
  else if(activeFilterListBy ==='inActive' )
    inputData = inputData.filter((user)=> user.isActive === false );
  
  if(employeeFilterListBy ==='employee' )
    inputData = inputData.filter((user)=> user.currentEmployee === true );
  else if(employeeFilterListBy ==='notEmployee' )
    inputData = inputData.filter((user)=> user.currentEmployee === false );
  
    if (filterByRegion) {
      inputData = inputData.filter((user) => user.regions.some((region) => region === filterByRegion?._id));
    }

  if (filterName) {
    inputData = inputData.filter(
      (securityUser) =>
        securityUser?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        securityUser?.email?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        securityUser?.phone?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        securityUser?.phone?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        securityUser?.roles?.map((obj) => obj.name).join(', ').toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // (securityUser?.isActive ? "Active" : "Deactive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(securityUser?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((user) => user.status === filterStatus);
  }

  if (filterRole !== 'all') {
    inputData = inputData.filter((user) => user.role === filterRole);
  }

  return inputData;
}
