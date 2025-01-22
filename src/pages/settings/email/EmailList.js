import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
// @mui
import { Container, Table, TableBody, TableContainer } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { ROOTS_REPORTS } from '../../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// components
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
import EmailListTableRow from './EmailListTableRow';
import EmailListTableToolbar from './EmailListTableToolbar';
import {
  getEmails,
  resetEmails,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy
} from '../../../redux/slices/email/emails';
import { fDateTime } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'toEmails', label: 'To', align: 'left', },
  { id: 'subject', label: 'Subject', align: 'left', },
  { id: 'customer.name', label: 'Customer', align: 'left', },
  { id: 'createdAt', label: 'Created At', align: 'right', },
];

// ----------------------------------------------------------------------

export default function EmailList() {
  const { initial, emails, filterBy, page, rowsPerPage, isLoading } = useSelector((state) => state.emails);

  const navigate = useNavigate();
  const { machineId } = useParams();
  const {
    order,
    orderBy,
    setPage,
    selected,
    onSort,
  } = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc' });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) };
  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);

  useLayoutEffect(() => {
    dispatch(getEmails(page, rowsPerPage));
    return () => {
      dispatch(resetEmails());
    };
  }, [dispatch, machineId, page, rowsPerPage]);

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

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Email" icon="ph:users-light" generalSettings />
      </StyledCardContainer>
      <TableCard>
        <EmailListTableToolbar
          filterName={filterName}
          onFilterName={handleFilterName}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
        />

        {!isNotFound && (
          <TablePaginationCustom
            count={emails?.totalCount || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        )}

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
                  .map((row, index) =>
                    row ? (
                      <EmailListTableRow
                        key={row._id}
                        row={row}
                        onViewRow={() => handleViewRow(row._id)}
                        selected={selected.includes(row._id)}
                        selectedLength={selected.length}
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
        {!isNotFound && (
          <TablePaginationCustom
            count={emails?.totalCount || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        )}
      </TableCard>
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
        fDateTime(email?.createdAt)?.toLowerCase().includes(filterName.toLowerCase())
    );
  }

  return inputData;
}
