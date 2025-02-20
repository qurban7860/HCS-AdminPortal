const generatePortalKeyConfigFileContent = (portalKey, serialNo) => {
  const configs = JSON.parse(localStorage.getItem('configurations'));
  const requiredKeys = [
    'machine_portal_server',
    'synch_macine_connection_endpoint',
    'post_machine_logs_endpoint',
    'post_machine_config_endpoint'
  ];

  const extractedConfigs = configs?.reduce((acc, config) => {
    if (requiredKeys.includes(config.name)) {
      acc[config.name] = config.value;
    }
    return acc;
  }, {});

  return `x-howickportalkey = ${portalKey}\nx-machineserialno = ${serialNo}\n\nx-ipcserialno = find_in_hmi_software_application\nx-computerguid = find_in_hmi_software_application\n\nmachine_portal_server = ${extractedConfigs?.machine_portal_server}\nsynch_macine_connection_endpoint = ${extractedConfigs?.synch_macine_connection_endpoint}\npost_machine_logs_endpoint = ${extractedConfigs?.post_machine_logs_endpoint}\npost_machine_config_endpoint = ${extractedConfigs?.post_machine_config_endpoint}`;
}

export default generatePortalKeyConfigFileContent;