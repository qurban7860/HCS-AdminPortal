import PropTypes from 'prop-types'; 
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
import { useDispatch, useSelector } from '../../../../redux/store';
// routes
import { PATH_CRM } from '../../../../routes/paths';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../../components/table';
import Scrollbar from '../../../../components/scrollbar';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
// sections
import CustomerContactListTableRow from './CustomerContactListTableRow';
import CustomerContactListTableToolbar from './CustomerContactListTableToolbar';
import { getContacts, resetContacts, ChangePage, ChangeRowsPerPage, setFilterBy, setCardActiveIndex, setIsExpanded } from '../../../../redux/slices/customer/contact';
import { Cover } from '../../../../components/Defaults/Cover';
import TableCard from '../../../../components/ListTableTools/TableCard';
import { fDate } from '../../../../utils/formatTime';
import { useSnackbar } from '../../../../components/snackbar';
import { exportCSV } from '../../../../utils/exportCSV';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'customer.name', visibility: 'xs', label: 'Customer', align: 'left' },
  { id: 'firstName', label: 'Contact', align: 'left' },
  { id: 'phone', visibility: 'xs', label: 'Phone', align: 'left' },
  { id: 'email', visibility: 'xs', label: 'Email', align: 'left' },
  { id: 'address.country', visibility: 'xs', label: 'Country', align: 'left' },
  { id: 'isActive', visibility: 'xs', label: 'Active', align: 'center' },
  { id: 'createdAt',visibility: 'xs', label: 'Created At', align: 'right' },
];

// ----------------------------------------------------------------------

CustomerContactList.propTypes = {
  isCustomerContactPage: PropTypes.bool,
  filterFormer: PropTypes.string,
};

export default function CustomerContactList({isCustomerContactPage = false, filterFormer}) {
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
  const { enqueueSnackbar } = useSnackbar();
  const { contacts, filterBy, page, rowsPerPage, isLoading } = useSelector((state) => state.contact);
  const [filterName, setFilterName] = useState(filterBy);
  const [exportingCSV, setExportingCSV] = useState(false);

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10)));
  };

  const onChangePage = (event, newPage) => { 
    dispatch(ChangePage(newPage)) 
  }

  useEffect(() => {
    if (!isCustomerContactPage) { 
      dispatch(getContacts());
      return () => {
        dispatch(resetContacts());
      };
    }
    return undefined; 
  }, [dispatch, isCustomerContactPage]);  

  const dataFiltered = applyFilter({
    inputData: contacts || [],
    comparator: getComparator(order, orderBy),
    filterName,
    filterFormer,
  });

  const denseHeight = 60;
  const isFiltered = filterName !== '';
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

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

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  }; 

  const handleViewCustomer = (customerId) => navigate(PATH_CRM.customers.view(customerId));
  const handleViewCustomerInNewPage = (customerId) => window.open(PATH_CRM.customers.view(customerId), '_blank');

  const handleViewContact = async (customerId, contactId ) => {
    await dispatch(setCardActiveIndex(contactId));
    await dispatch(setIsExpanded(true));
    await navigate(PATH_CRM.customers.contacts.view(customerId, contactId))
  };
  
  const handleViewContactInNewPage = async (customerId, contactId ) => {
    await dispatch(setCardActiveIndex(contactId));
    await dispatch(setIsExpanded(true));
    window.open(PATH_CRM.customers.contacts.view(customerId, contactId), '_blank');
  };

  const onExportCSV = async() => {
    setExportingCSV(true);
    const response = dispatch(await exportCSV('allcontacts'));
    response.then((res) => {
      setExportingCSV(false);
      if(!res.hasError){
        enqueueSnackbar('Contacts CSV Generated Successfully');
      }else{
        enqueueSnackbar(res.message, {variant:`${res.hasError?"error":""}`});
      }
    });
  };

  return (
    <Container maxWidth={false}>
      {!isCustomerContactPage ? (
        <StyledCardContainer>
          <Cover name='Customer Contacts' backLink customerSites/>        
        </StyledCardContainer>
      ) : null} 
      <TableCard >
        <CustomerContactListTableToolbar
          filterName={filterName}
          onFilterName={handleFilterName}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
          onExportCSV={!isCustomerContactPage ? onExportCSV : undefined}
          onExportLoading={exportingCSV}
        />

        {!isNotFound && <TablePaginationCustom
          count={contacts?contacts.length : 0}
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
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    row ? (
                      <CustomerContactListTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onViewRow={() => handleViewCustomer(row?.customer?._id)}
                        openInNewPage={() => handleViewCustomerInNewPage(row?.customer?._id)}
                        handleContactView= { handleViewContact }
                        handleContactViewInNewPage= { handleViewContactInNewPage }
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
          count={contacts?contacts.length : 0}
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

function applyFilter({ inputData, comparator, filterName, filterFormer }) {
  let filteredData = inputData;

  if (filterFormer?.toLowerCase() === 'former employee') {
    filteredData = filteredData.filter((contact) => contact?.formerEmployee);
  } else if (filterFormer?.toLowerCase() === 'current employee') {
    filteredData = filteredData.filter((contact) => !contact?.formerEmployee);
  }

  const stabilizedThis = filteredData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  
  filteredData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    filteredData = filteredData.filter(
      (contact) =>
        contact?.customer?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        `${contact?.firstName} ${contact?.lastName}`.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
         // contact?.title?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        contact?.phone?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        contact?.email?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        contact?.address?.country?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(contact?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  return filteredData;
}
