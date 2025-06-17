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
    `ipcserialno = //depreciated in next release\n`, 
    `computerguid = //depreciated in next release\n\n`,
    '//configuration of api endpoints.\n',
    'contenttype = application/json\n\n\n',
    '//Environment for storing logs\n',
    `env = ${env}\n\n`,
    ...Object.entries(extractedConfigs || {}).map(([key, value]) => {
      let toReturn
      if (key === "machine_portal_server") toReturn = `${key} = ${value}\n// machine_portal_server will be depreciated. only environment variable will be used\n\n`
      else toReturn = `${key} = ${value}\n`
      return toReturn
    })
  ];

  return configLines.join('');
}

export default generatePortalKeyConfigFileContent;