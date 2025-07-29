import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { PATH_SETTING } from '../../../routes/paths';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TablePaginationFilter,
  TableHeadFilter,
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
// sections
import ProjectListTableRow from './ProjectListTableRow';
import ProjectListTableToolbar from './ProjectListTableToolbar';
import {
  getProjects,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  resetProjects,
} from '../../../redux/slices/support/project/project';
import { Cover } from '../../../components/Defaults/Cover';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
import { StyledCardContainer } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'projectNo', label: 'Project Key', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'isActive', label: 'Active', width: 100 },
  { id: 'updatedAt', align: 'right', label: 'Updated At', width: 150 },
];

// ----------------------------------------------------------------------

ProjectList.propTypes = {
  isArchived: PropTypes.bool,
};

export default function ProjectList({isArchived}) {
  const {
    order,
    orderBy,
    setPage,
    selected,
    onSort,
  } = useTable({
    defaultOrderBy: 'name',
  });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const { projects, filterBy, page, rowsPerPage, isLoading, initial } = useSelector((state) => state.project);

  const prefix = JSON.parse(localStorage.getItem('configurations'))?.find((config) => config?.name?.toLowerCase() === 'project_prefix')?.value?.trim() || ''; 

  useLayoutEffect(() => {
      dispatch(getProjects(isArchived, page, rowsPerPage));
      return () => {
        dispatch(resetProjects());
      }
    }, [dispatch, isArchived, page, rowsPerPage]);

  useEffect(() => {
    if (initial) {
      setTableData(projects?.data || []);
    }
  }, [projects?.data, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    prefix,
  });

  const denseHeight = 60;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleViewRow = (id) => {
    navigate(PATH_SETTING.projects.view(id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  const handleArchive = () => {
    setFilterName('');
    setPage(0);
    dispatch(setFilterBy(''));
    if(isArchived){
      navigate(PATH_SETTING.projects.root);    
    }else{
      navigate(PATH_SETTING.projects.archived);    
    }
  }

  return (
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name={isArchived?'Archived Projects':'Projects'} 
            archivedLink={{
              label:isArchived?'Projects':'Archived Projects', 
              link: handleArchive, 
              icon: 'solar:list-bold-duotone'}}
            isArchived={isArchived}
          />
        </StyledCardContainer>

        <TableCard>
          <ProjectListTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
            isArchived={isArchived}
          />

          {!isNotFound && <TablePaginationFilter
            count={ projects?.totalCount || 0 }
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table stickyHeader size="small" sx={{ minWidth: 360 }}>
                <TableHeadFilter order={order} orderBy={orderBy} headLabel={TABLE_HEAD} onSort={onSort}/>
                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <ProjectListTableRow
                          key={row._id}
                          row={row}
                          onViewRow={() => handleViewRow(row._id)}
                          selected={selected.includes(row._id)}
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
          {!isNotFound && <TablePaginationFilter
            count={ projects?.totalCount || 0 }
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

function applyFilter({ inputData, comparator, filterName, prefix }) {

  const stabilizedThis = Array.isArray(inputData) ? inputData?.map((el, index) => [el, index]) : [];
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (Project) =>
        `${prefix}-${Project?.projectNo}`?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        String(Project?.name)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // (ProjectCategory?.isActive ? "Active" : "InActive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        String(fDate(Project?.updatedAt))?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  return inputData;
}
