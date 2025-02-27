const generatePortalKeyConfigFileContent = (portalKey, serialNo) => {
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
    `howickportalkey = ${portalKey}\n`,
    `machineserialno = ${serialNo}\n`,
    `ipcserialno = \n`, 
    `computerguid = \n`,
    'contenttype = application/json\n\n',
    ...Object.entries(extractedConfigs || {}).map(([key, value]) => `${key} = ${value}\n`)
  ];

  return configLines.join('');
}

export default generatePortalKeyConfigFileContent;