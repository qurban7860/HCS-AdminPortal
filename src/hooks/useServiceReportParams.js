import { useLocation } from 'react-router-dom';

export function useServiceReportParams() {
  const { pathname } = useLocation();

  let machineId = null;
  let id = null;

  if (pathname.includes('serviceReports')) {
    const pathSegments = pathname.split('/');
    const serviceReportsIndex = pathSegments.indexOf('serviceReports');

    if (serviceReportsIndex > 0) {
      machineId = pathSegments[serviceReportsIndex - 1];
      id = pathSegments[serviceReportsIndex + 1];
    }
  }

  return { machineId, id };
}
