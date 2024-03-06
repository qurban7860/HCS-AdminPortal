import { useState, useEffect , useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// @mui
import {
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
  // Stack,
} from '@mui/material';
import axios from 'axios';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_CUSTOMER } from '../../routes/paths';
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
import ConfirmDialog from '../../components/confirm-dialog';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import { FORMLABELS } from '../../constants/default-constants';

// sections
import CustomerSiteListTableRow from './CustomerSiteListTableRow';
import CustomerSiteListTableToolbar from './CustomerSiteListTableToolbar';
import { getSites, getSite, resetSites, ChangePage, ChangeRowsPerPage, setFilterBy, setIsExpanded, setCardActiveIndex  } from '../../redux/slices/customer/site';
import { setCustomerTab } from '../../redux/slices/customer/customer';
import { Cover } from '../../components/Defaults/Cover';
import TableCard from '../../components/ListTableTools/TableCard';
import { fDate } from '../../utils/formatTime';
import { useSnackbar } from '../../components/snackbar';
import { exportCSV } from '../../utils/exportCSV';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'customer.name', visibility: 'xs', label: 'Customer', align: 'left' },
  { id: 'name', label: 'Site', align: 'left' },
  { id: 'address', visibility: 'xs', label: 'Address', align: 'left' },
  { id: 'phoneNumbers[0]', visibility: 'xs', label: 'Phone', align: 'left' },
  { id: 'email', visibility: 'xs', label: 'Email', align: 'left' },
  { id: 'technical.contact', visibility: 'xs', label: 'Technical Contact', align: 'left' },
  { id: 'billing.contact', visibility: 'xs', label: 'Billing Contact', align: 'left' },
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
  const axiosToken = () => axios.CancelToken.source();
  const cancelTokenSource = axiosToken();
  
  const { sites, filterBy, page, rowsPerPage, isLoading } = useSelector((state) => state.site);
  
  const [tableData, setTableData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [filterName, setFilterName] = useState(filterBy);

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10)));
  };
  const onChangePage = (event, newPage) => { 
    dispatch(ChangePage(newPage)) 
  }

  useEffect(() => {
    dispatch(getSites());
    return ()=> { dispatch( resetSites() ) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleCloseConfirm = () => setOpenConfirm(false);

  const debouncedSearch = useRef(debounce((value) => {
      dispatch(ChangePage(0))
      dispatch(setFilterBy(value))
  }, 500))

  const debouncedVerified = useRef(debounce((value) => {
    dispatch(ChangePage(0))
  }, 500))

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value)
    setFilterName(event.target.value)
    setPage(0);
  };

  useEffect(() => {
    debouncedSearch.current.cancel();
  }, [debouncedSearch]);


  const handleViewRow = (id) => {
    navigate(PATH_CUSTOMER.view(id));
  };

  const openInNewPage = (id) => {
    dispatch(setCustomerTab('info'));
    const url = PATH_CUSTOMER.view(id);
    window.open(url, '_blank');
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  }; 

  const handleBackLink = () => {
    console.log('back')
    navigate(PATH_CUSTOMER.list);
  };

  const [exportingCSV, setExportingCSV] = useState(false);
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

  const handleSiteView = async (customerId, siteId ) => {
    await dispatch(setCustomerTab('sites'));
    await dispatch(setCardActiveIndex(siteId));
    await dispatch(setIsExpanded(true));
    await dispatch(getSite(customerId, siteId));
    await navigate(PATH_CUSTOMER.view(customerId))
  };

  const handleSiteViewInNewPage = async (customerId, siteId ) => {
    await openInNewPage(customerId);
    await dispatch(setCustomerTab('sites'));
    await dispatch(setCardActiveIndex(siteId));
    await dispatch(setIsExpanded(true));
    await dispatch(getSite(customerId, siteId));
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
                        onViewRow={() => handleViewRow(row?.customer?._id)}
                        openInNewPage={() => openInNewPage(row?.customer?._id)}
                        handleSiteView= { handleSiteView }
                        handleSiteViewInNewPage= { handleSiteViewInNewPage }
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
