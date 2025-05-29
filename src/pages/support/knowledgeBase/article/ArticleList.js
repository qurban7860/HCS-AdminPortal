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
  Box,
  Stack,
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
import ArticleListCard from './ArticleListCard';
import ArticleListTableToolbar from './ArticleListTableToolbar';
import {
  getArticles,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  deleteArticle,
} from '../../../../redux/slices/support/knowledgeBase/article';
import { getActiveArticleCategories } from '../../../../redux/slices/support/supportSettings/articleCategory';
import { Cover } from '../../../../components/Defaults/Cover';
import { fDate } from '../../../../utils/formatTime';
import TableCard from '../../../../components/ListTableTools/TableCard';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import useResponsive from '../../../../hooks/useResponsive';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'articles', label: 'Articles'},
  // { id: 'title', label: 'Title', },
  // { id: 'category', label: 'Category', },
  // { id: 'status', label: 'Status', },
  // { id: 'customerAccess', label: 'Customer Access', width: 150 },
  // { id: 'isActive', label: 'Active', width: 150 },
  // { id: 'updatedAt', label: 'Updated At', width: 150, align:'right' },
];

// ----------------------------------------------------------------------

ArticleList.propTypes = {
  isArchived: PropTypes.bool,
};

export default function ArticleList({isArchived}) {
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
    defaultOrderBy: 'updatedAt',
    defaultOrder: 'desc',
  });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const [categoryVal, setCategoryVal] = useState(null);
  const [statusVal, setStatusVal] = useState(null);

  const [tableData, setTableData] = useState([]);
  const { articles, filterBy, page, rowsPerPage, isLoading, initial } = useSelector((state) => state.article);
  
  const prefix = JSON.parse(localStorage.getItem('configurations'))?.find((config) => config?.name?.toLowerCase() === 'article_prefix')?.value?.trim() || ''; 

  useEffect(() => {
    dispatch(getArticles(isArchived));
    dispatch(getActiveArticleCategories());
  }, [dispatch,isArchived]);

  useEffect(() => {
    if (initial) {
      setTableData(articles || []);
    }
  }, [articles, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    categoryVal,
    statusVal,
    prefix
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
    navigate(PATH_SUPPORT.knowledgeBase.article.view(id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
    setCategoryVal(null);
    setStatusVal(null);
  };

  const handleCategoryChange = (v) => {
    setCategoryVal(v);
    setPage(0);
  };

  const handleStatusChange = (v) => {
    setStatusVal(v);
    setPage(0);
  };

  const handleArchive = () => {
    setFilterName('');
    setPage(0);
    dispatch(setFilterBy(''));
    setCategoryVal(null);
    setStatusVal(null);
    if(isArchived){
      navigate(PATH_SUPPORT.knowledgeBase.article.root);    
    }else{
      navigate(PATH_SUPPORT.knowledgeBase.article.archived);    
    }
  }

  return (
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name={isArchived?'Archived Articles':'Articles'} supportTicketSettings 
            archivedLink={{
              label:isArchived?'Articles':'Archived Articles', 
              link: handleArchive, 
              icon: isArchived?'mdi:book-open-variant':'mdi:book-variant'}}
            isArchived={isArchived}
          />
        </StyledCardContainer>

        <TableCard>
          <ArticleListTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
            isArchived={isArchived}
            categoryVal={categoryVal}
            setCategoryVal={handleCategoryChange}
            statusVal={statusVal}
            setStatusVal={handleStatusChange}
          />

          {!isNotFound && (
            <TablePaginationCustom
              count={articles?.length || 0}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          )}

          <Scrollbar sx={{borderTop:'1px solid #E0E0E0'}}>
            <Stack spacing={2} sx={{ p:2 }}>
              {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) =>
                  row ? (
                    <ArticleListCard
                      key={row._id}
                      row={row}
                      onViewRow={() => handleViewRow(row._id)}
                      prefix={prefix}
                    />
                  ) : (
                    !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )}
              </Stack>
          </Scrollbar>
          {!isNotFound && <TablePaginationCustom
            count={ articles?.length || 0 }
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

function applyFilter({ inputData, comparator, filterName, categoryVal, statusVal, prefix }) {

  const stabilizedThis = Array.isArray(inputData) ? inputData?.map((el, index) => [el, index]) : [];
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (article) =>
        `${prefix}-${article?.serialNumber}`?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        String(article?.title)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        String(article?.description)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        String(article?.category?.name)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // (article?.isActive ? "Active" : "InActive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        String(fDate(article?.updatedAt))?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if(categoryVal){
    inputData = inputData.filter((article) => article?.category?._id === categoryVal?._id);
  }

  if(statusVal){
    inputData = inputData.filter((article) => article?.status === statusVal?.value);
  }

  return inputData;
}
