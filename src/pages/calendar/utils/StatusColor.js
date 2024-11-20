
export const StatusColor = (status) => {
  switch (status) {
    case 'To Do':
      return '#FBC02D';
    case 'In Progress':
      return '#1E88E5';
    case 'Done':
      return '#388E3C';
    case 'Cancelled':
      return '#D32F2F';
    default:
      return '';
  }
};
