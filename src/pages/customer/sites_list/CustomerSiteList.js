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
import { PATH_CUSTOMER } from '../../../routes/paths';
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
import { StyledCardContainer } from '../../../theme/styles/default-styles';
// sections
import CustomerSiteListTableRow from './CustomerSiteListTableRow';
import CustomerSiteListTableToolbar from './CustomerSiteListTableToolbar';
import { getSites, resetSites, ChangePage, ChangeRowsPerPage, setFilterBy, setIsExpanded, setCardActiveIndex  } from '../../../redux/slices/customer/site';
import { Cover } from '../../../components/Defaults/Cover';
import TableCard from '../../../components/ListTableTools/TableCard';
import { fDate } from '../../../utils/formatTime';
import { useSnackbar } from '../../../components/snackbar';
import { exportCSV } from '../../../utils/exportCSV';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'customer.name', visibility: 'xs', label: 'Customer', align: 'left' },
  { id: 'name', label: 'Site', align: 'left' },
  { id: 'address.country', visibility: 'xs', label: 'Address', align: 'left' },
  { id: 'phoneNumbers.countryCode', visibility: 'xs', label: 'Phone', align: 'left' },
  { id: 'email', visibility: 'xs', label: 'Email', align: 'left' },
  { id: 'primaryTechnicalContact.firstName', visibility: 'xs', label: 'Technical Contact', align: 'left' },
  { id: 'primaryBillingContact.firstName', visibility: 'xs', label: 'Billing Contact', align: 'left' },
  { id: 'isActive', visibility: 'xs', label: 'Active', align: 'center' },
  { id: 'createdAt',visibility: 'xs', label: 'Created At', align: 'right' },
];

// ----------------------------------------------------------------------

export default function CustomerSiteList() {
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
  
  const { sites, filterBy, page, rowsPerPage, isLoading } = useSelector((state) => state.site);

  const [exportingCSV, setExportingCSV] = useState(false);
  const [ tableData, setTableData ] = useState([]);
  const [ filterName, setFilterName ] = useState(filterBy);

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10)));
  };

  const onChangePage = (event, newPage) => {  dispatch(ChangePage(newPage))  }

  useEffect(() => {
    dispatch(getSites());
    return ()=> { dispatch( resetSites() ) }
  }, [dispatch]);

  useEffect(() => {
    setTableData(sites || []);
  }, [sites]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
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

  const handleViewCustomer = (id) => navigate(PATH_CUSTOMER.view(id));
  const handleViewCustomerInNewPage = (id) => window.open(PATH_CUSTOMER.view(id), '_blank');

  const handleViewSite = async (customerId, siteId ) => {
    await dispatch(setCardActiveIndex(siteId));
    await dispatch(setIsExpanded(true));
    await navigate(PATH_CUSTOMER.sites.view(customerId, siteId))
  };

  const handleViewSiteInNewPage = async (customerId, siteId ) => {
    await dispatch(setCardActiveIndex(siteId));
    await dispatch(setIsExpanded(true));
    window.open(PATH_CUSTOMER.sites.view(customerId, siteId), '_blank');
  };

  const onExportCSV = async() => {
    setExportingCSV(true);
    const response = dispatch(await exportCSV('allsites'));
    response.then((res) => {
      setExportingCSV(false);
      if(!res.hasError){
        enqueueSnackbar('Sites CSV Generated Successfully');
      }else{
        enqueueSnackbar(res.message, {variant:`${res.hasError?"error":""}`});
      }
    });
  };

  return (
    <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name='Customer Sites' backLink customerContacts/>
        </StyledCardContainer>
      <TableCard >
      <CustomerSiteListTableToolbar
          filterName={filterName}
          onFilterName={handleFilterName}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
          onExportCSV={onExportCSV}
          onExportLoading={exportingCSV}
        />

        {!isNotFound && <TablePaginationCustom
          count={sites?sites.length : 0}
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
                      <CustomerSiteListTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onViewRow={() => handleViewCustomer(row?.customer?._id)}
                        openInNewPage={() => handleViewCustomerInNewPage(row?.customer?._id)}
                        handleSiteView= { handleViewSite }
                        handleSiteViewInNewPage= { handleViewSiteInNewPage }
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
          count={sites?sites.length : 0}
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

function applyFilter({ inputData, comparator, filterName }) {

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (site) =>
        site?.customer?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        site?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        site?.email?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        site?.website?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        `${site?.primaryTechnicalContact?.firstName} ${site?.primaryTechnicalContact?.lastName}`.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        `${site?.primaryBillingContact?.firstName} ${site?.primaryBillingContact?.lastName}`.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        `${site?.address?.street }, ${site?.address?.suburb }, ${site?.address?.city }, ${site?.address?.country}`.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        `+${site?.phoneNumbers[0]?.countryCode} ${site?.phoneNumbers[0]?.contactNumber}`.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(site?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  return inputData;
}
