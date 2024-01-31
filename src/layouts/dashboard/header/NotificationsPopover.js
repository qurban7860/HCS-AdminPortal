import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import { useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router';
// @mui
import {
  Box,
  List,
  Badge,
  Avatar,
  Divider,
  Typography,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
  Tooltip,
  IconButton,
  Grid,
} from '@mui/material';
// utils
import { fDateTime, fToNow } from '../../../utils/formatTime';

// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import MenuPopover from '../../../components/menu-popover';
import { IconButtonAnimate } from '../../../components/animate';
import { useWebSocketContext } from '../../../auth/WebSocketContext';
import { ICONS } from '../../../constants/icons/default-icons';
import { PATH_MACHINE } from '../../../routes/paths';

// ----------------------------------------------------------------------

function NotificationsPopover() {
  const userId = localStorage.getItem('userId');
  const [ openPopover, setOpenPopover ] = useState(null);
  const { notifications, sendJsonMessage } = useWebSocketContext();
  const [ totalUnRead, setTotalUnRead ] = useState(0);
  const navigate = useNavigate();

  useEffect(()=>{
    setTotalUnRead(notifications && notifications.filter((item) => item?.readBy?.includes(userId) === false).length);
  },[notifications, userId])

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleMarkAs = (notification) => {
    if(notification?._id){
      // setOpenPopover(null);
      sendJsonMessage({eventName:'markAs',_id:notification?._id, status:true});
      navigate(PATH_MACHINE.machines.settings.serviceRecordConfigs.view(notification?.extraInfo?._id));
    }else{
      sendJsonMessage({eventName:'markAs', status:true});
    }
  }

  return (
    <>
      <IconButtonAnimate color={openPopover ? 'primary' : 'default'} onClick={handleOpenPopover} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={totalUnRead} color="error" ><Iconify icon={openPopover ? 'mdi:bell-ring' : 'mdi:bell'} /></Badge>
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 360, p: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              You have {totalUnRead || 'no'} unread {totalUnRead>1?"messages":"message"}
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={()=>handleMarkAs()}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        {notifications && notifications?.length>0 &&
          <>
          <Divider sx={{ borderStyle: 'solid' }} />
          <Scrollbar key='scrollbar' sx={{ maxHeight: 300 }}>
            <List key={notifications?.length} disablePadding
              // subheader={
              //   <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
              //     {!notifications && 'Loading...' ? 'No notifications' : 'NEW'}
              //   </ListSubheader>
              // }
            >
              {notifications.map((notification) => (
                <NotificationItem handleMarkAs={handleMarkAs} key={notification?._id} notification={notification} />
              ))}
            </List>
          </Scrollbar>
          <Divider sx={{ borderStyle: 'solid' }} />
          {!notifications && 'Loading...' ? (
            ''
          ) : (
            <Box sx={{ p: 1 }}>
                {` `}{/* <Button disableRipple onClick={handleClearAll} variant='outlined' startIcon={<Iconify icon='icon-park-outline:clear-format' />}>Clear</Button> */}
                {/* <Button disableRipple>Remove All</Button> */}
            </Box>
          )}
          </>
        }

      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    extraInfo : PropTypes.object,
    readBy: PropTypes.array,
    receivers: PropTypes.array,
    createdAt: PropTypes.string
  }),
  handleMarkAs:PropTypes.func
};

function NotificationItem({ notification, handleMarkAs}) {
  const { title, icon, color } = renderNotification(notification);
  const userId = localStorage.getItem('userId');

  return (
    <ListItemButton
      sx={{
        py: 1.0,
        px: 1.5,
        pb: 0.5,
        borderBottom:'1px solid #919eab3d',
        ...(!notification?.readBy?.includes(userId) && {
          bgcolor: 'action.selected',
        }),
      }}
      onClick={()=> handleMarkAs(notification)}
      >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.primary'}}><Iconify icon={icon} color={color} width={30} /></Avatar>
      </ListItemAvatar>

      <ListItemText
        disableTypography
        primary={title}
        secondary={
          <Grid container direction="row" sx={{ typography: 'caption', color: 'text.disabled' }}>
            <Grid item display='flex' columnGap={0.5} mt={0.5}>
              <Iconify icon="eva:clock-fill" width={16}/>
              <Typography variant="caption">{fToNow(fDateTime(notification.createdAt))}</Typography>
            </Grid>
            
            {/* <Grid item lg={4}>
              <Typography variant="caption" align='right' alignSelf='flex-end' >Clear</Typography>
            </Grid> */}
            {/* <Iconify icon="eva:clock-fill" width={16} sx={{ mr: 0.5 }} /> */}
          </Grid>
        }
        />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderNotification(notification) {

  const rendered = {title:'', icon:'', color:''};
  const { extraInfo } = notification || {};

  const title = (
    <Typography variant="subtitle2">{notification?.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {noCase(notification?.description || "")}
      </Typography>
    </Typography>
  );

  rendered.title = title;

  if (notification.type === 'SERVICE-CONFIG') {

    const { status } = extraInfo;

    if(status==="SUBMITTED"){
      rendered.icon = ICONS.DOCUMENT_ACTIVE.icon;
      rendered.color = ICONS.DOCUMENT_ACTIVE.color;
    }else{
      rendered.icon = ICONS.DOCUMENT_ACTIVE.icon;
      rendered.color = ICONS.DOCUMENT_ACTIVE.color;
    }
  }


  return rendered;
}


export default memo(NotificationsPopover);