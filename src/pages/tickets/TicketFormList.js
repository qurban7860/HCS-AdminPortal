/* eslint-disable react-hooks/exhaustive-deps */
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
  { id: 'summary', label: 'Summary', align: 'left', allowColumn: true },
  { id: 'machine.serialNo', label: 'Machine', align: 'left', allowColumn: true },
  { id: 'machine.machineModel.name', label: 'Model', align: 'left', allowColumn: true },
  { id: 'customer.name', label: 'Customer', align: 'left', allowColumn: true },
  { id: 'reporter.name', label: 'Reporter', align: 'left', allowColumn: true },
  { id: 'status.name', label: 'Status', title: "S", align: 'left', allowColumn: true },
  { id: 'priority.name', label: 'Priority', title: "P", align: 'left', allowColumn: true },
  { id: 'assignees.name', label: 'Assignees', align: 'left', allowColumn: true },
  { id: 'createdAt', label: 'Created At', align: 'right' },
];

// ----------------------------------------------------------------------

export default function TicketFormList() {
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
  
  const onChangePage = (event, newPage) => { 
    dispatch(ChangePage(newPage)); 
  };

  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [selectedIssueType, setSelectedIssueType] = useState(null);
  const [selectedRequestType, setSelectedRequestType] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedStatusType, setSelectedStatusType] = useState(null);
  const [selectedResolvedStatus, setSelectedResolvedStatus] = useState('unresolved');
  const [selectedPriority, setSelectedPriority] = useState(null);
  const isMobile = useResponsive('down', 'sm');
  const prefix = JSON.parse(localStorage.getItem('configurations'))?.find((config) => config?.name?.toLowerCase() === 'ticket_prefix')?.value?.trim() || ''; 

  // Effect to fetch tickets when page or rowsPerPage changes
  // useLayoutEffect(() => {
  //   dispatch(getTickets({ page, rowsPerPage }));
  //   return () => {
  //     dispatch(resetTickets());
  //   };
  // }, [dispatch, page, rowsPerPage]);

  // // Trigger data fetch when any of the filters change

  // useEffect(() => {
  //   // Only reset page to 0 if filters actually changed (not on every page/row change)
  //   if (
  //     selectedIssueType || selectedRequestType || selectedStatus.length || 
  //     selectedStatusType || selectedResolvedStatus || selectedPriority
  //   ) {
  //     dispatch(ChangePage(0));
  //   }
  
  //   dispatch(getTickets({
  //     page,
  //     rowsPerPage,
  //     issueType: selectedIssueType?._id,
  //     requestType: selectedRequestType?._id,
  //     isResolved: selectedResolvedStatus,
  //     statusType: selectedStatusType?._id,
  //     status: selectedStatus.map(s => s._id),
  //     priority: selectedPriority?._id,
  //   }));
  // }, [
  //   dispatch,
  //   page,
  //   rowsPerPage,
  //   selectedIssueType,
  //   selectedRequestType,
  //   selectedStatus,
  //   selectedStatusType,
  //   selectedResolvedStatus,
  //   selectedPriority
  // ]);

  useEffect(() => {
    const fetchData = () => {
      dispatch(getTickets({
        page,
        pageSize: rowsPerPage,
        issueType: selectedIssueType?._id,
        requestType: selectedRequestType?._id,
        isResolved: selectedResolvedStatus,
        statusType: selectedStatusType?._id,
        status: selectedStatus.map(s => s._id),
        priority: selectedPriority?._id,
      }));
    };
    fetchData();
    return () => {
      dispatch(resetTickets());
    };
  }, [
    dispatch,
    page,
    rowsPerPage,
    selectedIssueType?._id,
    selectedRequestType?._id,
    selectedResolvedStatus,
    selectedStatusType?._id,
    selectedStatus.map(s => s._id).join(','), 
    selectedPriority?._id,
  ]);

  const onRefresh = () => {
    dispatch(ChangePage(0));
    dispatch(getTickets({
      page: 0,
      pageSize: rowsPerPage,
      issueType: selectedIssueType?._id,
      requestType: selectedRequestType?._id,
      isResolved: selectedResolvedStatus,
      statusType: selectedStatusType?._id,
      status: selectedStatus.map(s => s._id),
      priority: selectedPriority?._id,
    }));
  };

  useEffect(() => {
    setFilterName(filterBy);
  }, [filterBy]);

  const dataFiltered = applyFilter({
    comparator: getComparator(order, orderBy),
    inputData: tickets?.data || [],
    filterName,
    prefix,
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

  const handleCustomerDialog = (e, id) => {
    dispatch(getCustomer(id));
    dispatch(setCustomerDialog(true));

  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
    setSelectedIssueType(null);
    setSelectedPriority(null);
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
    <Container maxWidth={false}>
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
            filterPriority={selectedPriority}
            onFilterPriority={setSelectedPriority}
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
                          onViewRow={() => navigate(PATH_SUPPORT.supportTickets.view(row._id))}
                          selected={selected.includes(row._id)}
                          selectedLength={selected.length}
                          handleCustomerDialog={(e) =>
                            row?.customer && handleCustomerDialog(e, row?.customer?._id)
                          }

                          style={index % 2 ? { background: 'red' } : { background: 'green' }}
                          prefix={prefix}
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

function applyFilter({ inputData, comparator, filterName, prefix = '' }) {
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
        `${prefix} - ${ticket?.ticketNo}`.trim(),
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
