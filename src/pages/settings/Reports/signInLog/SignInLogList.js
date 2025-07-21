import { useState, useEffect, useMemo, useLayoutEffect, useRef, useCallback } from 'react';
import debounce from 'lodash/debounce';
// @mui
import { Card, Box, Stack, MenuItem, Table, TableBody, Container, TableContainer } from '@mui/material';
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
import SignInLogListTableRow from './SignInLogListTableRow';
import {
  getSignInLogs,
  resetSignInLogsSuccess,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
} from '../../../../redux/slices/securityUser/securityUser';
import { Cover } from '../../../../components/Defaults/Cover';
import TableCard from '../../../../components/ListTableTools/TableCard';
import { PATH_SETTING } from '../../../../routes/paths';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import RHFFilteredSearchBar from '../../../../components/hook-form/RHFFilteredSearchBar';
import { RHFDateTimePicker, RHFSelect } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'requestedLogin', visibility: 'md1', label: 'Login', align: 'left', allowSearch: true },
  { id: 'user.name', label: 'User', align: 'left', allowSearch: true },
  { id: 'user.customer.name', label: 'Customer', align: 'left', allowSearch: true },
  { id: 'loginIP', visibility: 'md2', label: 'IP', align: 'left' },
  { id: 'loginSource', visibility: 'md2', label: 'Source', align: 'left' },
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
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [selectedSearchFilter, setSelectedSearchFilter] = useState('');

  const userId = localStorage.getItem('userId');

  const { signInLogs, filterBy, page, rowsPerPage, isLoadingLogs } = useSelector((state) => state.user);

  const defaultValues = useMemo(
    () => ({
      filteredSearchKey: "",
      statusCode: -1,
      loginTime: new Date(new Date().setHours(0, 0, 0, 0))
    }),
    []
  );

  const methods = useForm({ defaultValues });
  const { watch, handleSubmit } = methods;
  const { filteredSearchKey, statusCode, loginTime } = watch();
  const getSignInLogsList = useCallback(async () => {
    await dispatch(getSignInLogs(userId, page, rowsPerPage, filteredSearchKey, selectedSearchFilter, statusCode, loginTime));
  }, [dispatch, userId, page, rowsPerPage, filteredSearchKey, selectedSearchFilter, statusCode, loginTime]);

  useLayoutEffect(() => {
    getSignInLogsList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (signInLogs?.data) {
      setTableData(signInLogs?.data || []);
    }
  }, [signInLogs]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
  });

  const denseHeight = 60;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoadingLogs && !dataFiltered.length);

  const debouncedSearch = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterBy(value))
  }, 500))

  useEffect(() => {
    debouncedSearch.current.cancel();
  }, [debouncedSearch]);

  useEffect(() => {
    setFilterName(filterBy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleViewRow = (id) => {
    navigate(PATH_SETTING.security.users.view(id));
  };

  const configurations = JSON.parse(localStorage.getItem('configurations'));
  const AUTH = configurations?.filter((config) => config.type === 'AUTH');

  const handleSearch = async () => {
    await dispatch(ChangePage(0))
    await getSignInLogsList();
  }

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Sign In Logs" icon="ph:users-light" />
      </StyledCardContainer>
      <FormProvider {...methods} onSubmit={handleSubmit(handleSearch)}>
        <Card sx={{ px: 3, pt: 3, pb: 1 }} >
          <Stack spacing={2}>
            <Box rowGap={2} columnGap={2} display="grid"
              gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
            >
              <RHFDateTimePicker
                name="loginTime"
                label="From Login Time"
                value={loginTime}
                size="small"
              />
              <RHFSelect
                name="statusCode"
                size="small"
                label="Status"
              >
                <MenuItem key="-1" value={-1} >All</MenuItem>
                <MenuItem key="200" value={200}>Success</MenuItem>
                <MenuItem key="400" value={400} >Failed</MenuItem>
              </RHFSelect>
            </Box>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <Box rowGap={2} columnGap={2} display="grid" sx={{ flexGrow: 1, width: "100%" }}
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
                      handleSubmit(handleSearch)();
                    }
                  }}
                  fullWidth
                />

              </Box>
              <LoadingButton
                type="button"
                onClick={handleSubmit(handleSearch)}
                variant="contained"
              >
                Search
              </LoadingButton>
            </Stack>
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

function applyFilter({ inputData, comparator }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
