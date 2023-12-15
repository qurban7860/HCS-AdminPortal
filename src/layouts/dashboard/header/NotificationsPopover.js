import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import { useState } from 'react';
// @mui
import {
  Box,
  Stack,
  List,
  Badge,
  Button,
  Avatar,
  // Tooltip,
  Divider,
  // IconButton,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
  Tooltip,
  IconButton,
} from '@mui/material';
// utils
import { fDate, fToNow } from '../../../utils/formatTime';

// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import MenuPopover from '../../../components/menu-popover';
import { IconButtonAnimate } from '../../../components/animate';
import { useWebSocketContext } from '../../../auth/WebSocketContext';
import { ICONS } from '../../../constants/icons/default-icons';

// ----------------------------------------------------------------------

export const userId = localStorage.getItem('userId');

export default function NotificationsPopover() {
  const [ openPopover, setOpenPopover ] = useState(null);
  const { notifications, sendJsonMessage } = useWebSocketContext();
  const totalUnRead = notifications && notifications.filter((item) => item?.readBy.includes(userId) === false).length;

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleMarkAsRead = (id) => {
    sendJsonMessage({eventName:'markAsRead',_id:id});
    sendJsonMessage({eventName:'getNotification'});
  }
  
  const handleMarkAllAsRead = () => {
    sendJsonMessage({eventName:'markAsRead'});
    sendJsonMessage({eventName:'getNotification'});
  };

  return (
    <>
      <IconButtonAnimate color={openPopover ? 'primary' : 'default'} onClick={handleOpenPopover} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={totalUnRead} color="error" ><Iconify icon={openPopover ? 'mdi:bell-ring' : 'mdi:bell'} /></Badge>
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 360, p: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead || 'no'} unread {totalUnRead>1?"messages":"message"}
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        {notifications && notifications?.length>0 && 
          <>
          <Divider sx={{ borderStyle: 'solid' }} />
          <Scrollbar sx={{ maxHeight: 300 }}>
            <List
              disablePadding
              subheader={
                <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                  {!notifications && 'Loading...' ? 'No notifications' : 'NEW'}
                </ListSubheader>
              }
            >
              {notifications.map((notification) => (
                <NotificationItem handleMarkAsRead={handleMarkAsRead} key={notification?._id} notification={notification} />
              ))}
            </List>
          </Scrollbar>
          <Divider sx={{ borderStyle: 'solid' }} />
          {!notifications && 'Loading...' ? (
            ''
          ) : (
            <Box sx={{ p: 1 }}><Button fullWidth disableRipple>View All</Button></Box>
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
  handleMarkAsRead:PropTypes.func
};

function NotificationItem({ handleMarkAsRead, notification }) {
  const { title, icon, color } = renderNotification(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(!notification?.readBy?.includes(userId) && {
          bgcolor: 'action.selected',
        }),
      }}
      onClick={()=> handleMarkAsRead(notification?._id)}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.primary'}}><Iconify icon={icon} color={color} width={30} /></Avatar>
      </ListItemAvatar>

      <ListItemText
        disableTypography
        primary={title}
        secondary={
          <Stack direction="row" sx={{ mt: 0.5, typography: 'caption', color: 'text.disabled' }}>
            <Iconify icon="eva:clock-fill" width={16} sx={{ mr: 0.5 }} />
            <Typography variant="caption">{fToNow(fDate(notification.createdAt))}</Typography>
          </Stack>
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
    <Typography variant="subtitle2">
      {notification?.title}
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
