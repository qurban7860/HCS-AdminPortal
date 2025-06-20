import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
// @mui
import { Container, Table, TableBody, TableContainer } from '@mui/material';
// routes
import { useNavigate } from 'react-router-dom';
import { PATH_SUPPORT } from '../../../../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../../../../redux/store';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../../../components/table';
import Scrollbar from '../../../../../components/scrollbar';
// sections
import ChangeTypeListTableRow from './ChangeTypeListTableRow';
import ChangeTypeListTableToolbar from './ChangeTypeListTableToolbar';
import {
  getTicketChangeTypes,
  resetTicketChangeTypes,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
} from '../../../../../redux/slices/ticket/ticketSettings/ticketChangeTypes';
import { fDate } from '../../../../../utils/formatTime';
import TableCard from '../../../../../components/ListTableTools/TableCard';
import { Cover } from '../../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'isActive', label: ' ', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'slug', visibility: 'xs1', label: 'Slug', align: 'left' },
  { id: 'displayOrderNo', visibility: 'xs1', label: 'Order Number', align: 'left' },
  { id: 'icon', label: 'Icon ', align: 'left' },
  { id: 'updatedAt', label: 'Updated At', align: 'right' },
];

// ----------------------------------------------------------------------

export default function ChangeTypeList() {
  const { ticketChangeTypes, filterBy, page, rowsPerPage, isLoading, initial } = useSelector((state) => state.ticketChangeTypes);
  const navigate = useNavigate();
  const {
    order,
    orderBy,
    setPage,
    selected,
    onSort,
  } = useTable({ defaultOrderBy: 'displayOrderNo' , defaultOrder: 'asc' });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }
  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);

  useLayoutEffect(() => {
    dispatch(getTicketChangeTypes(page, rowsPerPage));
    return () => {
      dispatch(resetTicketChangeTypes());
    }
  }, [dispatch, page, rowsPerPage]);
  
  useEffect(() => {
    if (initial) {
      setTableData(ticketChangeTypes?.data || [] );
    }
  }, [ticketChangeTypes?.data, initial]);

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
  
  useEffect(() => {
    debouncedSearch.current.cancel();
  }, [debouncedSearch]);
  
  useEffect(()=>{
    setFilterName(filterBy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleViewRow = (id) => navigate(PATH_SUPPORT.settings.changeTypes.view(id));
  
  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };
  
  return (
    <Container maxWidth={false} >
      <StyledCardContainer>
       <Cover name="Change Types" supportTicketSettings/>
      </StyledCardContainer>
        <TableCard>
          <ChangeTypeListTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />

          {!isNotFound && <TablePaginationCustom
            count={ ticketChangeTypes?.totalCount || 0 }
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
                        <ChangeTypeListTableRow
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
            count={ ticketChangeTypes?.totalCount || 0 }
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

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (changeType) =>
        changeType?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        changeType?.slug?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        changeType?.displayOrderNo?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(changeType?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }
  return inputData;
}
