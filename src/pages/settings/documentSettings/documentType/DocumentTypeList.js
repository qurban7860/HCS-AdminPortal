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
import { PATH_MACHINE, PATH_SETTING } from '../../../../routes/paths';
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
import DocumentTypeListTableRow from './DocumentTypeListTableRow';
import DocumentTypeListTableToolbar from './DocumentTypeListTableToolbar';
import {
  deleteDocumentType,
  getDocumentTypes,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  setReportHiddenColumns,
} from '../../../../redux/slices/document/documentType';
import { getActiveDocumentCategories } from '../../../../redux/slices/document/documentCategory';
import { Cover } from '../../../../components/Defaults/Cover';
import { fDate } from '../../../../utils/formatTime';
import TableCard from '../../../../components/ListTableTools/TableCard';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import useResponsive from '../../../../hooks/useResponsive';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Type Name', align: 'left' },
  { id: 'docCategory.name', visibility: 'xs1' , label: 'Category', align: 'left' },
  { id: 'customerAccess', visibility: 'xs2' , label: 'Customer Access', align: 'center' },
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'updatedAt', label: 'Updated At', align: 'right' },
];

// ----------------------------------------------------------------------

DocumentTypeList.propTypes = {
  isArchived: PropTypes.object,
};

export default function DocumentTypeList({ isArchived = false }) {
  const {
    // page,
    order,
    orderBy,
    // rowsPerPage,
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
  const [filterCategory, setFilterCategory] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const isMobile = useResponsive('down', 'sm');
  const { documentTypes, filterBy, page, rowsPerPage, isLoading, initial, reportHiddenColumns } = useSelector(
    (state) => state.documentType
  );

  useEffect(() => {
    dispatch(getDocumentTypes(isArchived));
    dispatch(getActiveDocumentCategories());
  }, [dispatch, isArchived]);

  useEffect(() => {
    if (initial) {
      setTableData(documentTypes || []);
    }
  }, [documentTypes, initial, isArchived]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterCategory,
  });
  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const denseHeight = 60;
  const isFiltered = filterName !== '';
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

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

  const handleFilterCategory = (value) => {
    setPage(0);
    setFilterCategory(value);
  };

  const handleDeleteRow = async (id) => {
    try {
      await dispatch(deleteDocumentType(id));
      dispatch(getDocumentTypes(isArchived));
      setSelected([]);

      if (page > 0) {
        if (dataInPage.length < 2) {
          setPage(page - 1);
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row._id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleViewRow = (id) => {
    if(isArchived){
      navigate(PATH_MACHINE.documents.documentType.archivedView(id));
    }else{
      navigate(PATH_MACHINE.documents.documentType.view(id));
    }
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
    setFilterCategory(null);
  };

  const handleHiddenColumns = async (arg) => {
    dispatch(setReportHiddenColumns(arg));
  };

  const handleArchive = () => {
    setFilterName('');
    setFilterCategory(null);
    setPage(0);
    dispatch(setFilterBy(''));
    if(isArchived){
      navigate(PATH_MACHINE.documents.documentType.list);    
    }else{
      navigate(PATH_MACHINE.documents.documentType.archived);    
    }
  }

  return (
    <>
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name={isArchived ? "Archived Document Types" : "Document Types"} 
                archivedLink={{
                  label:isArchived?'Document Types':'Archived Types', 
                  link: handleArchive, 
                  icon: 'mdi:file-tree'}}
                isArchived={isArchived}
          />
        </StyledCardContainer>

        <TableCard>
          <DocumentTypeListTableToolbar
            filterName={filterName}
            filterCategory={filterCategory}
            onFilterName={handleFilterName}
            onFilterCategory={handleFilterCategory}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
            isArchived={isArchived}
          />

          {!isNotFound && !isMobile && (
            <TablePaginationFilter
              columns={TABLE_HEAD}
              hiddenColumns={reportHiddenColumns}
              handleHiddenColumns={handleHiddenColumns}
              count={dataFiltered.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          )}

          {!isNotFound && isMobile && (
            <TablePaginationCustom
              count={dataFiltered.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row._id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table stickyHeader size="small" sx={{ minWidth: 360 }}>
                <TableHeadFilter
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  hiddenColumns={reportHiddenColumns}
                  onSort={onSort}
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <DocumentTypeListTableRow
                          key={row._id}
                          row={row}
                          hiddenColumns={reportHiddenColumns}
                          selected={selected.includes(row._id)}
                          onSelectRow={() => onSelectRow(row._id)}
                          onDeleteRow={() => handleDeleteRow(row._id)}
                          onViewRow={() => handleViewRow(row._id)}
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
        </TableCard>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to Archive <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterCategory }) {

  const stabilizedThis = Array.isArray(inputData) ? inputData?.map((el, index) => [el, index]) : [];
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (docType) =>
        docType?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        docType?.docCategory?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // (docType?.isActive ? "Active" : "InActive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(docType?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterCategory) {
    inputData = inputData.filter((docType) => filterCategory?._id === docType?.docCategory?._id);
  }

  return inputData;
}
