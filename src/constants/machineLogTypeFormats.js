export const machineLogTypeFormats = [
  {
    type: "ERP",
    disabled: false,
    versions: ["v1.5.X", "v1.4.X", "v1.1.66"],
    formats: {
      "v1.1.66": ["date", "operator", "coilBatchName", "ccThickness", "coilLength", "frameSet", "componentLabel", "webWidth", "flangeHeight", "profileShape", "componentLength", "waste", "time"],
      "v1.4.X": ["date", "operator", "coilBatchName", "ccWidth", "coilThickness", "coilLength", "frameSet", "componentLabel", "webWidth", "flangeHeight", "profileShape", "componentLength", "waste", "time", "componentWeight"],
      "v1.5.X": ["timestamp", "operator", "coilBatchName", "coilWidth", "coilThickness", "coilLength", "frameSet", "componentLabel", "flangeHeight", "webWidth", "profileShape", "componentLength", "waste", "time", "mode", "measurementUnit", "componentWeight", "lineSpeed", "componentGUID", "componentType"],
    },
    tableColumns: [
      { id: 'date', label: 'Date', alwaysShow: true, defaultShow: true },
      { id: 'machineSerialNo', label: 'Machine', alwaysShow: true, defaultShow: true, page: 'allMachineLogs', searchable: true },
      { id: '_id', label: 'Log ID', searchable: true },
      { id: 'componentLabel', label: 'Label', defaultShow: true, tooltip:true, tooltipText: 'Component Label', searchable: true },
      { id: 'frameSet', label: 'Frame Set', defaultShow: true, searchable: true },
      { id: 'componentLength', label: 'Length (m)', alwaysShow: true, tooltip: true, tooltipText:'Produced Length', defaultShow: true, searchable: true, numerical: true, convertToM: true },
      { id: 'waste', label: 'Waste (m)', alwaysShow: true, defaultShow: true, searchable: true, numerical: true, convertToM: true },
      { id: 'coilLength', label: 'Rem. Coil (m)', defaultShow: true, tooltip: true, tooltipText: 'Remaining Coil Length', searchable: true, numerical: true, convertToM: true },
      { id: 'flangeHeight', label: 'Flange (mm)', defaultShow: true, tooltip: true, tooltipText:'Flange Height', searchable: true, numerical: true },
      { id: 'webWidth', label: 'Web (mm)', defaultShow: true, tooltip: true, tooltipText:'Web Width', searchable: true, numerical: true},
      { id: 'profileShape', label: 'P.S', defaultShow: true, tooltip: true, tooltipText:'Profile Shape', searchable: true },
      { id: 'componentWeight', label: 'Weight', searchable: true, tooltip: true, tooltipText:'Component Weight', numerical: true },
      { id: 'coilBatchName', label: 'C.Batch', tooltip: true, tooltipText: 'Coil Batch Name', searchable: true },
      { id: 'coilThickness', label: 'C.Thickness (mm)', searchable: true, tooltip:true, tooltipText:'Coil Thickness', numerical: true },
      { id: 'coilWidth', label: 'C.Width (mm)', searchable: true, tooltip:true, tooltipText: 'Coil Width', numerical: true },
      { id: 'lineSpeed', label: 'L.S', searchable: true, tooltip: true, tooltipText: 'Line Speed' },
      { id: 'mode', label: 'Mode', searchable: true },
      { id: 'time', label: 'Time (s)', numerical: true, convertToM: true },
      { id: 'operator', label: 'Operator', searchable: true },
      { id: 'componentGUID', label: 'GUID', searchable: true, tooltip: true, tooltipText: 'Component GUID' },
      { id: 'componentType', label: 'Type', searchable: true, tooltip:true, tooltipText:'Component Type', defaultShow: true },
    ],
    numericalLengthValues: ["coilLength", "coilWidth", "coilThickness", "flangeHeight", "webWidth", "componentLength", "waste" ]
  },
  {
    type: "PRODUCTION",
    disabled: true,
    versions: ["v1.4.5"],
    formats: {
      "v1.4.5": ["date", "frameSet", "componentName", "componentLength", "flangeHeight", "webWidth", "unitOfMeasurement", "muClassifier"],
    },
    tableColumns: [
      { id: 'date', label: 'Date', alwaysShow: true, defaultShow: true },
      { id: 'frameSet', label: 'Frame Set', alwaysShow: true, defaultShow: true },
      { id: 'componentName', label: 'Component Name', defaultShow: true },
      { id: 'componentLength', label: 'Length', defaultShow: true, numerical: true },
      { id: 'waste', label: 'Waste', alwaysShow: true, defaultShow: true, numerical: true },
      { id: 'flangeHeight', label: 'Flange Height', numerical: true },
      { id: 'webWidth', label: 'Web Width', numerical: true },
      { id: 'muClassifier', label: 'MU Classifier' },
    ],
    numericalLengthValues: ["flangeHeight", "webWidth", "componentLength", "waste" ]
  },
  {
    type: "COIL",
    disabled: true,
    versions: ["v1.4.5", "v1.1.X"],
    formats: {
      "v1.1.X": ["date", "coilBatchName", "coilLength", "coilLengthUnit", "coilThickness", "coilThicknessUnit", "coilWidth", "coilWeight", "coilDensity"],
      "v1.4.5": ["date", "coilBatchName", "coilLength", "coilLengthUnit", "coilThickness", "coilThicknessUnit", "coilWidth", "coilWeight", "coilDensity", "operator"],
    },
    tableColumns: [
      { id: 'date', label: 'Date', alwaysShow: true, defaultShow: true },
      { id: 'coilBatchName', label: 'Coil Batch Name', alwaysShow: true, defaultShow: true },
      { id: 'coilLength', label: 'Coil Length', alwaysShow: true, defaultShow: true, numerical: true },
      { id: 'coilThickness', label: 'Coil Thickness', defaultShow: true, numerical: true },
      { id: 'coilWeight', label: 'Coil Weight', defaultShow: true, numerical: true },
      { id: 'coilWidth', label: 'Coil Width', numerical: true },
      { id: 'coilDensity', label: 'Coil Density', numerical: true },
      { id: 'operator', label: 'Oerator' },
    ],
    numericalLengthValues: ["coilLength", "coilWidth", "coilThickness" ]
  },
  {
    type: "TOOLCOUNT",
    disabled: true,
  },
  {
    type: "WASTE",
    disabled: true,
  },
]

export const machineLogGraphTypes = [
  {
    name: "Meterage Produced Graph",
    key: "length_and_waste"
  },
  {
    name: "Production Rate (m/hr)",
    key: "productionRate"
  }
]