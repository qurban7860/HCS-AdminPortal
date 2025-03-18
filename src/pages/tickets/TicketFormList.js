import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
// @mui
import { Container, Table, TableBody, TableContainer } from '@mui/material';
// routes
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PATH_SUPPORT } from '../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TablePaginationCustom,
  TablePaginationFilter,
  TableHeadFilter,
} from '../../components/table';
import { getCustomer, setCustomerDialog } from '../../redux/slices/customer/customer';
import Scrollbar from '../../components/scrollbar';
import FormProvider from '../../components/hook-form';
// sections
import TicketFormTableRow from './TicketFormTableRow';
import TicketFormTableToolbar from './TicketFormTableToolbar';
import {
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  getTickets,
  resetTickets,
  setReportHiddenColumns,
} from '../../redux/slices/ticket/tickets';
import { fDate } from '../../utils/formatTime';
import TableCard from '../../components/ListTableTools/TableCard';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import useResponsive from '../../hooks/useResponsive';
import { BUTTONS } from '../../constants/default-constants';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'issueType.name', label: <span style={{ marginLeft: 4 }}>T</span>, align: 'left' },
  { id: 'ticketNo', label: 'Ticket No.', align: 'left' },
  { id: 'summary', label: 'Summary', align: 'left', allowColumn : true },
  { id: 'machine.serialNo', label: 'Machine', align: 'left', allowColumn : true },
  { id: 'machine.machineModel.name', label: 'Model', align: 'left', allowColumn : true },
  { id: 'customer.name', label: 'Customer', align: 'left', allowColumn : true },
  { id: 'status.name', label: 'S', align: 'left', allowColumn : true },
  { id: 'priority.name', label: 'P', align: 'left', allowColumn : true },
  { id: 'createdAt', label: 'Created At', align: 'right' },
];

// ----------------------------------------------------------------------

export default function TicketFormList(){

  const { tickets, filterBy, page, rowsPerPage, isLoading, reportHiddenColumns } = useSelector((state) => state.tickets);

  const navigate = useNavigate();
  const methods = useForm();

  const {
    order,
    orderBy,
    setPage,
    selected,
    onSort,
    onSelectRow,
  } = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc' });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }
  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [ selectedIssueType, setSelectedIssueType ] = useState(null);
  const [ selectedRequestType, setSelectedRequestType ] = useState(null);
  const [ selectedStatus, setSelectedStatus ] = useState([]);
  const [ selectedStatusType, setSelectedStatusType ] = useState(null);
  const [ selectedResolvedStatus, setSelectedResolvedStatus ] = useState(null);
  const isMobile = useResponsive('down', 'sm');

  useLayoutEffect(() => {
    dispatch(getTickets(page, rowsPerPage ));
    return () => {
      dispatch(resetTickets());
    }
  }, [dispatch, page, rowsPerPage ]);
  
  const onRefresh = () => {
    dispatch(ChangePage(0));
    dispatch(getTickets(0, rowsPerPage, selectedIssueType?._id, selectedRequestType?._id, selectedResolvedStatus, selectedStatusType?._id, selectedStatus.map(s => s._id)));
  };  

  useEffect(() => {
    setTableData(tickets?.data || [] );
  }, [tickets?.data ]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
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
  
  const handleCustomerDialog = (e, id) => {
    dispatch(getCustomer(id))
    dispatch(setCustomerDialog(true))
  }
  
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
    setSelectedRequestType(null);
    setSelectedStatus([]);
    setSelectedStatusType(null);
    setSelectedResolvedStatus(null);
  };
  
  const handleHiddenColumns = async (arg) => {
    dispatch(setReportHiddenColumns(arg));
  };
  
  const toggleAdd = () => {
    navigate(PATH_SUPPORT.supportTickets.new);
  };

  return (
    <Container maxWidth={false} >
      <StyledCardContainer>
        <Cover name="Support Tickets" icon="ph:users-light" 
        SubOnClick={toggleAdd} 
        addButton={BUTTONS.ADDTICKET}/>
      </StyledCardContainer>
      <FormProvider {...methods}>
        <TableCard>
          <TicketFormTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
            filterIssueType={selectedIssueType}
            onFilterIssueType={setSelectedIssueType}
            filterRequestType={selectedRequestType}
            onFilterRequestType={setSelectedRequestType}
            filterStatus={selectedStatus}
            onFilterStatus={setSelectedStatus}
            filterStatusType={selectedStatusType}
            onFilterStatusType={setSelectedStatusType}
            filterResolvedStatus={selectedResolvedStatus} 
            onFilterResolvedStatus={setSelectedResolvedStatus} 
            onReload={onRefresh}
          />

          {!isNotFound && !isMobile && (
            <TablePaginationFilter
              columns={TABLE_HEAD.filter((item) => item?.allowColumn)} 
              hiddenColumns={reportHiddenColumns}
              handleHiddenColumns={handleHiddenColumns}
              count={tickets?.totalCount || 0}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          )}

          {!isNotFound && isMobile && (
            <TablePaginationCustom
              count={tickets?.totalCount || 0}
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
                    .map((row, index) =>
                      row ? (
                        <TicketFormTableRow
                          key={row._id}
                          row={row}
                          hiddenColumns={reportHiddenColumns}
                          onSelectRow={() => onSelectRow(row._id)}
                          onViewRow={() => handleViewRow(row._id)}
                          selected={selected.includes(row._id)}
                          selectedLength={selected.length}
                          handleCustomerDialog={(e) =>
                            row?.customer && handleCustomerDialog(e, row?.customer?._id)
                          }
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
        </FormProvider>
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
    inputData = inputData.filter((ticket) => {
      const fieldsToFilter = [
        ticket?.ticketNo,
        ticket?.machine?.serialNo,
        ticket?.machine?.machineModel?.name,
        ticket?.customer?.name,
        ticket?.summary,
        ticket?.status?.name,
        ticket?.priority?.name,
        fDate(ticket?.createdAt),
      ];
      return fieldsToFilter.some((field) =>
        field?.toLowerCase().includes(filterName.toLowerCase())
      );
    });
  }
  
  return inputData;
}

