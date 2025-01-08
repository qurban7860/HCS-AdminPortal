import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
// @mui
import { Container, Table, TableBody, TableContainer } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_SUPPORT } from '../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../components/table';
import Scrollbar from '../../components/scrollbar';
// sections
import TicketFormTableRow from './TicketFormTableRow';
import TicketFormTableToolbar from './TicketFormTableToolbar';
import {
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  getTickets,
  resetTickets,
} from '../../redux/slices/ticket/tickets';
import { fDate } from '../../utils/formatTime';
import TableCard from '../../components/ListTableTools/TableCard';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'key', label: 'Ticket No.', align: 'left' },
  { id: 'machine', label: 'Serial No', align: 'left' },
  { id: 'summary', label: 'Summary', align: 'left' },
  { id: 'customer', label: 'Customer', align: 'left' },
  { id: 'issueType', label: 'IssueType', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'priority', label: 'Priority', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'right' },
];

// ----------------------------------------------------------------------

export default function TicketFormList(){
  const { initial, tickets, filterBy, page, rowsPerPage, isLoading } = useSelector((state) => state.tickets);

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

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }
  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [selectedIssueType, setSelectedIssueType] = useState(null);
  const [ selectedStatus, setSelectedStatus ] = useState(null);

  useLayoutEffect(() => {
    dispatch(getTickets(page, rowsPerPage ));
    return () => {
      dispatch(resetTickets());
    }
  }, [dispatch, machineId, page, rowsPerPage ]);

  useEffect(() => {
    if (initial) {
      setTableData(tickets?.data || [] );
    }
  }, [tickets?.data, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    selectedIssueType,
    selectedStatus,
  });

  const isFiltered = filterName !== '';
  const isNotFound = (!dataFiltered?.length && !!filterName) || (!isLoading && !dataFiltered?.length);
  const denseHeight = 60;

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


  const handleViewRow = (id) => navigate(PATH_SUPPORT.supportTickets.view(id));
  
  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
    setSelectedIssueType(null);
    setSelectedStatus(null);
  };
  
  return (
    <Container maxWidth={false} >
      <StyledCardContainer>
        <Cover name="Support Tickets" icon="ph:users-light" />
      </StyledCardContainer>
        <TableCard>
          <TicketFormTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedIssueType={selectedIssueType}
            setSelectedIssueType={setSelectedIssueType}
          />

          {!isNotFound && <TablePaginationCustom
            count={ tickets?.totalCount || 0 }
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
                    .map((row, index) =>
                      row ? (
                        <TicketFormTableRow
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
          {!isNotFound && <TablePaginationCustom
            count={ tickets?.totalCount || 0 }
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

function applyFilter({ inputData, comparator, filterName, selectedIssueType, selectedStatus }) {

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter((ticket) => {
      const fieldsToFilter = [
        ticket?.key,
        ticket?.machine?.serialNo,
        ticket?.customer?.name,
        ticket?.summary,
        ticket?.priority,
        ticket?.status,
        fDate(ticket?.createdAt),
      ];
      return fieldsToFilter.some((field) =>
        field?.toLowerCase().includes(filterName.toLowerCase())
      );
    });
  }
  

  if (selectedIssueType) {
    inputData = inputData.filter((ticket) => ticket?.issueType === selectedIssueType?.value);
  }

  if (selectedStatus) {
    inputData = inputData.filter((ticket) => ticket?.status === selectedStatus?.value);
  }
  
  return inputData;
}
