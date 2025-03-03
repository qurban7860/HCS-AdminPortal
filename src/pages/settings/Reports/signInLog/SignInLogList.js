import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import debounce from 'lodash/debounce';
// @mui
import {
  Grid, Card, Box, Stack,
  Table,
  TableBody,
  Container,
  TableContainer,
} from '@mui/material';
// redux
import { useNavigate } from 'react-router';
import { FormProvider, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from '../../../../redux/store';
// routes
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../../components/table';
import Scrollbar from '../../../../components/scrollbar';
// sections
import SignInLogListTableToolbar from './SignInLogListTableToolbar';
import SignInLogListTableRow from './SignInLogListTableRow';
import {
  getSignInLogs,
  resetSignInLogsSuccess,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
} from '../../../../redux/slices/securityUser/securityUser';
import { Cover } from '../../../../components/Defaults/Cover';
import { fDateTime } from '../../../../utils/formatTime';
import TableCard from '../../../../components/ListTableTools/TableCard';
import { PATH_SETTING } from '../../../../routes/paths';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import RHFFilteredSearchBar from '../../../../components/hook-form/RHFFilteredSearchBar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'requestedLogin', visibility: 'md1', label: 'Login', align: 'left', allowSearch: true },
  { id: 'user.name', label: 'User', align: 'left', allowSearch: true },
  { id: 'user.customer.name', label: 'Customer', align: 'left', allowSearch: true },
  // { id: 'user.contact.firstName', label: 'Contact', align: 'left' },
  { id: 'loginIP', visibility: 'md2', label: 'IP', align: 'left' },
  { id: 'loginTime', label: 'Login Time', align: 'left' },
  { id: 'logoutTime', label: 'Logout Time', align: 'left' },
  { id: 'loggedOutBy', label: 'Logout By', align: 'left' },
  { id: 'statusCode', visibility: 'xs3', label: 'Status', align: 'left' },
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

  const onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filterRequestStatus, setFilterRequestStatus] = useState(-1);
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [selectedSearchFilter, setSelectedSearchFilter] = useState('');

  const userId = localStorage.getItem('userId');

  const { signInLogs, filterBy, page, rowsPerPage, isLoadingLogs, initial } = useSelector((state) => state.user);

  const methods = useForm({
    defaultValues: {
      filteredSearchKey: "",
    },
  });

  const { watch, handleSubmit, setValue } = methods;
  const filteredSearchKey = watch('filteredSearchKey');
  const getSignInLogsList = useCallback(async () => {
    await dispatch(getSignInLogs(userId, page, rowsPerPage, filteredSearchKey, selectedSearchFilter));
  }, [dispatch, userId, page, rowsPerPage, filteredSearchKey, selectedSearchFilter]);

  useLayoutEffect(() => {
    // setSelectedSearchFilter("");
    // setValue("filteredSearchKey", "");
    getSignInLogsList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initial) {
      setTableData(signInLogs?.data || []);
    }
  }, [signInLogs, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
    filterRequestStatus
  });

  const denseHeight = 60;
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoadingLogs && !dataFiltered.length);

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

  useEffect(() => {
    setFilterName(filterBy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  const handleViewRow = (id) => {
    navigate(PATH_SETTING.security.users.view(id));
  };

  const configurations = JSON.parse(localStorage.getItem('configurations'));
  const AUTH = configurations?.filter((config) => config.type === 'AUTH');

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Sign In Logs" icon="ph:users-light" generalSettings />
      </StyledCardContainer>
      <FormProvider {...methods} onSubmit={handleSubmit(getSignInLogsList)}>
        <Card sx={{ px: 3, pt: 3, pb: 1 }} >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Box sx={{
              flexGrow: 1,
              width: { xs: '100%', sm: 'auto' }
            }}
            >
              <RHFFilteredSearchBar
                name="filteredSearchKey"
                filterOptions={TABLE_HEAD.filter((item) => item?.allowSearch)}
                setSelectedFilter={setSelectedSearchFilter}
                selectedFilter={selectedSearchFilter}
                placeholder="Enter Search here..."
                afterClearHandler={() => dispatch(resetSignInLogsSuccess)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(getSignInLogsList)();
                  }
                }}
                fullWidth
              />
            </Box>
            <LoadingButton
              type="button"
              onClick={handleSubmit(getSignInLogsList)}
              variant="contained"
            >
              Search
            </LoadingButton>
          </Stack>
        </Card>
      </FormProvider>

      <TableCard>
        {!isNotFound && <TablePaginationCustom
          count={signInLogs.totalCount}
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
                {(isLoadingLogs ? [...Array(rowsPerPage)] : dataFiltered)
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    row ? (
                      <SignInLogListTableRow
                        key={row._id}
                        row={row}
                        status={AUTH?.find((config) => (config.name === `${row?.statusCode}`))}
                        // status={AUTH?.find((config) => (config.name === row?.statusCode))}
                        onViewRow={() => handleViewRow(row?.user?._id)}
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
          count={signInLogs.totalCount}
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

  if (filterRequestStatus === 200)
    inputData = inputData.filter((log) => log.statusCode === 200);
  else if (filterRequestStatus === 401)
    inputData = inputData.filter((log) => log.statusCode !== 200);

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
