import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { Grid, TextField, InputAdornment, Button, Stack, 
  FormControl, Select, InputLabel, MenuItem, IconButton, Switch, FormControlLabel, Autocomplete } from '@mui/material';
import { BUTTONS } from '../../constants/default-constants';
import Iconify from '../iconify';
import useResponsive from '../../hooks/useResponsive';
import { StyledTooltip } from '../../theme/styles/default-styles';
import { getActiveDocumentTypesWithCategory } from '../../redux/slices/document/documentType';
import { fDate } from '../../utils/formatTime';
import { setDateFrom, setDateTo } from '../../redux/slices/products/machineErpLogs';
import { useAuthContext } from '../../auth/useAuthContext';

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
  onFilterListByRegion,
  filterByRegion,
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
  ...other
}) {
  
  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { spContacts } = useSelector((state) => state.contact);
  const { activeRegions } = useSelector((state) => state.region);

  const isMobile = useResponsive('sm', 'down');
  const dispatch = useDispatch()

  const { isAllAccessAllowed, isSettingReadOnly, isSecurityReadOnly } = useAuthContext();

  const onChangeStartDate = (e) => {
    dispatch(setDateFrom(e.target.value));
  };

  const onChangeEndDate = (e) => {
    dispatch(setDateTo(e.target.value));
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
          
          { onFilterListByRegion &&
          <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
            <Autocomplete 
              value={ filterByRegion || null}
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
              renderOption={(props, option) => ( <li {...props} key={option._id}>{option?.name || ''}</li> )}
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

          { isDateFromDateTo && 
            <Grid item xs={12} sm={6} md={4} lg={2} xl={2}  >
                <TextField  
                  value={dateFrom} 
                  type="date"
                  format={dateFrom ?? "dd/mm/yyyy"}
                  label="Start date"
                  sx={{width: '100%'}}
                  onChange={onChangeStartDate} 
                  error={ dateFrom && dateTo && dateTo < dateFrom } 
                  helperText={ dateFrom && dateTo && dateTo < dateFrom && `Start Date should be less than End date ${fDate(dateTo)}`} 
                  size="small" 
                  InputLabelProps={{ shrink: true }}
                />
            </Grid>
          }

          { isDateFromDateTo && 
            <Grid item xs={12} sm={6} md={4} lg={2} xl={2} >
                <TextField  
                  value={dateTo} 
                  type="date"
                  format={ dateTo ?? "dd/mm/yyyy"} 
                  label="End date"
                  sx={{width: '100%'}}
                  onChange={onChangeEndDate} 
                  error={ dateFrom && dateTo && dateFrom > dateTo } 
                  helperText={dateFrom && dateTo && dateFrom > dateTo && `End Date should be greater than Start date ${fDate(dateFrom)}`} 
                  size="small" 
                  InputLabelProps={{ shrink: true }}
                />
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
                    <StyledTooltip title={inviteButton} placement="top" disableFocusListener 
                      tooltipcolor={( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly ) ? "#c3c3c3":"#103996"} 
                      color={( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly ) ? "#c3c3c3":"#103996"} 
                    >
                      <IconButton onClick={inviteOnClick} 
                        disabled={ ( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly ) } 
                        color={( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly ) ? "#c3c3c3":"#fff"}
                        sx={{background:"#2065D1", borderRadius:1, height:'1.7em', p:'8.5px 14px',
                        '&:hover': {
                          background:"#103996", 
                          color:"#fff"
                        }
                      }}>
                        <Iconify 
                          color={( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly ) ? "#c3c3c3":"#fff"} 
                          sx={{ height: '24px', width: '24px'}} icon={buttonIcon || 'mdi:user-plus'} 
                        />
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

              {onExportCSV && isAllAccessAllowed && 
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
              
              {SubOnClick2 && !transferredMachine && 
                <Grid item >
                    <StyledTooltip 
                      title="Add Drawing List" 
                      placement="top" 
                      disableFocusListener 
                      tooltipcolor={( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly ) ? "#c3c3c3":"#103996"} 
                      color={( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly ) ? "#c3c3c3":"#103996"} 
                    >
                    <IconButton 
                      disabled={ ( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly ) } 
                      color={( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly ) ? "#c3c3c3":"#fff"}
                      onClick={SubOnClick2} 
                      sx={{background:"#2065D1", borderRadius:1, height:'1.7em', p:'8.5px 14px',
                      '&:hover': {
                        background:"#103996", 
                        color:"#fff"
                      }
                    }}>
                      <Iconify 
                        color={( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly ) ? "#c3c3c3":"#fff"} 
                        sx={{ height: '24px', width: '24px'}} icon='ic:round-post-add'
                      />
                    </IconButton>
                  </StyledTooltip>
                </Grid>
              }

              {addButton && !transferredMachine && 
                <Grid item >
                    <StyledTooltip 
                      title={addButton} 
                      placement="top" 
                      disableFocusListener 
                      tooltipcolor={( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly ) ? "#c3c3c3":"#103996"} 
                      color={( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly ) ? "#c3c3c3":"#103996"} 
                    >
                    <IconButton 
                      disabled={ ( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly ) } 
                      color={( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly ) ? "#c3c3c3":"#fff"}
                      onClick={SubOnClick} 
                      sx={{background:"#2065D1", borderRadius:1, height:'1.7em', p:'8.5px 14px',
                      '&:hover': {
                        background:"#103996", 
                        color:"#fff"
                      }
                    }}>
                      <Iconify 
                        color={( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly ) ? "#c3c3c3":"#fff"} 
                        sx={{ height: '24px', width: '24px'}} icon={buttonIcon || 'eva:plus-fill'} 
                      />
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
  SubOnClick2: PropTypes.func,
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
  onFilterListByRegion: PropTypes.func,
  filterByRegion: PropTypes.object,
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
  dateFrom: PropTypes.string,
  dateTo: PropTypes.string,
  isDateFromDateTo: PropTypes.bool,
  machineSettingPage: PropTypes.bool,
  securityUserPage: PropTypes.bool,
  settingPage: PropTypes.bool,
};

export default SearchBarCombo;
