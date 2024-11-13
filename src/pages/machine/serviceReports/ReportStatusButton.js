import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Menu, MenuItem, Typography, } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CircularProgress from '@mui/material/CircularProgress';
import { getActiveServiceReportStatuses, resetActiveServiceReportStatuses } from '../../../redux/slices/products/serviceReportStatuses';
import { updateMachineServiceReport } from '../../../redux/slices/products/machineServiceReport';
import IconButtonTooltip from '../../../components/Icons/IconButtonTooltip';

ReportStatusButton.propTypes = {
    iconButton: PropTypes.bool,
    status: PropTypes.string,
    machineID: PropTypes.string,
    reportID: PropTypes.string,
  };

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
  },
}));

export default function ReportStatusButton( { iconButton, status, machineID, reportID } ) {
  const [ anchorEl, setAnchorEl ] = useState(null);
  const open = Boolean(anchorEl);
  const { machineId, id } = useParams();
  const dispatch = useDispatch();
  const { isLoading  } = useSelector( (state) => state.machineServiceReport );
  const { activeServiceReportStatuses, isLoadingReportStatus  } = useSelector( (state) => state.serviceReportStatuses );
  
  useEffect(()=>{
    dispatch(getActiveServiceReportStatuses() )
    return ()=>{
        dispatch(resetActiveServiceReportStatuses())
    }
  },[ dispatch ])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = ( statusId ) => {
    dispatch(updateMachineServiceReport( machineId, id, { status: statusId })); 
    handleClose();
  };

  const getButtonColor = ( statusType ) => {
    if (statusType === "draft") return 'inherit';
    if (statusType === "done") return 'success';
    return "primary";
  };

  return (
    <div>
        {iconButton ?
        <>
            { status?.name || "" }
            <IconButtonTooltip 
                title='Change Status' 
                icon="bxs:down-arrow" 
                onClick={handleClick}
            /> 
        </>
         :
      <Button
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        color={getButtonColor( status?.type?.toLowerCase())}
        endIcon={
          isLoading ? <CircularProgress color="inherit" /> : ( 
                Array.isArray( activeServiceReportStatuses ) && activeServiceReportStatuses?.length > 0 && <KeyboardArrowDownIcon /> 
            )
        }
        disabled={isLoading}
      >
        { status?.name || "" }
      </Button>}
      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        { isLoadingReportStatus && ( <CircularProgress size={20} color="inherit" /> && "Loading..." ) }
        { !isLoadingReportStatus && Array.isArray( activeServiceReportStatuses ) && 
          activeServiceReportStatuses?.filter((s)=> s?.type?.toLowerCase() !== 'draft' )?.map( ( s ) => 
            <MenuItem size="small" onClick={() => status?._id !== s?._id && handleAction(s?._id) } selected={ status?._id === s?._id } >
              <Typography variant="body2" noWrap>
                {`${s?.name || ""}${s?.type ? ` (${s?.type || ""})` : ""}`}
              </Typography>
            </MenuItem>
        )}
      </StyledMenu>
    </div>
  );
}
