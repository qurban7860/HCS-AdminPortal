import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
// @mui
import {
  Table,
  TableBody,
  Container,
  TableContainer,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from 'react-redux';
// routes
import {
  getServiceReportStatuses,
  resetServiceReportStatuses,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
} from '../../../redux/slices/products/serviceReportStatuses';
import { PATH_MACHINE } from '../../../routes/paths';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationFilter,
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
import ServiceReportStatusListTableRow from './ServiceReportStatusListTableRow';
import ServiceReportStatusListTableToolbar from './ServiceReportStatusListTableToolbar';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { fDateTime } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'type', visibility: 'xs1', label: 'Type', align: 'left' },
  { id: 'displayOrderNo', visibility: 'xs1', label: 'Display Order No.', align: 'left' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'updatedAt', label: 'Updated At', align: 'right' },
];


// ----------------------------------------------------------------------

export default function ServiceReportStatusList() {
  const {
    // page,
    order,
    orderBy,
    // rowsPerPage,
    setPage,
    //
    selected,
    onSelectRow,
    //
    onSort,
    // onChangePage,
    // onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'displayOrderNo' , defaultOrder: 'asc' });


  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [filterName, setFilterName] = useState('');

  const [tableData, setTableData] = useState([]);

  const { serviceReportStatuses, filterBy, page, rowsPerPage, isLoading  } = useSelector( (state) => state.serviceReportStatuses );

    
  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  useLayoutEffect(() => {
    dispatch(getServiceReportStatuses());
    return () => {
      dispatch(resetServiceReportStatuses())
    }
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(serviceReportStatuses)) {
      setTableData(serviceReportStatuses);
    }
  }, [ serviceReportStatuses ]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const isFiltered = filterName !== '';

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

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
  },[ filterBy ])

  const handleViewRow = (id) => navigate(PATH_MACHINE.machineSettings.serviceReportsStatus.view(id));

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name="Report Statuses" icon="material-symbols:list-alt-outline" setting />
        </StyledCardContainer>
        <TableCard>
          <ServiceReportStatusListTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />
          {!isNotFound && <TablePaginationFilter
            count={dataFiltered.length}
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
                        <ServiceReportStatusListTableRow
                          key={row._id}
                          row={row}
                          selected={selected.includes(row._id)}
                          onSelectRow={() => onSelectRow(row._id)}
                          onViewRow={() => handleViewRow(row._id)}
                        />
                      ) : (
                        !isNotFound && <TableSkeleton key={index} />
                      )
                    )}
                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          {!isNotFound && <TablePaginationFilter
            count={dataFiltered.length}
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
  const stabilizedThis = inputData ? inputData?.map((el, index) => [el, index]) : [];

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      ( status ) =>
          status?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
          status?.type?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
          status?.description?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
          status?.displayOrderNo?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        ( status?.isActive ? "Active" : "InActive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDateTime( status?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  return inputData;
}
