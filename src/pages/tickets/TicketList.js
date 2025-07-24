import debounce from 'lodash/debounce';
import { useState, useEffect, useRef, memo, useMemo, useCallback } from 'react';
// @mui
import { Container, Table, TableBody, TableContainer } from '@mui/material';
// routes
import { useNavigate } from 'react-router-dom';
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
import Scrollbar from '../../components/scrollbar';
// sections
import TicketFormTableRow from './TicketTableRow';
import TicketTableController from './TicketTableController';
import { ChangeRowsPerPage, ChangePage, setFilterBy, getTickets, resetTickets, getTicketSettings, resetTicketSettings, setReportHiddenColumns } from '../../redux/slices/ticket/tickets';
import { getActiveSecurityUsers, resetActiveSecurityUsers } from '../../redux/slices/securityUser/securityUser';
import { fDate } from '../../utils/formatTime';
import TableCard from '../../components/ListTableTools/TableCard';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import useResponsive from '../../hooks/useResponsive';
import { BUTTONS } from '../../constants/default-constants';
import { getArticleByValue } from '../../redux/slices/support/knowledgeBase/article';
import HelpSidebar from './utils/HelpSideBar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'issueType.name', label: 'T', tooltip: 'Issue Type', align: 'left' },
  { id: 'status.name', label: 'S', align: 'left', tooltip: 'Status', allowColumn: true },
  { id: 'priority.name', label: 'P',align: 'left', tooltip: 'Priority', allowColumn: true },
  { id: 'ticketNo', label: 'Ticket No.', align: 'left' },
  { id: 'summary', label: 'Summary', align: 'left', allowColumn: true },
  { id: 'machine.serialNo', label: 'Machine', align: 'left', allowColumn: true },
  { id: 'machine.machineModel.name', label: 'Model', align: 'left', allowColumn: true },
  { id: 'customer.name', label: 'Customer', align: 'left', allowColumn: true },
  { id: 'reporter.name', label: 'Reporter', align: 'left', allowColumn: true },
  { id: 'assignees.name.[]', label: 'Assignees', align: 'left', allowColumn: true },
  { id: 'createdAt', label: 'Created At', align: 'right' },
];

// ----------------------------------------------------------------------

function TicketList() {
  const { tickets, filterBy, page, rowsPerPage, isLoading, reportHiddenColumns } = useSelector((state) => state.tickets);
  const { article } = useSelector((state) => state.article);
  const navigate = useNavigate();
  const {
    order,
    orderBy,
    setPage,
    onSort,
  } = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc' });

  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [helpOpen, setHelpOpen] = useState(false);
  const isMobile = useResponsive('down', 'sm');

  const configurations = useMemo(() =>
    JSON.parse(localStorage.getItem('configurations')) || []
  , []);

  const prefix = useMemo(() =>
    configurations?.find((config) => config?.name?.toLowerCase() === 'ticket_prefix')?.value?.trim() || ''
  , [configurations]);

  useEffect(() => {
    const helpPrefix = configurations?.find((config) => 
      config?.name?.toLowerCase() === 'support_ticket_creation_process'
    )?.value?.trim() || ''
  if (helpPrefix) {
    dispatch(getArticleByValue(helpPrefix));
  }
  }, [dispatch, configurations]); 

  useEffect(() => {
      dispatch(getTickets({
        page,
        pageSize: rowsPerPage,
      }));
      dispatch(getTicketSettings());
    const asssigneeRoleType = configurations?.find((c) => c?.name?.trim() === 'SupportTicketAssigneeRoleType')?.value?.trim();
      dispatch(getActiveSecurityUsers({ type: 'SP', roleType: asssigneeRoleType }));
    return () => {
      dispatch(resetTickets());
      dispatch(resetTicketSettings());
      dispatch(resetActiveSecurityUsers());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    page,
    rowsPerPage,
  ]);

  const dataFiltered = useMemo(() => applyFilter({
    comparator: getComparator(order, orderBy),
    inputData: tickets?.data || [],
    filterName,
    prefix,
  }), [tickets, filterName, order, orderBy, prefix]);

  const isFiltered = filterName !== '';
  const isNotFound = (!dataFiltered?.length && !!filterName) || (!isLoading && !dataFiltered?.length);
  const denseHeight = 60;

  const onChangeRowsPerPage = useCallback((e) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(e.target.value, 10)));
  }, [dispatch]);

  const onChangePage = useCallback((e, newPage) => {
    dispatch(ChangePage(newPage));
  }, [dispatch]);

  const onReload = useCallback(({ issueType, requestType, isResolved, statusType, status, priority, assignees, faults }) => {
    dispatch(ChangePage(0));
    dispatch(getTickets({
      page: 0,
      pageSize: rowsPerPage,
      issueType, 
      requestType, 
      isResolved, 
      statusType, 
      status, 
      priority,
      assignees,
      faults
    }));
  }, [dispatch, rowsPerPage ]);

  const handleHelpClick = useCallback(() => setHelpOpen((prev) => !prev), []);

  const debouncedSearch = useRef(debounce((value) => {
    dispatch(ChangePage(0));
    dispatch(setFilterBy(value)); 
  }, 500));

  const handleFilterName = useCallback((e) => {
    debouncedSearch.current(e.target.value);
    setFilterName(e.target.value);
    setPage(0);
  }, [setPage]);

  useEffect(() => {
    const cancelFn = debouncedSearch.current?.cancel;
    return () => cancelFn?.();
  }, []);

  const handleResetFilter = useCallback(() => {
    dispatch(setFilterBy(''));
    setFilterName('');
  }, [dispatch]);

  const handleHiddenColumns = useCallback((arg) => dispatch(setReportHiddenColumns(arg)), [dispatch]);

  const toggleAdd = useCallback(() => navigate(PATH_SUPPORT.supportTickets.new), [navigate]);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Support Tickets" icon="ph:users-light" 
        SubOnClick={toggleAdd} 
        addButton={BUTTONS.ADDTICKET}
        onHelpClick={handleHelpClick}
      />
      </StyledCardContainer>
      <HelpSidebar open={helpOpen} onClose={handleHelpClick} article={article} />
        <TableCard>
          <TicketTableController
            filterName={filterName}
            onFilterName={handleFilterName}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
            onReload={onReload}
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
      const assigneesNames = ticket?.assignees?.map((a) => a?.name).join(', ') || '';

      const fieldsToFilter = [
        `${prefix} - ${ticket?.ticketNo}`.trim(),
        ticket?.machine?.serialNo,
        ticket?.machine?.machineModel?.name,
        ticket?.customer?.name,
        ticket?.summary,
        ticket?.status?.name,
        ticket?.priority?.name,
        ticket?.reporter?.name,
        assigneesNames,
        fDate(ticket?.createdAt),
      ];

      return fieldsToFilter.some((field) =>
        field?.toLowerCase().includes(filterName.toLowerCase())
      );
    });
  }

  return inputData;
}

export default memo(TicketList);