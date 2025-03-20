import { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
// @mui
import { Table, TableBody, TableContainer, Container } from '@mui/material';
import { Cover } from '../../../../components/Defaults/Cover';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TablePaginationCustom,
} from '../../../../components/table';
import Scrollbar from '../../../../components/scrollbar';
// sections
import ReleasesListTableRow from './ReleasesListTableRow';
import ReleasesListTableToolbar from './ReleasesListTableToolbar';
import { getReleases, setFilterBy } from '../../../../redux/slices/reports/releases';
import { fDate } from '../../../../utils/formatTime';
import TableCard from '../../../../components/ListTableTools/TableCard';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';

export default function ReleasesList() {
  const {
    order,
    orderBy,
    page, 
    rowsPerPage,
    setPage,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'releaseDate', defaultOrder: 'desc',
  });

  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);

  const { releases, filterBy,  isLoading, initial } = useSelector((state) => state.releases );

  useEffect(() => {
      dispatch(getReleases());
  }, [dispatch]);

  useEffect(() => {
    if (initial) {
      setTableData(releases?.values || [] ); 
    }
  }, [ dispatch, initial, releases ]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });  
  const denseHeight = 60;
  const isFiltered = filterName !== '';
  const isNotFound = (!isLoading && !dataFiltered.length);

  const debouncedSearch = useRef(debounce((value) => {
    setPage(0)
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
  },[ filterBy ])

  const handleFilterStatus = (event) => {
    setPage(0);
  };

  const handleViewRow = (id) => {
    const url = `https://howickltd.atlassian.net/projects/HPS/versions/${id}/tab/release-report-all-issues`
    window.open(url, '_blank');
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name="Releases" icon="ph:users-light" />
        </StyledCardContainer>
        <TableCard>
          <ReleasesListTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />
            <TablePaginationCustom
              count={dataFiltered?.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size="small" sx={{ minWidth: 360 }}>
                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <ReleasesListTableRow
                          key={row.id}
                          index={index}
                          page={page}
                          row={row}
                          onViewRow={() => handleViewRow(row?.id)}
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

          <TablePaginationCustom
            count={dataFiltered?.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
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
    return inputData.filter(
      (release) => 
        release.name.indexOf(filterName.toLowerCase()) >= 0 ||
        release?.description?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(release.releaseDate)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }
  return inputData;
}
