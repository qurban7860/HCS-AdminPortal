import React from 'react';
import TableCard from './TableCard'; 
import MachineListTableToolbar from './MachineListTableToolbar'; 
import TablePaginationCustom from './TablePaginationCustom'; 
import TableContainer from '@mui/material/TableContainer';
import TableSelectedAction from './TableSelectedAction'; 
import Scrollbar from './Scrollbar'; 
import Table from '@mui/material/Table';
import TableHeadCustom from './TableHeadCustom'; 
import TableBody from '@mui/material/TableBody';
import MachineListTableRow from './MachineListTableRow'; 
import TableSkeleton from './TableSkeleton'; 
import TableNoData from './TableNoData'; 
import Grid from '@mui/material/Grid';

function CustomTableComponent({
  filterName,
  filterStatus,
  handleFilterName,
  handleFilterStatus,
  STATUS_OPTIONS,
  isFiltered,
  handleResetFilter,
  isNotFound,
  dataFiltered,
  page,
  rowsPerPage,
  onChangePage,
  onChangeRowsPerPage,
  selected,
  onSelectAllRows,
  handleOpenConfirm,
  order,
  orderBy,
  onSort,
  isLoading,
  denseHeight,
  onSelectRow,
  handleViewRow,
}) {
  return (
    <TableCard>
      <MachineListTableToolbar
        filterName={filterName}
        filterStatus={filterStatus}
        onFilterName={handleFilterName}
        onFilterStatus={handleFilterStatus}
        statusOptions={STATUS_OPTIONS}
        isFiltered={isFiltered}
        onResetFilter={handleResetFilter}
      />

      {!isNotFound && (
        <TablePaginationCustom
          count={dataFiltered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      )}
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        {selected.length > 1 ? (
          ''
        ) : (
          <TableSelectedAction
            numSelected={selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) =>
              onSelectAllRows(
                checked,
                dataFiltered.map((row) => row._id)
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
        )}
        <Scrollbar>
          <Table size="small" sx={{ minWidth: 360 }}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD} 
              onSort={onSort}
            />

            <TableBody>
              {(isLoading
                ? [...Array(rowsPerPage)]
                : dataFiltered
              ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) =>
                row ? (
                  <MachineListTableRow
                    key={row._id}
                    row={row}
                    selected={selected.includes(row._id)}
                    onSelectRow={() => onSelectRow(row._id)}
                    onViewRow={() => handleViewRow(row._id)}
                    style={index % 2 ? { background: 'red' } : { background: 'green' }}
                  />
                ) : (
                  !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                )
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      {!isNotFound && (
        <TablePaginationCustom
          count={dataFiltered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      )}
      <Grid item md={12}>
        <TableNoData isNotFound={isNotFound} />
      </Grid>
    </TableCard>
  );
}

export default CustomTableComponent;
