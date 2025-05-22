import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  // Stack,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
// routes
import { PATH_SUPPORT } from '../../../../routes/paths';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableSelectedAction,
  TablePaginationCustom,
  TablePaginationFilter,
  TableHeadFilter,
} from '../../../../components/table';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import ConfirmDialog from '../../../../components/confirm-dialog';
// sections
import ArticleCategoryListTableRow from './ArticleCategoryListTableRow';
import ArticleCategoryListTableToolbar from './ArticleCategoryListTableToolbar';
import {
  getArticleCategories,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  deleteArticleCategory,
} from '../../../../redux/slices/support/supportSettings/articleCategory';
import { Cover } from '../../../../components/Defaults/Cover';
import { fDate } from '../../../../utils/formatTime';
import TableCard from '../../../../components/ListTableTools/TableCard';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import useResponsive from '../../../../hooks/useResponsive';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 150 },
  { id: 'description', label: 'Description', },
  { id: 'isActive', label: 'Active', width: 100 },
  { id: 'updatedAt', label: 'Updated At', width: 150 },
];

// ----------------------------------------------------------------------

ArticleCategoryList.propTypes = {
  isArchived: PropTypes.bool,
};

export default function ArticleCategoryList({isArchived}) {
  const {
    order,
    orderBy,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    // onChangePage,
    // onChangeRowsPerPage,
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
  const { articleCategories, filterBy, page, rowsPerPage, isLoading, initial } = useSelector((state) => state.articleCategory);

  useEffect(() => {
    dispatch(getArticleCategories(isArchived));
  }, [dispatch,isArchived]);

  useEffect(() => {
    if (initial) {
      setTableData(articleCategories || []);
    }
  }, [articleCategories, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
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
    navigate(PATH_SUPPORT.supportSettings.articleCategories.view(id));
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
      navigate(PATH_SUPPORT.supportSettings.articleCategories.root);    
    }else{
      navigate(PATH_SUPPORT.supportSettings.articleCategories.archived);    
    }
  }

  return (
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name={isArchived?'Archived Article Categories':'Article Categories'} supportTicketSettings 
            archivedLink={{
              label:isArchived?'Article Categories':'Archived Categories', 
              link: handleArchive, 
              icon: 'mdi:book-cog'}}
            isArchived={isArchived}
          />
        </StyledCardContainer>

        <TableCard>
          <ArticleCategoryListTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
            isArchived={isArchived}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table stickyHeader size="small" sx={{ minWidth: 360 }}>
                <TableHeadFilter order={order} orderBy={orderBy} headLabel={TABLE_HEAD} onSort={onSort}/>
                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <ArticleCategoryListTableRow
                          key={row._id}
                          row={row}
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
        </TableCard>
      </Container>
    );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName }) {

  const stabilizedThis = Array.isArray(inputData) ? inputData?.map((el, index) => [el, index]) : [];
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (articleCategory) =>
        String(articleCategory?.name)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        String(articleCategory?.description)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // (articleCategoryCategory?.isActive ? "Active" : "InActive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        String(fDate(articleCategory?.updatedAt))?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  return inputData;
}
