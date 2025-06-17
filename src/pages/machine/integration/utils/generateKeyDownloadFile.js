const generatePortalKeyConfigFileContent = (portalKey, serialNo) => {
  const configs = JSON.parse(localStorage.getItem('configurations'));
  const env = (process.env.REACT_APP_ENV || 'prod').toLowerCase();
  const extractedConfigs = configs?.reduce((acc, config) => {
    if (config.type === "MACHINE-INTEGRATION") {
      acc[config.name] = config.value;
    }
    return acc;
  }, {});
  const configLines = [
    `howickportalkey = ${portalKey}\n`,
    `machineserialno = ${serialNo}\n\n`,
    'contenttype = application/json\n\n',
    `env = ${env}\n\n`,
    ...Object.entries(extractedConfigs || {}).map(([key, value]) => {
      let toReturn
      if (key === "machine_portal_server") toReturn = ``
      else toReturn = `${key} = ${value}\n`
      return toReturn
    })
  ];

  return configLines.join('');
}

export default generatePortalKeyConfigFileContent;