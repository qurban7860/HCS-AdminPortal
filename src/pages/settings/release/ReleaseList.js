import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
// @mui
import { Container, Table, TableBody, TableContainer } from '@mui/material';
// routes
import { useNavigate } from 'react-router-dom';
import { PATH_SETTING } from '../../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
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
// sections
import ReleaseListTableRow from './ReleaseListTableRow';
import ReleaseListCard from './ReleaseListCard';
import ReleaseListTableToolbar from './ReleaseListTableToolbar';
import {
  getReleases,
  resetReleases,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
} from '../../../redux/slices/support/release/release';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'releaseNo', label: 'Serial No', align: 'left',width: "160px"  },
  { id: 'name', label: 'Version', align: 'left'},
  { id: 'project.name', label: 'Project', align: 'left'},
  { id: 'status', label: 'Status', align: 'left', width: "140px" },
  { id: 'releaseDate', label: 'Release Date', align: 'left', width: "140px" },
  { id: 'createdAt', label: 'Created At', align: 'right', width: "160px" },
];

// ----------------------------------------------------------------------

ReleaseList.propTypes = {
  isArchived: PropTypes.bool,
};

export default function ReleaseList({isArchived}) {
  const { releases, filterBy, page, rowsPerPage, isLoading, initial } = useSelector((state) => state.release);
  const navigate = useNavigate();
  const {
    order,
    orderBy,
    setPage,
    selected,
    onSort,
  } = useTable({ defaultOrderBy: 'createdAt' , defaultOrder: 'desc' });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }
  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [projectVal, setProjectVal] = useState(null);
  const [statusVal, setStatusVal] = useState(null);
  const [isListView, setIsListView] = useState(true);

  useLayoutEffect(() => {
    dispatch(getReleases(isArchived, page, rowsPerPage));
    return () => {
      dispatch(resetReleases());
    }
  }, [dispatch, isArchived, page, rowsPerPage]);
  
  useEffect(() => {
    if (initial) {
      setTableData(releases?.data || [] );
    }
  }, [releases?.data, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    projectVal,
    statusVal,
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

  const handleViewRow = (id) => navigate(PATH_SETTING.projectReleases.view(id));
  
  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
    setStatusVal(null);
  };
  
  const handleProjectChange = (e) => {
    setProjectVal(e);
    setPage(0);
  };

  const handleStatusChange = (e) => {
    setStatusVal(e);
    setPage(0);
  };

  return (
    <Container maxWidth={false} >
      <StyledCardContainer>
       <Cover name="Releases" />
      </StyledCardContainer>
        <TableCard>
          <ReleaseListTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
            projectVal={projectVal}
            setProjectVal={handleProjectChange}
            statusVal={statusVal}
            setStatusVal={handleStatusChange}
            isListView={isListView}
            setIsListView={setIsListView}
          />

          {!isNotFound && <TablePaginationCustom
            count={ releases?.totalCount || 0 }
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size="small" sx={{ minWidth: 360 }}>
                {isListView && (
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                /> )}
                {isListView ? (
                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .map((row, index) =>
                      row ? (
                        <ReleaseListTableRow
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
                ) : (
                  <TableBody>
                    {(isLoading ? [...Array(rowsPerPage)] : dataFiltered).map((row, index) =>
                    row ? (
                    <ReleaseListCard
                      key={row._id}
                      row={row}
                      onViewRow={() => handleViewRow(row._id)}
                      selected={selected.includes(row._id)}
                    />
                    ) : (
                      !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ) )}
                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                )}
              </Table>
            </Scrollbar>
          </TableContainer>
          {!isNotFound && <TablePaginationCustom
            count={ releases?.totalCount || 0 }
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

function applyFilter({ inputData, comparator, filterName, projectVal, statusVal }) {

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (release) =>
        release?.releaseNo?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        release?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        release?.project?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        release?.description?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(release?.releaseDate)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(release?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }
  
  if (projectVal) {
    inputData = inputData.filter((release) => release?.project?._id === projectVal?._id);
  }
  
  if(statusVal){
    inputData = inputData.filter((release) => release?.status === statusVal?.value);
  }

  return inputData;
}
