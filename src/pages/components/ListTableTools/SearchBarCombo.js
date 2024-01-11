import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import { Grid, TextField, InputAdornment, Button, Stack, 
  FormControl, Select, InputLabel, MenuItem, IconButton, Switch, FormControlLabel, Autocomplete } from '@mui/material';
import { BUTTONS } from '../../../constants/default-constants';
import Iconify from '../../../components/iconify';
import useResponsive from '../../../hooks/useResponsive';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import { getActiveDocumentTypesWithCategory } from '../../../redux/slices/document/documentType';

function SearchBarCombo({
  isFiltered,
  value,
  onFilterVerify,
  filterVerify,
  setAccountManagerFilter,
  accountManagerFilter,
  setSupportManagerFilter,
  supportManagerFilter,
  employeeFilterListBy,
  onEmployeeFilterListBy,
  filterListBy,
  onFilterListBy,
  categoryVal,
  setCategoryVal,
  typeVal,
  setTypeVal,
  signInLogsFilter,
  onSignInLogsFilter,
  onChange,
  onClick,
  SubOnClick,
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
  setDateFrom,
  dateTo,
  setDateTo,
  ...other
}) {
  
  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { spContacts } = useSelector((state) => state.contact);
  const isMobile = useResponsive('sm', 'down');
  const dispatch = useDispatch()

  const onChangeStartDate = (newValue) => {
    setDateFrom(newValue);
  };

  const onChangeEndDate = (newValue) => {
    setDateTo(newValue);
  };

  return (
    <Grid container rowSpacing={1} columnSpacing={1} sx={{display:'flex', }}>
          <Grid item xs={12} sm={12} md={12} lg={setAccountManagerFilter && setSupportManagerFilter ? 4:6} xl={setAccountManagerFilter && setSupportManagerFilter ? 4:6}>
            <TextField
              fullWidth
              value={value}
              onChange={onChange}
              size="small"
              placeholder="Search..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify  icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
                endAdornment: (isFiltered && (
                  <InputAdornment position="end">
                    <Button fullWidth onClick={onClick} color='error'size='small' startIcon={<Iconify icon='eva:trash-2-outline' />}>
                      {BUTTONS.CLEAR}
                    </Button>
                  </InputAdornment>
                )
                ),
              }}
            />
          </Grid>

          {onFilterVerify &&
          <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
            <Stack alignItems="flex-start">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
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
                <MenuItem key="verified" value="verified">Verified</MenuItem>
                <MenuItem key="unverified" value="unverified">Not Verified</MenuItem>
                </Select>
            </FormControl>
            </Stack>
          </Grid>}

          {setAccountManagerFilter &&
          <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
            <Autocomplete 
              id="controllable-states-demo"
              value={accountManagerFilter || null}
              options={spContacts}
              isOptionEqualToValue={(option, val) => option?._id === val?._id}
              getOptionLabel={(option) =>
                `${option.firstName ? option.firstName : ''} ${
                  option.lastName ? option.lastName : ''
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
                <li {...props} key={option._id}>{`${
                  option.firstName ? option.firstName : ''
                } ${option.lastName ? option.lastName : ''}`}</li>
              )}
              renderInput={(params) => <TextField {...params} size='small' label="Account Manager" />}
            />  
          
          </Grid>}

          { setDateFrom && 
            <Grid item xs={12} sm={6} md={4} lg={2} xl={2}  >
              <DatePicker
                size="small"
                label="Start date"
                value={dateFrom}
                onChange={onChangeStartDate}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </Grid>
          }

          { setDateTo && 
            <Grid item xs={12} sm={6} md={4} lg={2} xl={2} >
              <DatePicker
                size="small"
                label="End date"
                value={dateTo}
                onChange={onChangeEndDate}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </Grid>
          }

          {setSupportManagerFilter &&
          <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
            <Autocomplete 
              id="controllable-states-demo"
              value={supportManagerFilter || null}
              options={spContacts}
              isOptionEqualToValue={(option, val) => option?._id === val?._id}
              getOptionLabel={(option) =>
                `${option.firstName ? option.firstName : ''} ${
                  option.lastName ? option.lastName : ''
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
                <li {...props} key={option._id}>{`${
                  option.firstName ? option.firstName : ''
                } ${option.lastName ? option.lastName : ''}`}</li>
              )}
              renderInput={(params) => <TextField {...params} size='small' label="Support Manager" />}
            />  
          
          </Grid>}

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
                </Select>
            </FormControl>
            </Stack>
          </Grid>}

          { setCategoryVal &&  typeof setCategoryVal === 'function' && 
          <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
            <Autocomplete 
              id="controllable-states-demo"
              value={categoryVal || null}
              options={activeDocumentCategories}
              isOptionEqualToValue={(option, val) => option?._id === val?._id}
              getOptionLabel={(option) =>  option.name }
              onChange={(event, newValue) => {
                if (newValue) {
                  setCategoryVal(newValue);
                  dispatch(getActiveDocumentTypesWithCategory(newValue?._id))
                  if(newValue?._id !== typeVal?.docCategory?._id){
                    setTypeVal(null);
                  }
                } else {
                  setCategoryVal(null);
                  setTypeVal(null);
                  dispatch(getActiveDocumentTypesWithCategory())
                }
              }}
              renderOption={(props, option) => (
                <li {...props} key={option._id}>{option.name}</li>
              )}
              renderInput={(params) => <TextField {...params} size='small' label="Category" />}
            />
          </Grid>}

          {setTypeVal &&  typeof setTypeVal === 'function'  && <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
            <Autocomplete 
              id="controllable-states-demo"
              value={typeVal || null}
              options={activeDocumentTypes}
              isOptionEqualToValue={(option, val) => option?._id === val?._id}
              getOptionLabel={(option) =>  option.name }
              onChange={(event, newValue) => {
                if (newValue) {
                  setTypeVal(newValue);
                  if(!categoryVal){
                    setCategoryVal(newValue?.docCategory)
                    dispatch(getActiveDocumentTypesWithCategory(newValue?.docCategory?._id))
                  }
                } else {
                  setTypeVal(null);
                }
              }}
              renderOption={(props, option) => (
                <li {...props} key={option._id}>{option.name}</li>
              )}
              renderInput={(params) => <TextField {...params} size='small' label="Type" />}

            />
          </Grid>}

          

          {onSignInLogsFilter &&
            <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
              <Stack alignItems="flex-start">
              <FormControl fullWidth={isMobile} sx={{ml:2, width:'200px'}}>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  sx={{width:'200px'}}
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
              <FormControl fullWidth={isMobile} sx={{ml:2, width:'200px'}}>
                <InputLabel id="demo-simple-select-label">Reporting</InputLabel>
                <Select
                  sx={{width:'200px'}}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  size="small"
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
                  onClick={(event)=>{handleRadioStatus(event.target.checked)}} />} label={radioStatusLabel} />
            </Grid>
          }

          <Grid item xs={12} sm={6} md={4} lg={2} xl={2} sx={{ml:'auto'}}>
            <Grid container rowSpacing={1} columnSpacing={2} sx={{display:'flex', justifyContent:'flex-end'}}>
              {onReload && 
                  <Grid item>
                    <StyledTooltip title='Reload' placement="top" disableFocusListener tooltipcolor="#103996" color="#103996">
                    <IconButton onClick={onReload} color="#fff" sx={{background:"#2065D1", borderRadius:1, height:'1.7em', p:'8.5px 14px',
                      '&:hover': {
                        background:"#103996", 
                        color:"#fff"
                      }
                    }}>
                      <Iconify color="#fff" sx={{ height: '24px', width: '24px'}} icon='mdi:reload' />
                    </IconButton>
                  </StyledTooltip>
                </Grid>
              }
                
                {inviteButton && 
                  <Grid item>
                    <StyledTooltip title={inviteButton} placement="top" disableFocusListener tooltipcolor="#103996" color="#103996">
                      <IconButton onClick={inviteOnClick} color="#fff" sx={{background:"#2065D1", borderRadius:1, height:'1.7em', p:'8.5px 14px',
                        '&:hover': {
                          background:"#103996", 
                          color:"#fff"
                        }
                      }}>
                        <Iconify color="#fff" sx={{ height: '24px', width: '24px'}} icon={buttonIcon || 'mdi:user-plus'} />
                      </IconButton>
                    </StyledTooltip>
                  </Grid>
                }
              
              {handleAttach && !transferredMachine &&
                <Grid item>
                  <StyledTooltip title="Attach Drawing" placement="top" disableFocusListener tooltipcolor="#103996" color="#103996">
                  <IconButton onClick={handleAttach} color="#fff" sx={{background:"#2065D1", borderRadius:1, height:'1.7em', p:'8.5px 14px',
                    '&:hover': {
                      background:"#103996", 
                      color:"#fff"
                    }
                  }}>
                    <Iconify color="#fff" sx={{ height: '24px', width: '24px'}} icon='fluent:attach-arrow-right-24-filled' />
                  </IconButton>
                </StyledTooltip>
              </Grid>}

              {handleGalleryView && 
                <Grid item>
                    <StyledTooltip title="View Gallery" placement="top" disableFocusListener tooltipcolor="#103996" color="#103996">
                      <IconButton onClick={handleGalleryView} color="#fff" sx={{background:"#2065D1", borderRadius:1, height:'1.7em', p:'8.5px 14px',
                        '&:hover': {
                          background:"#103996", 
                          color:"#fff"
                        }
                      }}>
                        <Iconify color="#fff" sx={{ height: '24px', width: '24px'}} icon='ooui:image-gallery' />
                      </IconButton>
                    </StyledTooltip>
                </Grid>
              }

              {onExportCSV && 
                  <Grid item>
                    <LoadingButton onClick={onExportCSV}  variant='contained' sx={{p:0, minWidth:'24px'}} loading={onExportLoading}>
                      <StyledTooltip title={BUTTONS.EXPORT.label} placement="top" disableFocusListener tooltipcolor="#103996" color="#103996">
                        <Iconify color="#fff" sx={{ height: '41px', width: '55px', p:'8px'}} icon={BUTTONS.EXPORT.icon} />
                      </StyledTooltip>
                    </LoadingButton>
                </Grid>
              }

              {openGraph && 
              <Grid item>
                <StyledTooltip title="Log Graph" placement="top" disableFocusListener tooltipcolor="#103996" color="#103996">
                    <IconButton onClick={openGraph} color="#fff" sx={{background:"#2065D1", borderRadius:1, height:'1.7em', p:'8.5px 14px',
                        '&:hover': {
                            background:"#103996", 
                            color:"#fff"
                        }
                    }}>
                        <Iconify color="#fff" sx={{ height: '24px', width: '24px'}} icon='mdi:graph-bar' />
                    </IconButton>
                </StyledTooltip>
              </Grid>
              }

              {addButton && !transferredMachine &&
                  <Grid item>
                    <StyledTooltip title={addButton} placement="top" disableFocusListener tooltipcolor="#103996" color="#103996">
                    <IconButton onClick={SubOnClick} color="#fff" sx={{background:"#2065D1", borderRadius:1, height:'1.7em', p:'8.5px 14px',
                      '&:hover': {
                        background:"#103996", 
                        color:"#fff"
                      }
                    }}>
                      <Iconify color="#fff" sx={{ height: '24px', width: '24px'}} icon={buttonIcon || 'eva:plus-fill'} />
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
  isFiltered: PropTypes.bool,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
  SubOnClick: PropTypes.func,
  addButton: PropTypes.string,
  inviteOnClick: PropTypes.func,
  inviteButton: PropTypes.string,
  buttonIcon: PropTypes.string,
  onFilterVerify:PropTypes.func,
  filterVerify:PropTypes.string,
  setAccountManagerFilter:PropTypes.func,
  accountManagerFilter:PropTypes.object,
  setSupportManagerFilter:PropTypes.func,
  supportManagerFilter:PropTypes.object,
  filterListBy: PropTypes.string,
  onFilterListBy: PropTypes.func,
  categoryVal: PropTypes.object,
  setCategoryVal: PropTypes.func,
  openGraph: PropTypes.func,
  typeVal: PropTypes.object,
  setTypeVal: PropTypes.func,
  employeeFilterListBy: PropTypes.string,
  onEmployeeFilterListBy: PropTypes.func,
  signInLogsFilter:PropTypes.number,
  onSignInLogsFilter:PropTypes.func,
  transferredMachine:PropTypes.bool,
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
  dateFrom: PropTypes.object,
  setDateFrom: PropTypes.func,
  dateTo: PropTypes.object,
  setDateTo: PropTypes.func,
};

export default SearchBarCombo;
