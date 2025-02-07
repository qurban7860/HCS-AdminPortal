import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
// @mui
import { Container, Table, TableBody, TableContainer } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
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


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'issueType.name', label: 'Issue Type', align: 'left' },
  { id: 'ticketNo', label: 'Ticket No.', align: 'left' },
  { id: 'summary', label: 'Summary', align: 'left', allowColumn : true },
  { id: 'machine.serialNo', label: 'Machine', align: 'left', allowColumn : true },
  { id: 'machine.machineModel.name', label: 'Model', align: 'left', allowColumn : true },
  { id: 'customer.name', label: 'Customer', align: 'left', allowColumn : true },
  { id: 'status.name', label: 'Status', align: 'left', allowColumn : true },
  { id: 'priority.name', label: 'Priority', align: 'left', allowColumn : true },
  { id: 'createdAt', label: 'Updated At', align: 'right' },
];

// ----------------------------------------------------------------------

export default function TicketFormList(){

  const { tickets, filterBy, page, rowsPerPage, isLoading, reportHiddenColumns } = useSelector((state) => state.tickets);

  const navigate = useNavigate();
  const { machineId } = useParams();
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
  const [ selectedStatus, setSelectedStatus ] = useState(null);
  const [selectedStatusType, setSelectedStatusType] = useState(null);
  const isMobile = useResponsive('down', 'sm');

  useLayoutEffect(() => {
    dispatch(getTickets(page, rowsPerPage ));
    return () => {
      dispatch(resetTickets());
    }
  }, [dispatch, machineId, page, rowsPerPage ]);

  useEffect(() => {
      setTableData(tickets?.data || [] );
  }, [tickets?.data ]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    selectedStatus,
    selectedStatusType,
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
    setSelectedStatus(null);
    setSelectedStatusType(null);
  };
  
  const handleHiddenColumns = async (arg) => {
    dispatch(setReportHiddenColumns(arg));
  };

  return (
    <Container maxWidth={false} >
      <StyledCardContainer>
        <Cover name="Support Tickets" icon="ph:users-light" />
      </StyledCardContainer>
      <FormProvider {...methods}>
        <TableCard>
          <TicketFormTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
            filterStatus={selectedStatus}
            onFilterStatus={setSelectedStatus}
            filterStatusType={selectedStatusType}
            onFilterStatusType={setSelectedStatusType}
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

function applyFilter({ inputData, comparator, filterName, selectedStatus, selectedStatusType }) {

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
        ticket?.customer?.name,
        ticket?.summary,
        ticket?.priority?.name,
        fDate(ticket?.createdAt),
      ];
      return fieldsToFilter.some((field) =>
        field?.toLowerCase().includes(filterName.toLowerCase())
      );
    });
  }
  
  if (selectedStatus?.length) {
    inputData = inputData.filter((ticket) =>
      selectedStatus.some((status) => status._id === ticket?.status?._id)
    );
  }  

  if (selectedStatusType) {
    inputData = inputData.filter((ticket) => ticket?.status?.statusType?._id === selectedStatusType?._id);
  }
  
  return inputData;
}
