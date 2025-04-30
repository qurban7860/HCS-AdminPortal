/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Grid, TextField, InputAdornment, Button, Stack,
  FormControl, Select, InputLabel, MenuItem, IconButton, Switch, FormControlLabel, Autocomplete, Box
} from '@mui/material';
import { BUTTONS } from '../../constants/default-constants';
import Iconify from '../iconify';
import useResponsive from '../../hooks/useResponsive';
import { StyledTooltip } from '../../theme/styles/default-styles';
import { getActiveDocumentTypesWithCategory } from '../../redux/slices/document/documentType';
import { setPm2Environment, setPm2LogType, setPm2LinesPerPage } from '../../redux/slices/logs/pm2Logs';
import { fDate } from '../../utils/formatTime';
import { setDateFrom, setDateTo, setSelectedLogType } from '../../redux/slices/products/machineErpLogs';
import { useAuthContext } from '../../auth/useAuthContext';
import { useDebouncedEffect } from '../../hooks/useDebouncedEffect';

function SearchBarCombo({
  node,
  reduceFilterSize,
  increaseFilterSize,
  nodes,
  isFiltered,
  value,
  onFilterVerify,
  filterVerify,
  onMachineVerify,
  machineVerify,
  setAccountManagerFilter,
  accountManagerFilter,
  setSupportManagerFilter,
  supportManagerFilter,
  employeeFilterListBy,
  onEmployeeFilterListBy,
  onFilterListByRegion,
  filterByRegion,
  filterListBy,
  onFilterListBy,
  categoryVal,
  setCategoryVal,
  typeVal,
  setTypeVal,
  drawing,
  machineDrawings,
  signInLogsFilter,
  onSignInLogsFilter,
  apiLogsStatusFilter,
  onApiLogsStatusFilter,
  apiLogsMethodFilter,
  onApiLogsMethodFilter,
  apiLogsTypeFilter,
  onApiLogsTypeFilter,
  onChange,
  onClick,
  SubOnClick,
  SubOnClick2,
  openGraph,
  addButton,
  inviteOnClick,
  inviteButton,
  buttonIcon,
  transferredMachine,
  handleAttach,
  radioStatus,
  radioStatusLabel,
  handleRadioStatus,
  onExportCSV,
  onExportLoading,
  onReload,
  filterExcludeRepoting,
  handleExcludeRepoting,
  handleGalleryView,
  dateFrom,
  dateTo,
  machineSettingPage,
  securityUserPage,
  settingPage,
  isDateFromDateTo,
  isPm2Environments,
  isPm2LogTypes,
  handleRefresh,
  handleFullScreen,
  filterStatus,
  onFilterStatus,
  filterPeriod,
  onFilterPeriod,
  onCompareINI,
  logTypes,
  typeOptions,
  filterType,
  onFilterType,
  ...other
}) {

  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { pm2Logs, pm2Environment, pm2Environments, pm2LogType, pm2Lines } = useSelector((state) => state.pm2Logs);
  const { spContacts } = useSelector((state) => state.contact);
  const { activeRegions } = useSelector((state) => state.region);
  const { selectedLogType } = useSelector((state) => state.machineErpLogs);
  const [isDateFrom, setIsDateFrom] = useState(dateFrom || new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [isDateTo, setIsDateTo] = useState(dateTo || new Date(Date.now()).toISOString().split('T')[0]);
  const [selectedLogTypeState, setSelectedLogTypeState] = useState(selectedLogType || logTypes?.[0]);

  const isMobile = useResponsive('sm', 'down');
  const dispatch = useDispatch()

  const { isAllAccessAllowed, isSettingReadOnly, isSecurityReadOnly } = useAuthContext();
  
  useEffect(() => {
    if (dateTo !== isDateTo) setIsDateTo(dateTo);
    if (dateFrom !== isDateFrom) setIsDateFrom(dateFrom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateTo, dateFrom])

  useDebouncedEffect(() => {
    // if( isDateFrom ){
    dispatch(setDateFrom(isDateFrom));
    // }
  }, [isDateFrom], 1000)

  useDebouncedEffect(() => {
    // if( isDateTo ){
    dispatch(setDateTo(isDateTo));
    // }
  }, [isDateTo], 1000)

  useDebouncedEffect(() => {
    dispatch(setSelectedLogType(selectedLogTypeState));
  }, [selectedLogTypeState], 1000);

  const onLogTypeChange = (newValue) => setSelectedLogTypeState(newValue);

  // const onChangeStartDate = (e) => setIsDateFrom(e.target.value);

  // const onChangeEndDate = (e) => setIsDateTo(e.target.value);

  return (
    <Grid container rowSpacing={logTypes?.length > 0 ? 2 : 1} columnSpacing={1} sx={{ display: 'flex', }}>
      {onChange && <Grid item xs={12} sm={12} md={12} lg={increaseFilterSize ? 12 : (logTypes?.length > 0 || reduceFilterSize || (setAccountManagerFilter && setSupportManagerFilter) ? 4 : 6)} xl={increaseFilterSize ? 12 : (logTypes?.length > 0 || reduceFilterSize || (setAccountManagerFilter && setSupportManagerFilter) ? 4 : 6)}>
        <TextField
          fullWidth
          value={value}
          onChange={onChange}
          size="small"
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
            endAdornment: (isFiltered && (
              <InputAdornment position="end">
                <Button fullWidth onClick={onClick} color='error' size='small' startIcon={<Iconify icon='eva:trash-2-outline' />}>
                  {BUTTONS.CLEAR}
                </Button>
              </InputAdornment>
            )
            ),
          }}
        />
      </Grid>}
      {node &&
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          {node}
        </Grid>
      }

      {nodes && nodes}

      {onFilterVerify &&
        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <Stack alignItems="flex-start">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Machines</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                size='small'
                name="isVerified"
                value={filterVerify}
                label="Verified"
                onChange={onFilterVerify}
              >
                <MenuItem key="all" value="all">All</MenuItem>
                <MenuItem key="transferredDate" value="transferredDate">Transferred</MenuItem>
                <MenuItem key="verified" value="verified">Verified</MenuItem>
                <MenuItem key="unverified" value="unverified">Not Verified</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Grid>}

      {onFilterListByRegion &&
        <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
          <Autocomplete
            value={filterByRegion || null}
            options={activeRegions}
            isOptionEqualToValue={(option, val) => option?._id === val?._id}
            getOptionLabel={(option) => option?.name}
            onChange={(event, newValue) => {
              if (newValue) {
                onFilterListByRegion(newValue);
              } else {
                onFilterListByRegion(null);
              }
            }}
            renderOption={(props, option) => (<li {...props} key={option?._id}>{option?.name || ''}</li>)}
            renderInput={(params) => <TextField {...params} size='small' label="Region" />}
          />
        </Grid>}

      {setAccountManagerFilter && isAllAccessAllowed &&
        <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
          <Autocomplete
            id="controllable-states-demo"
            value={accountManagerFilter || null}
            options={spContacts}
            isOptionEqualToValue={(option, val) => option?._id === val?._id}
            getOptionLabel={(option) =>
              `${option.firstName ? option.firstName : ''} ${option.lastName ? option.lastName : ''
              }`
            }
            onChange={(event, newValue) => {
              if (newValue) {
                setAccountManagerFilter(newValue);
              } else {
                setAccountManagerFilter(null);
              }
            }}
            renderOption={(props, option) => (
              <li {...props} key={option?._id}>{`${option.firstName ? option.firstName : ''
                } ${option.lastName ? option.lastName : ''}`}</li>
            )}
            renderInput={(params) => <TextField {...params} size='small' label="Account Manager" />}
          />

        </Grid>}

      {logTypes?.length > 0 &&
        <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
          <Autocomplete
            disableClearable
            value={selectedLogTypeState}
            options={logTypes}
            getOptionLabel={(option) => option.type}
            isOptionEqualToValue={(option, val) => option?.type === val?.type}
            onChange={(event, newValue) => onLogTypeChange(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                size='small'
                label="Select Log Type"
                inputProps={{
                  ...params.inputProps,
                  readOnly: true,
                  style: { cursor: 'pointer' }
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option?.type}>
                {option?.type || ''}
              </li>
            )}
            getOptionDisabled={(option) => option?.disabled}
          />
        </Grid>
      }

      {isDateFromDateTo &&
        <Grid item xs={12} sm={6} md={4} lg={2} xl={2}  >
          <DatePicker
            label="Start date"
            value={isDateFrom}
            onChange={(newValue) => setIsDateFrom(newValue)}
            inputFormat="dd/MM/yyyy"
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                size="small"
                error={isDateFrom && isDateTo && new Date(isDateTo) < new Date(isDateFrom)}
                helperText={isDateFrom && isDateTo && new Date(isDateTo) < new Date(isDateFrom) && `Start Date should be earlier than End date ${fDate(isDateTo)}`}
              />
            )}
          />
          {/* <TextField  
                  value={isDateFrom} 
                  type="date"
                  format="dd/mm/yyyy"
                  label="Start date"
                  sx={{width: '100%'}}
                  onChange={onChangeStartDate} 
                  error={ isDateFrom && dateTo && dateTo < isDateFrom } 
                  helperText={ isDateFrom && dateTo && dateTo < isDateFrom && `Start Date should be less than End date ${fDate(isDateTo)}`} 
                  size="small" 
                  InputLabelProps={{ shrink: true }}
                /> */}
        </Grid>
      }

      {isDateFromDateTo &&
        <Grid item xs={12} sm={6} md={4} lg={2} xl={2} >
          <DatePicker
            label="End date"
            value={isDateTo}
            onChange={(newValue) => setIsDateTo(newValue)}
            inputFormat="dd/MM/yyyy"
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                size="small"
                error={isDateFrom && isDateTo && isDateFrom > isDateTo}
                helperText={isDateFrom && isDateTo && new Date(isDateFrom) > new Date(isDateTo) && `End Date should be later than Start date ${fDate(isDateFrom)}`}
              />
            )}
          />
          {/* <TextField  
                  value={isDateTo} 
                  type="date"
                  format="dd/mm/yyyy"
                  label="End date"
                  sx={{width: '100%'}}
                  onChange={onChangeEndDate} 
                  error={ isDateFrom && isDateTo && isDateFrom > isDateTo } 
                  helperText={isDateFrom && isDateTo && isDateFrom > dateTo && `End Date should be greater than Start date ${fDate(isDateFrom)}`} 
                  size="small" 
                  InputLabelProps={{ shrink: true }}
                /> */}
        </Grid>
      }

      {setSupportManagerFilter && isAllAccessAllowed &&
        <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
          <Autocomplete
            id="controllable-states-demo"
            value={supportManagerFilter || null}
            options={spContacts}
            isOptionEqualToValue={(option, val) => option?._id === val?._id}
            getOptionLabel={(option) =>
              `${option.firstName ? option.firstName : ''} ${option.lastName ? option.lastName : ''
              }`
            }
            onChange={(event, newValue) => {
              if (newValue) {
                setSupportManagerFilter(newValue);
              } else {
                setSupportManagerFilter(null);
              }
            }}
            renderOption={(props, option) => (
              <li {...props} key={option?._id}>{`${option.firstName ? option.firstName : ''
                } ${option.lastName ? option.lastName : ''}`}</li>
            )}
            renderInput={(params) => <TextField {...params} size='small' label="Support Manager" />}
          />

        </Grid>}
       
          {onMachineVerify && (
             <Grid item xs={12} sm={6} md={4} lg={2} xl={4}>
                <Autocomplete
                   multiple
                   disableCloseOnSelect
                   options={[
                  { label: 'All', value: 'all' },
                  { label: 'Transferred', value: 'transferredDate' }, 
                  { label: 'Verified', value: 'verified' }, 
                  { label: 'Pending Verification', value: 'pendingVerification' },
                   ]}
  
                  value={Array.isArray(machineVerify) ? machineVerify : []} 
                  onChange={(event, newValue) => {
                  onMachineVerify(newValue);
                   }}
                  renderInput={(params) => (
                <TextField {...params} label="Status"  size="small" />
                          )}
                  />
               </Grid>
              )}


      {onEmployeeFilterListBy &&
        <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
          <Stack alignItems="flex-start">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Employee</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                size='small'
                name="employee"
                value={employeeFilterListBy}
                label="Employee"
                onChange={onEmployeeFilterListBy}
              >
                <MenuItem key="all" value="all">All</MenuItem>
                <MenuItem key="verified" value="employee">Employee</MenuItem>
                <MenuItem key="unverified" value="notEmployee">Not Employee</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Grid>}

      {onFilterListBy &&
        <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
          <Stack alignItems="flex-start">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                size='small'
                name="isVerified"
                value={filterListBy}
                label="Status"
                onChange={onFilterListBy}
              >
                <MenuItem key="all" value="all">All</MenuItem>
                <MenuItem key="verified" value="active">Active</MenuItem>
                <MenuItem key="unverified" value="inActive">In-Active</MenuItem>
                <MenuItem key="isArchived" value="isArchived">Archived</MenuItem>
                <MenuItem key="invitationStatus" value="invitationStatus">Invitations</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Grid>}
      {onFilterStatus &&
        <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
          <Stack alignItems="flex-start">
            <FormControl fullWidth>
              <InputLabel>Status Category</InputLabel>
              <Select
                size='small'
                name="status"
                value={filterStatus}
                label="Status Category"
                onChange={onFilterStatus}
              >
                <MenuItem key="all" value="All">All</MenuItem>
                <MenuItem key="open" value="Open">All Open</MenuItem>
                <MenuItem key="to-do" value="To Do">To Do</MenuItem>
                <MenuItem key="in-progress" value="In Progress">In Progress</MenuItem>
                <MenuItem key="done" value="Done">Done</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Grid>}
      {onFilterPeriod &&
        <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
          <Stack alignItems="flex-start">
            <FormControl fullWidth>
              <InputLabel>Period</InputLabel>
              <Select
                size='small'
                name="period"
                value={filterPeriod}
                label="Period"
                onChange={onFilterPeriod}
              >
                <MenuItem key="3" value={3}>Last 3 months</MenuItem>
                <MenuItem key="6" value={6}>Last 6 months</MenuItem>
                <MenuItem key="9" value={9}>Last 9 months</MenuItem>
                <MenuItem key="12" value={12}>Last year</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Grid>}

      {!machineDrawings && setCategoryVal && typeof setCategoryVal === 'function' &&
        <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
          <Autocomplete
            id="controllable-states-demo"
            value={categoryVal || null}
            options={activeDocumentCategories}
            isOptionEqualToValue={(option, val) => option?._id === val?._id}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
              if (newValue) {
                setCategoryVal(newValue);
                dispatch(getActiveDocumentTypesWithCategory(newValue?._id, null, drawing))
                if (newValue?._id !== typeVal?.docCategory?._id) {
                  setTypeVal(null);
                }
              } else {
                setCategoryVal(null);
                setTypeVal(null);
                dispatch(getActiveDocumentTypesWithCategory(null, null, drawing))
              }
            }}
            renderOption={(props, option) => (
              <li {...props} key={option?._id}>{option.name}</li>
            )}
            renderInput={(params) => <TextField {...params} size='small' label="Category" />}
          />
        </Grid>}

      {!machineDrawings && setTypeVal && typeof setTypeVal === 'function' && <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
        <Autocomplete
          id="controllable-states-demo"
          value={categoryVal ? typeVal : null}
          options={categoryVal ? activeDocumentTypes : []}
          isOptionEqualToValue={(option, val) => option?._id === val?._id}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => {
            if (newValue) {
              setTypeVal(newValue);
              if (!categoryVal) {
                setCategoryVal(newValue?.docCategory)
                dispatch(getActiveDocumentTypesWithCategory(newValue?.docCategory?._id, null, drawing))
              }
            } else {
              setTypeVal(null);
            }
          }}
          renderOption={(props, option) => (
            <li {...props} key={option?._id}>{option.name}</li>
          )}
          renderInput={(params) => <TextField {...params} size='small' label="Type" />}
        />
      </Grid>}

      {isPm2Environments &&
        <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
          <Autocomplete
            value={pm2Environment || null}
            options={pm2Environments}
            isOptionEqualToValue={(option, val) => option === val}
            onChange={(event, newValue) => {
              if (newValue) {
                dispatch(setPm2Environment(newValue));
              } else {
                dispatch(setPm2Environment(''));
              }
            }}
            renderInput={(params) => <TextField {...params} size='small' label="Environment" />}
          />
        </Grid>}

      {onApiLogsTypeFilter && onApiLogsMethodFilter && onApiLogsStatusFilter && <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(3, 1fr)' }} sx={{ flexGrow: 1, width: { xs: '100%', sm: '100%' }, pl: 1, pt: 1 }}>
        {onApiLogsTypeFilter && (
          <FormControl fullWidth>
            <InputLabel id="api-logs-type-label">API Type</InputLabel>
            <Select
              labelId="api-logs-type-label"
              id="api-logs-type"
              size="small"
              value={apiLogsTypeFilter}
              label="API Type"
              onChange={onApiLogsTypeFilter}
            >
              <MenuItem value="ALL">All</MenuItem>
              <MenuItem value="MACHINE-SYNC">Machine Sync</MenuItem>
              <MenuItem value="MACHINE-LOGS">Machine Logs</MenuItem>
              <MenuItem value="MACHINE-CONFIG" >Machine Config</MenuItem>
              <MenuItem value="OTHER">Others</MenuItem>
            </Select>
          </FormControl>
        )}
        {onApiLogsMethodFilter && (
          <FormControl fullWidth>
            <InputLabel id="api-logs-method-label">Method</InputLabel>
            <Select
              labelId="api-logs-method-label"
              id="api-logs-method"
              size="small"
              value={apiLogsMethodFilter}
              label="Method"
              onChange={onApiLogsMethodFilter}
            >
              <MenuItem value="default">All</MenuItem>
              <MenuItem value="GET">GET</MenuItem>
              <MenuItem value="POST">POST</MenuItem>
            </Select>
          </FormControl>
        )}
        {onApiLogsStatusFilter && (
          <FormControl fullWidth>
            <InputLabel id="api-logs-status-label">Status</InputLabel>
            <Select
              labelId="api-logs-status-label"
              id="api-logs-status"
              size="small"
              value={apiLogsStatusFilter}
              label="Status"
              onChange={onApiLogsStatusFilter}
            >
              <MenuItem key="-1" value={-1}>All</MenuItem>
              <MenuItem key="success" value="200-299">Success</MenuItem>
              <MenuItem key="failed" value="400-499">Failed</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>}

      {isPm2LogTypes &&
        <>
          <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
            <Autocomplete
              value={pm2LogType || null}
              options={['Error', 'Logs']}
              isOptionEqualToValue={(option, val) => option === val}
              onChange={(event, newValue) => {
                if (newValue) {
                  dispatch(setPm2LogType(newValue));
                } else {
                  dispatch(setPm2LogType(''));
                }
              }}
              renderInput={(params) => <TextField {...params} size='small' label="Logs Type" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Lines</InputLabel>
              <Select
                fullWidth
                size='small'
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="pm2Lines"
                value={pm2Lines}
                label="Lines"
                onChange={(event) => {
                  if (event.target.value) {
                    dispatch(setPm2LinesPerPage(event.target.value));
                  }
                }}
              >
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={250}>250</MenuItem>
                <MenuItem value={500}>500</MenuItem>
                <MenuItem value={1000}>1000</MenuItem>
                <MenuItem value={2000}>2000</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </>
      }
      {onSignInLogsFilter &&
        <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
          <Stack alignItems="flex-start">
            <FormControl fullWidth={isMobile} sx={{ ml: 2, width: '200px' }}>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                sx={{ width: '200px' }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                size="small"
                value={signInLogsFilter}
                label="Status"
                onChange={onSignInLogsFilter}
              >
                <MenuItem key="-1" value={-1}>All</MenuItem>
                <MenuItem key="200" value={200}>Success</MenuItem>
                <MenuItem key="401" value={401}>Failed</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Grid>
      }
      {handleExcludeRepoting &&
        <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
          <Stack alignItems="flex-start">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Reporting</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                size="small"
                name="Reporting"
                value={filterExcludeRepoting}
                label="Reporting"
                onChange={handleExcludeRepoting}
              >
                <MenuItem key="all" value='all'>All</MenuItem>
                <MenuItem key="excluded" value='excluded'>Exclude Reporting</MenuItem>
                <MenuItem key="included" value='included'>Include Reporting</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Grid>
      }

      {handleRadioStatus !== undefined &&
        <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
          <FormControlLabel control={<Switch checked={radioStatus}
            onClick={(event) => { handleRadioStatus(event.target.checked) }} />} label={radioStatusLabel} />
        </Grid>
      }

      {onFilterType && typeOptions && 
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <Stack alignItems="flex-start">
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                size='small'
                name="type"
                value={filterType}
                label="Type"
                onChange={onFilterType}
              >
                {typeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Grid>
      }

      <Grid item xs={12} sm={6} md={4} lg={2} xl={2} sx={{ ml: 'auto' }}>
        <Grid container rowSpacing={1} spacing={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {onReload &&
            <Grid item>
              <StyledTooltip title='Reload' placement="top" disableFocusListener tooltipcolor="#103996" color="#103996">
                <IconButton onClick={onReload} color="#fff" sx={{
                  background: "#2065D1", borderRadius: 1, height: '1.7em', p: '8.5px 14px',
                  '&:hover': {
                    background: "#103996",
                    color: "#fff"
                  }
                }}>
                  <Iconify color="#fff" sx={{ height: '24px', width: '24px' }} icon='mdi:reload' />
                </IconButton>
              </StyledTooltip>
            </Grid>
          }

          {inviteButton && !isSettingReadOnly && !isSecurityReadOnly &&
            <Grid item>
              <StyledTooltip title={inviteButton} placement="top" disableFocusListener tooltipcolor="#103996" color="#fff">
                <IconButton onClick={inviteOnClick}
                  color="#fff"
                  sx={{
                    background: "#2065D1", borderRadius: 1, height: '1.7em', p: '8.5px 14px',
                    '&:hover': {
                      background: "#103996",
                      color: "#fff"
                    }
                  }}>
                  <Iconify color="#fff" sx={{ height: '24px', width: '24px' }} icon='mdi:email-plus' />
                </IconButton>
              </StyledTooltip>
            </Grid>
          }

          {handleAttach && !transferredMachine &&
            <Grid item>
              <StyledTooltip title="Attach Existing Drawing" placement="top" disableFocusListener tooltipcolor="#103996" color="#103996">
                <IconButton onClick={handleAttach} color="#fff" sx={{
                  background: "#2065D1", borderRadius: 1, height: '1.7em', p: '8.5px 14px',
                  '&:hover': {
                    background: "#103996",
                    color: "#fff"
                  }
                }}>
                  <Iconify color="#fff" sx={{ height: '24px', width: '24px' }} icon='fluent:attach-arrow-right-24-filled' />
                </IconButton>
              </StyledTooltip>
            </Grid>}

          {isPm2Environments && pm2Logs?.data &&
            <Grid item>
              <StyledTooltip title="Full Screen" placement="top" disableFocusListener tooltipcolor="#103996" color="#103996">
                <IconButton onClick={handleFullScreen} color="#fff" sx={{
                  background: "#2065D1", borderRadius: 1, height: '1.7em', p: '8.5px 14px',
                  '&:hover': {
                    background: "#103996",
                    color: "#fff"
                  }
                }}>
                  <Iconify color="#fff" sx={{ height: '24px', width: '24px' }} icon='icon-park-outline:full-screen-two' />
                </IconButton>
              </StyledTooltip>
            </Grid>
          }
          {handleRefresh &&
            <Grid item>
              <StyledTooltip title="Refresh" placement="top" disableFocusListener tooltipcolor="#103996" color="#103996">
                <IconButton onClick={handleRefresh} color="#fff" sx={{
                  background: "#2065D1", borderRadius: 1, height: '1.7em', p: '8.5px 14px',
                  '&:hover': {
                    background: "#103996",
                    color: "#fff"
                  }
                }}>
                  <Iconify color="#fff" sx={{ height: '24px', width: '24px' }} icon='mdi:reload' />
                </IconButton>
              </StyledTooltip>
            </Grid>
          }

          {handleGalleryView &&
            <Grid item>
              <StyledTooltip title="View Gallery" placement="top" disableFocusListener tooltipcolor="#103996" color="#103996">
                <IconButton onClick={handleGalleryView} color="#fff" sx={{
                  background: "#2065D1", borderRadius: 1, height: '1.7em', p: '8.5px 14px',
                  '&:hover': {
                    background: "#103996",
                    color: "#fff"
                  }
                }}>
                  <Iconify color="#fff" sx={{ height: '24px', width: '24px' }} icon='ooui:image-gallery' />
                </IconButton>
              </StyledTooltip>
            </Grid>
          }

          {onExportCSV && isAllAccessAllowed &&
            <Grid item>
              <LoadingButton onClick={() => onExportCSV(false, false)} variant='contained' sx={{ p: 0, minWidth: '24px' }} loading={onExportLoading}>
                <StyledTooltip title={BUTTONS.EXPORT.label} placement="top" disableFocusListener tooltipcolor="#103996" color="#103996">
                  <Iconify color="#fff" sx={{ height: '41px', width: '55px', p: '8px' }} icon={BUTTONS.EXPORT.icon} />
                </StyledTooltip>
              </LoadingButton>
            </Grid>
          }

          {openGraph &&
            <Grid item>
              <StyledTooltip title="Log Graph" placement="top" disableFocusListener tooltipcolor="#103996" color="#103996">
                <IconButton onClick={openGraph} color="#fff" sx={{
                  background: "#2065D1", borderRadius: 1, height: '1.7em', p: '8.5px 14px',
                  '&:hover': {
                    background: "#103996",
                    color: "#fff"
                  }
                }}>
                  <Iconify color="#fff" sx={{ height: '24px', width: '24px' }} icon='mdi:graph-bar' />
                </IconButton>
              </StyledTooltip>
            </Grid>
          }

          {SubOnClick2 && !transferredMachine &&
            <Grid item >
              <StyledTooltip
                title="Upload Multiple Drawing"
                placement="top"
                disableFocusListener
                tooltipcolor={(machineSettingPage || settingPage || securityUserPage) && (isSettingReadOnly || isSecurityReadOnly) ? "#c3c3c3" : "#103996"}
                color={(machineSettingPage || settingPage || securityUserPage) && (isSettingReadOnly || isSecurityReadOnly) ? "#c3c3c3" : "#103996"}
              >
                <IconButton
                  disabled={(machineSettingPage || settingPage || securityUserPage) && (isSettingReadOnly || isSecurityReadOnly)}
                  color={(machineSettingPage || settingPage || securityUserPage) && (isSettingReadOnly || isSecurityReadOnly) ? "#c3c3c3" : "#fff"}
                  onClick={SubOnClick2}
                  sx={{
                    background: "#2065D1", borderRadius: 1, height: '1.7em', p: '8.5px 14px',
                    '&:hover': {
                      background: "#103996",
                      color: "#fff"
                    }
                  }}>
                  <Iconify
                    color={(machineSettingPage || settingPage || securityUserPage) && (isSettingReadOnly || isSecurityReadOnly) ? "#c3c3c3" : "#fff"}
                    sx={{ height: '24px', width: '24px' }} icon='ic:round-post-add'
                  />
                </IconButton>
              </StyledTooltip>
            </Grid>
          }

          {onCompareINI && !transferredMachine &&
            <Grid item >
              <StyledTooltip title="Compare" placement="top" disableFocusListener tooltipcolor="#103996" color="#fff">
                <IconButton color="#fff" onClick={onCompareINI}
                  sx={{
                    background: "#2065D1", borderRadius: 1, height: '1.7em', p: '8.5px 14px',
                    '&:hover': {
                      background: "#103996",
                      color: "#fff"
                    }
                  }}>
                  <Iconify color="#fff" sx={{ height: '24px', width: '24px' }} icon='iconamoon:compare-duotone'
                  />
                </IconButton>
              </StyledTooltip>
            </Grid>
          }
          {addButton && SubOnClick && !transferredMachine
            && !((machineSettingPage || settingPage || securityUserPage) && (isSettingReadOnly || isSecurityReadOnly)) &&
            <Grid item >
              <StyledTooltip title={addButton} placement="top" disableFocusListener tooltipcolor="#103996" color="#fff">
                <IconButton color="#fff" onClick={SubOnClick}
                  sx={{
                    background: "#2065D1", borderRadius: 1, height: '1.7em', p: '8.5px 14px',
                    '&:hover': {
                      background: "#103996",
                      color: "#fff"
                    }
                  }}>
                  <Iconify color="#fff" sx={{ height: '24px', width: '24px' }} icon={buttonIcon || 'eva:plus-fill'} />
                </IconButton>
              </StyledTooltip>
            </Grid>
          }
        </Grid>
      </Grid>
    </Grid>
  );
}

SearchBarCombo.propTypes = {
  node: PropTypes.node,
  nodes: PropTypes.node,
  isFiltered: PropTypes.bool,
  reduceFilterSize: PropTypes.bool,
  increaseFilterSize: PropTypes.bool,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
  SubOnClick: PropTypes.func,
  SubOnClick2: PropTypes.func,
  addButton: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  inviteOnClick: PropTypes.func,
  inviteButton: PropTypes.string,
  buttonIcon: PropTypes.string,
  onFilterVerify: PropTypes.func,
  filterVerify: PropTypes.string,
  onMachineVerify: PropTypes.func,
  machineVerify: PropTypes.string,
  setAccountManagerFilter: PropTypes.func,
  accountManagerFilter: PropTypes.object,
  setSupportManagerFilter: PropTypes.func,
  supportManagerFilter: PropTypes.object,
  filterListBy: PropTypes.string,
  onFilterListBy: PropTypes.func,
  categoryVal: PropTypes.object,
  setCategoryVal: PropTypes.func,
  openGraph: PropTypes.func,
  typeVal: PropTypes.object,
  setTypeVal: PropTypes.func,
  machineDrawings: PropTypes.bool,
  employeeFilterListBy: PropTypes.string,
  onEmployeeFilterListBy: PropTypes.func,
  onFilterListByRegion: PropTypes.func,
  filterByRegion: PropTypes.object,
  signInLogsFilter: PropTypes.number,
  onSignInLogsFilter: PropTypes.func,
  apiLogsStatusFilter: PropTypes.number,
  onApiLogsStatusFilter: PropTypes.func,
  apiLogsMethodFilter: PropTypes.string,
  onApiLogsMethodFilter: PropTypes.func,
  apiLogsTypeFilter: PropTypes.string,
  onApiLogsTypeFilter: PropTypes.func,
  transferredMachine: PropTypes.bool,
  handleAttach: PropTypes.func,
  radioStatus: PropTypes.bool,
  radioStatusLabel: PropTypes.string,
  handleRadioStatus: PropTypes.func,
  onExportCSV: PropTypes.func,
  onExportLoading: PropTypes.bool,
  onReload: PropTypes.func,
  filterExcludeRepoting: PropTypes.string,
  handleExcludeRepoting: PropTypes.func,
  handleGalleryView: PropTypes.func,
  dateFrom: PropTypes.string,
  dateTo: PropTypes.string,
  isDateFromDateTo: PropTypes.bool,
  machineSettingPage: PropTypes.bool,
  securityUserPage: PropTypes.bool,
  settingPage: PropTypes.bool,
  isPm2Environments: PropTypes.bool,
  handleRefresh: PropTypes.func,
  isPm2LogTypes: PropTypes.bool,
  handleFullScreen: PropTypes.func,
  filterStatus: PropTypes.string,
  onFilterStatus: PropTypes.func,
  filterPeriod: PropTypes.number,
  onFilterPeriod: PropTypes.func,
  onCompareINI: PropTypes.func,
  logTypes: PropTypes.array,
  drawing: PropTypes.bool,
  typeOptions: PropTypes.array,
  filterType: PropTypes.string,
  onFilterType: PropTypes.func,
};

export default SearchBarCombo;
