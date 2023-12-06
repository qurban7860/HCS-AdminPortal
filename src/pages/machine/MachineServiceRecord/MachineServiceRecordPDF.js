import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { fDate } from '../../../utils/formatTime';

MachineServiceRecordPDF.propTypes = {
    machineServiceRecord: PropTypes.object
};

export function MachineServiceRecordPDF({machineServiceRecord}) {

    const defaultValues = useMemo(
        () => ({
          customer:                             machineServiceRecord?.customer || null,
          site:                                 machineServiceRecord?.site || null,
          machine:                              machineServiceRecord?.machine || null,
          recordType:                           machineServiceRecord?.recordType || null,
          serviceRecordConfig:                  machineServiceRecord?.serviceRecordConfig?.docTitle	 || '',
          serviceRecordConfigRecordType:        machineServiceRecord?.serviceRecordConfig?.recordType || '',
          serviceDate:                          machineServiceRecord?.serviceDate || null,
          versionNo:                            machineServiceRecord?.versionNo || null,
          decoilers:                            machineServiceRecord?.decoilers ,
          technician:                           machineServiceRecord?.technician || null,
          textBeforeCheckItems:                 machineServiceRecord?.textBeforeCheckItems || '',
          textAfterCheckItems:                  machineServiceRecord?.textAfterCheckItems || '',
          // checkParams:
          headerLeftText:                       machineServiceRecord?.serviceRecordConfig?.header?.leftText || '',
          headerCenterText:                     machineServiceRecord?.serviceRecordConfig?.header?.centerText || '',
          headerRightText:                      machineServiceRecord?.serviceRecordConfig?.header?.rightText || '',
          footerLeftText:                       machineServiceRecord?.serviceRecordConfig?.footer?.leftText || '',
          footerCenterText:                     machineServiceRecord?.serviceRecordConfig?.footer?.centerText || '',
          footerRightText:                      machineServiceRecord?.serviceRecordConfig?.footer?.rightText || '',
          internalComments:                     machineServiceRecord?.internalComments || '',
          serviceNote:                          machineServiceRecord?.serviceNote || '',
          recommendationNote:                   machineServiceRecord?.recommendationNote || '',
          suggestedSpares:                      machineServiceRecord?.suggestedSpares || '',
          internalNote:                         machineServiceRecord?.internalNote || '',
          files:                                machineServiceRecord?.files || [],
          operators:                            machineServiceRecord?.operators || [],
          operatorNotes:                        machineServiceRecord?.operatorNotes || '',
          technicianNotes:                      machineServiceRecord?.technicianNotes ||'',
          isActive:                             machineServiceRecord?.isActive,
          createdAt:                            machineServiceRecord?.createdAt || '',
          createdByFullName:                    machineServiceRecord?.createdBy?.name || '',
          createdIP:                            machineServiceRecord?.createdIP || '',
          updatedAt:                            machineServiceRecord?.updatedAt || '',
          updatedByFullName:                    machineServiceRecord?.updatedBy?.name || '',
          updatedIP:                            machineServiceRecord?.updatedIP || '',
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ machineServiceRecord]
      );

    const decoilers = defaultValues?.decoilers?.map((decoilerMachine) => (`${decoilerMachine?.serialNo ? decoilerMachine?.serialNo : ''}${decoilerMachine?.name ? '-' : ''}${decoilerMachine?.name ? decoilerMachine?.name : ''}`)).join(', ');
    const checkItemLists = machineServiceRecord?.serviceRecordConfig?.checkItemLists || [];
    const operators = machineServiceRecord?.operators?.map(operator => `${operator?.firstName || ''} ${operator?.lastName || ''}`).join(', ');
    
    return (
    <Document>
    <Page>
        {machineServiceRecord?.serviceRecordConfig?.header &&
            <View style={styles.header} fixed>
                <View style={styles.col_30}>
                    <Text style={styles.text_left}>{defaultValues.headerLeftText}</Text>
                </View>
                <View style={styles.col_40}>
                    <Text style={styles.text_center}>{defaultValues.headerCenterText}</Text>
                </View>
                <View style={styles.col_30}>
                    <Text style={styles.text_right}>{defaultValues.headerRightText}</Text>
                </View>
            </View>
        }
        <View style={styles.body}>
            <Text style={styles.title}>Key Details</Text>
            <View style={styles.row}>
                <View style={styles.col_30}>
                    <Text style={styles.lable}>SERVICE DATE</Text>
                    <Text style={[styles.text, styles.bold]}>{fDate(defaultValues?.serviceDate)}</Text>
                </View>
                <View style={styles.col_40}>
                    <Text style={styles.lable}>RECORD TYPE</Text>
                    <Text style={[styles.text, styles.bold]}>{defaultValues?.serviceRecordConfigRecordType}</Text>
                </View>
                
                <View style={styles.col_30}>
                    <Text style={styles.lable}>VERSION</Text>
                    <Text style={[styles.text, styles.bold]}>{defaultValues?.versionNo}</Text>
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.col_30}>
                    <Text style={styles.lable}>Serial No</Text>
                    <Text style={[styles.text, styles.bold]}>{defaultValues?.machine?.serialNo}</Text>
                </View>
                <View style={styles.col_40}>
                    <Text style={styles.lable}>Machine Model</Text>
                    <Text style={[styles.text, styles.bold]}>{defaultValues?.machine?.machineModel?.name}</Text>
                </View>
                
                <View style={styles.col_30}>
                    <Text style={styles.lable}>Decoilers</Text>
                    <Text style={[styles.text, styles.bold]}>{decoilers}</Text>
                </View>
            </View>
            
            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.lable}>Customer</Text>
                    <Text style={[styles.text, styles.bold]}>{defaultValues?.customer?.name || 'Invo Traders 20230717'}</Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.lable}>TECHNICIAN</Text>
                    <Text style={styles.text}>{defaultValues?.technician?.name || ' '}</Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.lable}>TECHNICIAN NOTES</Text>
                    <Text style={styles.text_sm}>{defaultValues?.technicianNotes || ' '}</Text>
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.lable}>TEXT BEFORE CHECK ITEMS</Text>
                    <Text style={styles.text_sm}>{defaultValues?.textBeforeCheckItems}</Text>
                </View>
            </View>
            {/* </Page>
            <Page style={styles.body}> */}
        
            <Text style={styles.title}>Check Items</Text>


            {checkItemLists.length > 0 &&
            checkItemLists.map((row, index) => (
                <View key={`contatiner-${index}`} style={styles.contatiner}>
                        <Text style={styles.text}>{index+1} - {row.ListTitle} ({row.checkItems?.length})</Text>
                        
                        {row?.checkItems?.map((childRow,childIndex) => (
                            <View key={`inner_contatiner-${index}`} style={styles.inner_contatiner}>
                                <Text style={styles.text_sm}><Text style={styles.bold}>{index+1}.{childIndex+1} -</Text> {childRow?.name}</Text>
                                {childRow?.recordValue && 
                                    <>
                                        <Text style={styles.text_sm}><Text style={styles.bold}>Value:</Text>{childRow?.recordValue?.checkItemValue}</Text>
                                        <Text style={styles.text_sm}><Text style={styles.bold}>Comments:</Text>{childRow?.recordValue?.comments}</Text>    
                                    </>
                                }
                            </View>
                        ))}
                        
                </View>
            ))}

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.lable}>TEXT AFTER CHECK ITEMS</Text>
                    <Text style={styles.text_sm}>{defaultValues?.textAfterCheckItems}</Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.lable}>Service Note</Text>
                    <Text style={styles.text_sm}>{defaultValues?.serviceNote}</Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.lable}>RECOMMENDATION  Note</Text>
                    <Text style={styles.text_sm}>{defaultValues?.recommendationNote}</Text>
                </View>
            </View>


            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.lable}>SUGGESTED SPARES</Text>
                    <Text style={styles.text_sm}>{defaultValues?.suggestedSpares}</Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.lable}>Internal SPARES</Text>
                    <Text style={styles.text_sm}>{defaultValues?.internalNote}</Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.lable}>Operators</Text>
                    <Text style={styles.text_sm}>{operators}</Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.lable}>Operators Notes</Text>
                    <Text style={styles.text_sm}>{defaultValues?.operatorNotes}</Text>
                </View>
            </View>
        </View>
        {machineServiceRecord?.serviceRecordConfig?.footer &&
            <View style={styles.footer} fixed>
                <View style={styles.col_30}>
                    <Text style={styles.text_left}>{defaultValues.footerLeftText}</Text>
                </View>
                <View style={styles.col_40}>
                    <Text style={styles.text_center}>{defaultValues.footerCenterText}</Text>
                </View>
                <View style={styles.col_30}>
                    <Text style={styles.text_right}>{defaultValues.footerRightText}</Text>
                </View>
            </View>
        }

    </Page>
  </Document>
)};

    Font.register({
        family: 'Yantramanav',
        fonts: [
        { src: `${origin}/fonts/Yantramanav/Yantramanav-Regular.ttf` }, // font-style: normal, font-weight: normal
        { src: `${origin}/fonts/Yantramanav/Yantramanav-Medium.ttf`, fontWeight: 'medium' },
        { src: `${origin}/fonts/Yantramanav/Yantramanav-Bold.ttf`, fontWeight: 'bold' },
        { src: `${origin}/fonts/Yantramanav/Yantramanav-Black.ttf`, fontWeight: 'black' },
        ]
    });

    Font.register({
        family: 'Arimo',
        fonts: [
            { src: `${origin}/fonts/Arimo/static/Arimo-Regular.ttf` }, // font-style: normal, font-weight: normal
            { src: `${origin}/fonts/Arimo/static/Arimo-Medium.ttf`, fontWeight: 'medium' },
            { src: `${origin}/fonts/Arimo/static/Arimo-Bold.ttf`, fontWeight: 'bold' },
        ]
    });

  const styles = StyleSheet.create({
    body: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingHorizontal: 25,
    },
    header: {
        flexDirection: "row",
        padding:5,
        fontSize: 10,
        fontFamily:'Arimo',
        color:'#c3c3c3',
        marginBottom:5,
        borderBottom:'1px solid #c3c3c3',
    },
    footer: {
        flexDirection: "row",
        padding:5,
        fontSize: 10,
        fontFamily:'Arimo',
        color:'#c3c3c3',
        marginTop:5,
        borderTop:'1px solid #c3c3c3',
    },
    text_left:{
        textAlign:'left'
    },
    text_center:{
        textAlign:'center'
    },
    text_right:{
        textAlign:'right'
    },
    title: {
        fontSize: 14,
        padding:5,
        marginTop:5,
        marginBottom:5,
        color: '#fff',
        backgroundColor:'#2065D1',
        fontFamily:'Yantramanav',
        fontWeight:'black',
        borderRadius:4,
    },
    row: {
        display:'flex',
        flexDirection: "row",
        marginBottom:10,
        marginHorizontal:5,
        width:'100%'
    },
    contatiner: {
        flexDirection: "column",
        marginBottom:5,
        borderRadius:4,
        border:'1px solid #c3c3c3',
        backgroundColor:'#ebebeb',
        padding:4,
    },
    inner_contatiner: {
        flexDirection: "column",
      	borderRadius:4,
        border:'1px solid #c3c3c3',
        backgroundColor:'#fff',
        padding:4,
        marginTop:5
    },
    col:   { width: "100%", flexDirection: "column"},
    col_10: { width: "10%", flexDirection: "column"},
    col_20: { width: "20%", flexDirection: "column"},
    col_30: { width: "30%", flexDirection: "column"},
    col_40: { width: "40%", flexDirection: "column"},
    col_50: { width: "50%", flexDirection: "column"},
    col_60: { width: "60%", flexDirection: "column"},
    col_70: { width: "70%", flexDirection: "column"},
    col_80: { width: "80%", flexDirection: "column"},
    col_90: { width: "90%", flexDirection: "column"},
    lable: {
        fontSize: 10,
        textTransform:'uppercase',
        fontFamily:'Yantramanav',
        fontWeight:'bold',
        color:'gray'
    },
    text: {
        paddingTop:2,
        fontSize: 14,
        fontFamily:'Arimo',
        color:'#212B36'
    },
    text_sm: {
        paddingTop:2,
        fontSize: 10,
        fontFamily:'Arimo',
        color:'#212B36',
    },
    bold: {
        fontWeight:'bold',
    }
  });

//   export MachineServiceRecordPDF;