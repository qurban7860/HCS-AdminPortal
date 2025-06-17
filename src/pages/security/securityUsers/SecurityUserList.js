import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// @mui
import { Table, TableBody, Container, TableContainer } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_SETTING } from '../../../routes/paths';
// components
import Scrollbar from '../../../components/scrollbar';
import { Cover } from '../../../components/Defaults/Cover';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TableHeadFilter,
  TableSelectedAction,
  TablePaginationFilter,
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
  setReportHiddenColumns,
} from '../../../redux/slices/securityUser/securityUser';
import useResponsive from '../../../hooks/useResponsive';
import { getActiveRegions, resetActiveRegions } from '../../../redux/slices/region/region';
import { fDate } from '../../../utils/formatTime';
// constants
import TableCard from '../../../components/ListTableTools/TableCard';
import { StyledCardContainer } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

const ROLE_OPTIONS = ['Administrator', 'Normal User', 'Guest User', 'Restriced User'];
const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'login', visibility: 'xs1', label: 'Login', align: 'left' },
  { id: 'phone', visibility: 'xs2', label: 'Phone Number', align: 'left' },
  { id: 'roles.name.[]', visibility: 'md1', label: 'Roles', align: 'left' },
  { id: 'contact.firstName', visibility: 'xl', label: 'Contact', align: 'left' },
  { id: 'accountType', label: 'A/C', align: 'left' }, 
  // { id: 'status', label: 'S', align: 'left' },      
  { id: 'isActive', label: 'S', align: 'left' },
  { id: 'updatedAt', visibility: 'md', label: 'Updated At', align: 'right' },
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
    filterBy, 
    employeeFilterList, 
    filterRegion,
    activeFilterList, 
    page, 
    rowsPerPage, 
    isLoading,
    reportHiddenColumns
  } = useSelector((state) => state.user);
  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };
  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }
  
  const navigate = useNavigate();
  const [ filterName, setFilterName ] = useState('');
  const [ filterRole, setFilterRole ] = useState('all');
  const [ filterStatus, setFilterStatus ] = useState('all');
  const [ activeFilterListBy, setActiveFilterListBy ] = useState(activeFilterList);
  const [ employeeFilterListBy, setEmployeeFilterListBy ] = useState(employeeFilterList);
  const [ filterByRegion, setFilterByRegion ] = useState(filterRegion);
  const [filterAccountType, setFilterAccountType] = useState('all');
  const isMobile = useResponsive('down', 'lg');

  useLayoutEffect(() => {
    dispatch(getActiveRegions());
    return ()=>{
      dispatch(resetActiveRegions());
    }
  }, [ dispatch ]);

  const onRefresh = useCallback(() => {
    if(activeFilterListBy === "isArchived" ){
      dispatch(getSecurityUsers( { isArchived: true } ));
    }else if(activeFilterListBy === "invitationStatus" ){
      dispatch(getSecurityUsers( { invitationStatus: true } ));
    } else{
      dispatch(getSecurityUsers());
    }
  },[ dispatch, activeFilterListBy ] );

  useLayoutEffect(() => {
    onRefresh();
    return ()=>{
      dispatch(resetSecurityUsers());
    }
  }, [ dispatch, onRefresh ]);

  const dataFiltered = applyFilter({
    inputData: securityUsers,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
    activeFilterListBy,
    employeeFilterListBy,
    filterByRegion,
    filterAccountType,
  });
  
  const denseHeight = 60;
  const isFiltered = filterName !== '' || filterRole !== 'all' || filterStatus !== 'all';
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
const handleFilterAccountType = (event) => {
  setPage(0);
  setFilterAccountType(event.target.value);
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
},[ filterBy ] )

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
  };

  const handleViewRow = (id) => {
    navigate(PATH_SETTING.security.users.view(id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
    setFilterRole('all');
    setFilterStatus('all');
  };

  const handleHiddenColumns = async (arg) => {
    dispatch(setReportHiddenColumns(arg))
  };

  return (
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name="Users" />
        </StyledCardContainer>
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
            filterAccountType={filterAccountType}
            onFilterAccountType={handleFilterAccountType}
          />

        {!isNotFound && !isMobile && <TablePaginationFilter
            columns={TABLE_HEAD}
            hiddenColumns={reportHiddenColumns}
            handleHiddenColumns={handleHiddenColumns}
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}
           {!isNotFound && isMobile && <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={securityUsers?.length || 0 }
            />

            <Scrollbar>
              <Table stickyHeader size="small" sx={{ minWidth: 360 }}>
                <TableHeadFilter
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                  hiddenColumns={reportHiddenColumns}
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
                        hiddenColumns={reportHiddenColumns}
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

function applyFilter({ inputData, comparator, filterName, filterStatus, filterRole, activeFilterListBy, employeeFilterListBy, filterByRegion,filterAccountType }) {
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

  if (filterAccountType === 'sp') {
  inputData = inputData.filter(
    (user) => user.customer?.type?.toLowerCase() === 'sp'
  );
} else if (filterAccountType === 'non-sp') {
  inputData = inputData.filter(
    (user) => user.customer?.type?.toLowerCase() !== 'sp'
  );
}



  if (filterName) {
    inputData = inputData.filter(
      (securityUser) =>
        securityUser?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        securityUser?.email?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        securityUser?.phone?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        securityUser?.phone?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        `${securityUser?.contact?.firstName?.toLowerCase() || ''} ${securityUser?.contact?.lastName?.toLowerCase() || '' }`.indexOf(filterName.toLowerCase()) >= 0 ||
        securityUser?.roles?.map((obj) => obj.name).join(', ').toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // (securityUser?.isActive ? "Active" : "InActive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
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
