const generatePortalKeyConfigFileContent = (portalKey, serialNo, ipcSerialNo = '', computerGuid = '') => {
  const configs = JSON.parse(localStorage.getItem('configurations'));
  // eslint-disable-next-line no-debugger
  debugger;
  const extractedConfigs = configs?.reduce((acc, config) => {
    if (config.type === "MACHINE-INTEGRATION") {
      acc[config.name] = config.value;
    }
    return acc;
  }, {});
  // eslint-disable-next-line no-debugger
  debugger;
  const configLines = [
    `x_howickportalkey = ${portalKey}\n`,
    `x_machineserialno = ${serialNo}\n`,
    `x_ipcserialno = ${ipcSerialNo}\n`, 
    `x_computerguid = ${computerGuid}\n`,
    'x_contentType = application/json\n\n',
    ...Object.entries(extractedConfigs || {}).map(([key, value]) => `${key} = ${value}\n`)
  ];

  return configLines.join('');
}

export default generatePortalKeyConfigFileContent;