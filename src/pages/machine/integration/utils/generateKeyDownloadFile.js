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
    '//Environment like dev/test/prod , default is prod\n',
    `env = ${env}\n`,
    '//contenttype is used for header\n',
    'contenttype = application/json\n',
    '//endpoint configuration\n',
    ...Object.entries(extractedConfigs || {}).map(([key, value]) => `${key} = ${value}\n`)
  ];

  return configLines.join('');
}

export default generatePortalKeyConfigFileContent;