import { useState, useEffect , useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// @mui
import {
  Table,
  TableBody,
  Container,
  TableContainer,
  // Stack,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_CUSTOMER_REGISTRATION } from '../../../routes/paths';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TablePaginationCustom,
  TableHeadFilter,
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { FORMLABELS } from '../../../constants/default-constants';
// sections
import CustomerRegistrationListTableRow from './CustomerRegistrationListTableRow';
import CustomerListTableToolbar from './CustomerRegistrationListTableToolbar';
import { 
  getCustomerRegistrations, 
  resetCustomerRegistrations, 
  ChangePage, 
  ChangeRowsPerPage, 
  setFilterBy,
  setFilterStatus
} from '../../../redux/slices/customer/customerRegistration';
import { Cover } from '../../../components/Defaults/Cover';
import TableCard from '../../../components/ListTableTools/TableCard';
import { fDate } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'customerName', label: 'Customer Name', align: 'left', },
  { id: 'contactPersonName', label: 'Contact Person Name', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'createdAt', label: 'Created At', align: 'right' },
];

// ----------------------------------------------------------------------

export default function CustomerRegistrationList() {
  const {
    order,
    orderBy,
    setPage,
    selected,
    onSelectRow,
    onSort,
  } = useTable({
    defaultOrderBy: 'createdAt', defaultOrder: 'desc',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customerRegistrations, filterBy, filterStatus, page, rowsPerPage, isLoading } = useSelector((state) => state.customerRegistration);
  const [ filterName, setFilterName ] = useState( filterBy );
  const [ filterByStatus, setFilterByStatus ] = useState( filterStatus );

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10)));
  };
  const onChangePage = (event, newPage) => { 
    dispatch(ChangePage(newPage)) 
  }

  useEffect(() => {
    dispatch(getCustomerRegistrations( page, rowsPerPage ));
    return ()=> { dispatch( resetCustomerRegistrations() ) }
  }, [ dispatch, page, rowsPerPage ]);

  const dataFiltered = applyFilter({
    inputData: customerRegistrations,
    comparator: getComparator(order, orderBy),
    filterName,
    filterByStatus
  });

  const denseHeight = 60;
  const isFiltered = filterName !== '' || filterByStatus !== '';
  const isNotFound = (!dataFiltered?.length && !!filterName) || (!isLoading && !dataFiltered?.length);

  const debouncedSearch = useRef(debounce((value) => {
      dispatch(ChangePage(0))
      dispatch(setFilterBy(value))
  }, 500))

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value)
    setFilterName(event.target.value)
    setPage(0);
  };

  useEffect(() => {
    debouncedSearch.current.cancel();
  }, [debouncedSearch]);

  const debouncedFilterByStatus = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterStatus(value))
  }, 500))

  const handleFilterByStatus = (event) => {
    debouncedFilterByStatus.current(event.target.value)
    setFilterByStatus(event.target.value)
    setPage(0);
  };

useEffect(() => {
  debouncedFilterByStatus.current.cancel();
}, [ debouncedFilterByStatus ]);

  const handleViewRow = (id) => {
    navigate(PATH_CUSTOMER_REGISTRATION.view(id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  }; 

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={ FORMLABELS.COVER.REGISTERED_CUSTOMERS}
        />
      </StyledCardContainer>
      <TableCard>
        <CustomerListTableToolbar
          filterName={ filterName }
          onFilterName={ handleFilterName }
          isFiltered={ isFiltered }
          onResetFilter={ handleResetFilter }
        />

        {!isNotFound && (
          <TablePaginationCustom
            count={ customerRegistrations ? customerRegistrations?.length : 0 }
            page={ page }
            rowsPerPage={ rowsPerPage }
            onPageChange={ onChangePage }
            onRowsPerPageChange={ onChangeRowsPerPage }
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table stickyHeader size="small" sx={{ minWidth: 360 }}>
              <TableHeadFilter
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                onSort={onSort}
              />

              <TableBody>
                {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    row ? (
                      <CustomerRegistrationListTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
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
            count={ customerRegistrations ? customerRegistrations?.length : 0 }
            page={ page }
            rowsPerPage={ rowsPerPage }
            onPageChange={ onChangePage }
            onRowsPerPageChange={ onChangeRowsPerPage }
          />
        )}
        
      </TableCard>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (filterName) {
    filterName = filterName?.trim();
    inputData = inputData?.filter(
      ( c ) =>
        c?.customerName?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        c?.contactPersonName?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        c?.status?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        c?.acceptanceStatus?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        c?.acceptanceStatus?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        `${c?.address?.city}, ${c?.address?.country}`.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        (c?.isActive ? "Active" : "InActive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(c?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if ( filterStatus?.length ) {
    inputData = inputData?.filter((customer) => filterStatus.includes(customer.status));
  }

  return inputData;
}
