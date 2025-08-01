import debounce from 'lodash/debounce';
import { useState, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
// @mui
import { Container, Table, TableBody, TableContainer } from '@mui/material';
// routes
import { useNavigate } from 'react-router-dom';
import { ROOTS_REPORTS } from '../../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TablePaginationFilter,
  TableHeadFilter,
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
// sections
import EmailListTableRow from './EmailListTableRow';
import EmailListTableToolbar from './EmailListTableToolbar';
import {
  getEmails,
  resetEmails,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  setReportHiddenColumns,
} from '../../../redux/slices/email/emails';
import { fDateTime } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import DialogEmailViewDetails from '../../../components/Dialog/EmailViewDialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'toEmails', label: 'To', align: 'left', },
  { id: 'fromEmail', label: 'From', align: 'left', },
  { id: 'subject', label: 'Subject', align: 'left', },
  { id: 'customer.name', label: 'Customer', align: 'left', },
  { id: 'updatedAt', label: 'Updated At', align: 'right', },
];

// ----------------------------------------------------------------------

export default function EmailList() {
  const { initial, emails, filterBy, page, rowsPerPage, isLoading, reportHiddenColumns } = useSelector((state) => state.emails);

  const navigate = useNavigate();
  const {
    order,
    orderBy,
    setPage,
    selected,
    onSort,
  } = useTable({ defaultOrderBy: 'updatedAt', defaultOrder: 'desc' });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10)));
  };

  const onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) };
  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEmailId, setCurrentEmailId] = useState(null);

  const getSignInLogsList = useCallback(async () => {
    await dispatch(getEmails(page, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  useLayoutEffect(() => {
    getSignInLogsList();
    return () => {
      dispatch(resetEmails());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, rowsPerPage]);

  useEffect(() => {
    if (initial) {
      setTableData(emails?.data || []);
    }
  }, [emails?.data, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const isFiltered = filterName !== '';
  const isNotFound = (!dataFiltered?.length && !!filterName) || (!isLoading && !dataFiltered?.length);
  const denseHeight = 60;

  const debouncedSearch = useRef(debounce((value) => {
    dispatch(ChangePage(0));
    dispatch(setFilterBy(value));
  }, 500));

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value);
    setFilterName(event.target.value);
    setPage(0);
  };

  useEffect(() => {
    debouncedSearch.current.cancel();
  }, [debouncedSearch]);

  useEffect(() => {
    setFilterName(filterBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewRow = (id) => navigate(ROOTS_REPORTS.email.view(id));

  const handleResetFilter = () => {
    dispatch(setFilterBy(''));
    setFilterName('');
  };

  const handleHiddenColumns = async (arg) => {
    dispatch(setReportHiddenColumns(arg))
  };

  const handleOpenDialog = async (rowId) => {
    setOpenDialog(true);
    setCurrentEmailId(rowId);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentEmailId(null);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Email" icon="ph:users-light" />
      </StyledCardContainer>
      <TableCard>
        <EmailListTableToolbar
          filterName={filterName}
          onFilterName={handleFilterName}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
          onReload={getSignInLogsList}
        />

        {!isNotFound && (
          <TablePaginationFilter
            columns={TABLE_HEAD}
            hiddenColumns={reportHiddenColumns}
            handleHiddenColumns={handleHiddenColumns}
            count={emails?.totalCount || 0}
            page={page}

            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        )}
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table stickyHeader size="small" sx={{ minWidth: 360 }}>
              <TableHeadFilter
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                hiddenColumns={reportHiddenColumns}
                onSort={onSort}
              />

              <TableBody>
              {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
              .map((row, index) => (
               row ? (
            <EmailListTableRow
               key={row._id}
               row={row}
               hiddenColumns={reportHiddenColumns}
               onViewRow={() => handleViewRow(row._id)}
               selected={selected.includes(row._id)}
               selectedLength={selected.length}
               style={index % 2 ? { background: 'red' } : { background: 'green' }}
               handleOpenDialog={handleOpenDialog}
               />
              ) : (
                 !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                )
            ))}

                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        {!isNotFound && (
          <TablePaginationFilter
            count={emails?.totalCount || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        )}
      </TableCard>
      {openDialog && (
        <DialogEmailViewDetails
          open={openDialog}
          setOpenDialog={handleCloseDialog}
          emailId={currentEmailId}
        />
      )}
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (email) =>
        email?.toEmails?.some((toEmail) => toEmail.toLowerCase().includes(filterName.toLowerCase())) ||
        email?.subject?.toLowerCase().includes(filterName.toLowerCase()) ||
        email?.customer?.name?.toLowerCase().includes(filterName.toLowerCase()) ||
        fDateTime(email?.updatedAt)?.toLowerCase().includes(filterName.toLowerCase())
    );
  }

  return inputData;
}
