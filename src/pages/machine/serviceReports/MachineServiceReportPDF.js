import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Document, Page, Image, View, Text, StyleSheet, Font  } from '@react-pdf/renderer';
import { fDate } from '../../../utils/formatTime';

MachineServiceReportPDF.propTypes = {
    machineServiceReport: PropTypes.object,
    machineServiceReportCheckItems: PropTypes.object,
};

export function MachineServiceReportPDF({machineServiceReport, machineServiceReportCheckItems}) {

    const defaultValues = useMemo(
        () => ({
            customer:                           machineServiceReport?.customer || null,
            site:                               machineServiceReport?.site || null,
            machine:                            machineServiceReport?.machine || null,
            reportType:                         machineServiceReport?.reportType || null,
            serviceReportTemplate:              machineServiceReport?.serviceReportTemplate?.reportTitle	 || '',
            serviceReportTemplateReportType:    machineServiceReport?.serviceReportTemplate?.reportType || '',
            serviceReportUID:                   machineServiceReport?.serviceReportUID || "",
            serviceDate:                        machineServiceReport?.serviceDate || null,
            versionNo:                          machineServiceReport?.versionNo || null,
            status:                             machineServiceReport?.status?.name || '',
            approvalStatus:                     machineServiceReport?.currentApprovalStatus || '',
            decoilers:                          machineServiceReport?.decoilers ,
            reportDocs:                         machineServiceReport?.reportDocs || [],
            reportSubmission:                   machineServiceReport?.reportSubmission || '',
            textBeforeCheckItems:               machineServiceReport?.textBeforeCheckItems || '',
            textAfterCheckItems:                machineServiceReport?.textAfterCheckItems || '',
            headerLeftText:                     machineServiceReport?.serviceReportTemplate?.header?.leftText || '',
            headerCenterText:                   machineServiceReport?.serviceReportTemplate?.header?.centerText || '',
            headerRightText:                    machineServiceReport?.serviceReportTemplate?.header?.rightText || '',
            footerLeftText:                     machineServiceReport?.serviceReportTemplate?.footer?.leftText || '',
            footerCenterText:                   machineServiceReport?.serviceReportTemplate?.footer?.centerText || '',
            footerRightText:                    machineServiceReport?.serviceReportTemplate?.footer?.rightText || '',
            technicianNotes:                    Array.isArray( machineServiceReport?.technicianNotes ) && 
                                                machineServiceReport?.technicianNotes?.length > 0 && 
                                                machineServiceReport?.technicianNotes[0] || null,
            internalComments:                   Array.isArray( machineServiceReport?.internalComments ) && 
                                                machineServiceReport?.internalComments?.length > 0 && 
                                                machineServiceReport?.internalComments[0] || null,
            serviceNote:                        Array.isArray( machineServiceReport?.serviceNote ) && 
                                                machineServiceReport?.serviceNote?.length > 0 && 
                                                machineServiceReport?.serviceNote[0] || null,
            recommendationNote:                 Array.isArray( machineServiceReport?.recommendationNote ) && 
                                                machineServiceReport?.recommendationNote?.length > 0 && 
                                                machineServiceReport?.recommendationNote[0] || null,
            suggestedSpares:                    Array.isArray( machineServiceReport?.suggestedSpares ) && 
                                                machineServiceReport?.suggestedSpares?.length > 0 && 
                                                machineServiceReport?.suggestedSpares[0] || null,
            internalNote:                       Array.isArray( machineServiceReport?.internalNote ) && 
                                                machineServiceReport?.internalNote?.length > 0 && 
                                                machineServiceReport?.internalNote[0] || null,
            operatorNotes:                      Array.isArray( machineServiceReport?.operatorNotes ) && 
                                                machineServiceReport?.operatorNotes?.length > 0 && 
                                                machineServiceReport?.operatorNotes[0] || null,
            files:                              machineServiceReport?.files || [],
            isActive:                           machineServiceReport?.isActive,
            createdAt:                          machineServiceReport?.createdAt || '',
            createdByFullName:                  machineServiceReport?.createdBy?.name || '',
            createdIP:                          machineServiceReport?.createdIP || '',
            updatedAt:                          machineServiceReport?.updatedAt || '',
            updatedByFullName:                  machineServiceReport?.updatedBy?.name || '',
            updatedIP:                          machineServiceReport?.updatedIP || '',
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ machineServiceReport]
    );

    const decoilers = useMemo( () =>
        defaultValues?.decoilers?.map((d) => `${d?.serialNo || ''}${d?.name ? ` - ${d?.name}` : ''}`).join(', ') || ''
    ,[ defaultValues?.decoilers ] );

    const fileName = `${defaultValues?.serviceDate?.substring(0,10).replaceAll('-','')}_${defaultValues?.serviceReportTemplateReportType}_${defaultValues?.versionNo}`;

    function getImageUrl(file) {
        if (!file?.src) return '';
        return `data:image/jpg;base64,${file.src}`;
    }
    
    
    return (
        <Document title={fileName} subject='Serevice Report'
            author={defaultValues?.createdByFullName}
            creator='HOWICK'
            keywords={`Version ${defaultValues.versionNo}`}
            producer={defaultValues?.createdByFullName}
        >
    <Page style={styles.page}>
        <Image fixed src={`${origin}/assets/background/pdf-background.jpg`} style={styles.backgroundImage} />
        {/* {(defaultValues.headerLeftText || defaultValues.headerCenterText || defaultValues.headerRightText) &&
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
        } */}
        <Image fixed src={`${origin}/logo/HowickLogo.png`} style={styles.logo} />
        <View style={styles.body}>
            <Text style={styles.title}>Key Details</Text>
            <View style={styles.row}>
                <View style={styles.col_30}>
                    <Text style={styles.lable}>SERVICE DATE</Text>
                    <Text style={[styles.text]}>{fDate(defaultValues?.serviceDate)}</Text>
                </View>
                <View style={styles.col_40}>
                    <Text style={styles.lable}>SERVICE ID</Text>
                    <Text style={[styles.text]}>{ defaultValues?.serviceReportUID }</Text>
                </View>
                <View style={styles.col_30}>
                    <Text style={styles.lable}>STATUS</Text>
                    <Text style={[styles.text]}>{defaultValues.approvalStatus === "PENDING" ? defaultValues.status : defaultValues.approvalStatus}</Text>
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.col_30}>
                    <Text style={styles.lable}>REPORT TYPE</Text>
                    <Text style={[styles.text]}>{defaultValues?.serviceReportTemplateReportType}</Text>
                </View>
                <View style={styles.col_70}>
                    <Text style={styles.lable}>SERVICE REPORT TEMPLATE</Text>
                    <Text style={[styles.text]}>{defaultValues?.serviceReportTemplate}</Text>
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.col_30}>
                    <Text style={styles.lable}>Machine Serial No</Text>
                    <Text style={[styles.text, styles.bold]}>{defaultValues?.machine?.serialNo}</Text>
                </View>
                <View style={styles.col_40}>
                    <Text style={styles.lable}>Machine Name</Text>
                    <Text style={[styles.text]}>{defaultValues?.machine?.name  || "" }</Text>
                </View>
                <View style={styles.col_30}>
                    <Text style={styles.lable}>Machine Model</Text>
                    <Text style={[styles.text]}>{defaultValues?.machine?.machineModel?.name}</Text>
                </View>
                
            </View>

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.lable}>Decoilers</Text>
                    <Text style={[styles.text]}>{decoilers}</Text>
                </View>
            </View>
            
            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.lable}>Customer</Text>
                    <Text style={[styles.text]}>{defaultValues?.customer?.name || 'Invo Traders 20230717'}</Text>
                </View>
            </View>

            { defaultValues?.technicianNotes?.note?.trim() && < >
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.lable}>Technician Note</Text>
                        <Text style={styles.text_sm}>{ defaultValues?.technicianNotes?.note || ''}</Text>
                    </View>
                </View>
                {defaultValues?.technicianNotes?.technicians?.length > 0 && (
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.lable}>Technicians</Text>
                            <Text style={styles.text_sm}>{ defaultValues?.technicianNotes?.technicians?.map( op => `${op?.firstName || ''} ${op?.lastName || ''}`)?.join(', ')}</Text>
                        </View>
                    </View>
                )}
                {defaultValues?.technicianNotes?.operators?.length > 0 && (
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.lable}>Operators</Text>
                            <Text style={styles.text_sm}>{ defaultValues?.technicianNotes?.operators?.map( op => `${op?.firstName || ''} ${op?.lastName || ''}`)?.join(', ')}</Text>
                        </View>
                    </View>
                )}
            </>}

            {   !defaultValues?.reportSubmission && Array.isArray(defaultValues?.reportDocs) &&
                <>
                    <Text style={styles.title}>Reporting Documents</Text>
                    <View style={styles.row}>
                        <View style={styles.image_row} >
                            {defaultValues?.reportDocs?.filter( f => f?.src )?.map((file, fileIndex) => {
                                const imageUrl = getImageUrl(file);
                                return (
                                    ( file?.src && <View key={file?._id} style={styles.image_column}>
                                        { imageUrl && <Image style={{ borderRadius:5, height:"372px", objectFit: "cover" }} src={ imageUrl } />}
                                    </View> || '' )
                                );
                            })}
                        </View>
                    </View>
                </>
            }

            { defaultValues?.reportSubmission && <>

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.text_sm}>{defaultValues?.textBeforeCheckItems}</Text>
                </View>
            </View>
            <Text style={styles.title}>Check Items</Text>

            {machineServiceReportCheckItems?.checkItemLists?.length > 0 &&
                machineServiceReportCheckItems?.checkItemLists?.map((row, index) => (
                <View key={`contatiner-${index}`} style={styles.contatiner}>
                        <Text style={styles.text}>{index+1} - {row.ListTitle} ({row.checkItems?.length})</Text>
                        {row?.checkItems?.map((childRow,childIndex) => (
                            <View key={`inner_contatiner-${index}`} style={styles.inner_contatiner}>
                                <Text style={styles.text_sm}><Text style={styles.bold}>{index+1}.{childIndex+1} -</Text> {childRow?.name}</Text>
                                {childRow?.reportValue && 
                                    <>
                                        <Text style={styles.text_sm}><Text style={styles.bold}>Value:</Text>{childRow?.reportValue?.checkItemValue}</Text>
                                        <Text style={styles.text_sm}><Text style={styles.bold}>Comments:</Text>{childRow?.reportValue?.comments}</Text>    
                                    </>
                                }
                                {(childRow?.reportValue?.files?.length > 0 || childRow?.historicalData?.some(data => data.files?.length > 0)) && (
                                    <View key={`inner_image_container-${index}`} style={styles.image_row}>
                                        {[
                                        ...(childRow?.reportValue?.files || []),
                                        ...(childRow?.historicalData ?? []).flatMap(data => data?.files || [] )
                                        ].filter( f => f?.src )?.map((file, fileIndex) => {
                                            const imageUrl = getImageUrl(file);
                                            return ( file?.src && 
                                                <View key={file?._id || `file-${fileIndex}`} style={styles.image_column}>
                                                    {imageUrl && (
                                                        <Image 
                                                            style={{ borderRadius: 5, height: "372px", objectFit: "cover" }} 
                                                            src={imageUrl} 
                                                        />
                                                    )}
                                                </View>
                                            || '' );
                                        })}
                                    </View>
                                )}
                            </View>
                        ))}
                        
                </View>
            ))}

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.text_sm}>{defaultValues?.textAfterCheckItems}</Text>
                </View>
            </View>

            </>}

            { defaultValues?.internalComments?.note?.trim() && < >
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.lable}>Technician Note</Text>
                        <Text style={styles.text_sm}>{ defaultValues?.internalComments?.note || ''}</Text>
                    </View>
                </View>
                {defaultValues?.internalComments?.technicians?.length > 0 && (
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.lable}>Technicians</Text>
                            <Text style={styles.text_sm}>{ defaultValues?.internalComments?.technicians?.map( op => `${op?.firstName || ''} ${op?.lastName || ''}`)?.join(', ')}</Text>
                        </View>
                    </View>
                )}
                {defaultValues?.internalComments?.operators?.length > 0 && (
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.lable}>Operators</Text>
                            <Text style={styles.text_sm}>{ defaultValues?.internalComments?.operators?.map( op => `${op?.firstName || ''} ${op?.lastName || ''}`)?.join(', ')}</Text>
                        </View>
                    </View>
                )}
            </>}

            { defaultValues?.serviceNote?.note?.trim() && < >
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.lable}>Technician Note</Text>
                        <Text style={styles.text_sm}>{ defaultValues?.serviceNote?.note || ''}</Text>
                    </View>
                </View>
                {defaultValues?.serviceNote?.technicians?.length > 0 && (
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.lable}>Technicians</Text>
                            <Text style={styles.text_sm}>{ defaultValues?.serviceNote?.technicians?.map( op => `${op?.firstName || ''} ${op?.lastName || ''}`)?.join(', ')}</Text>
                        </View>
                    </View>
                )}
                {defaultValues?.serviceNote?.operators?.length > 0 && (
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.lable}>Operators</Text>
                            <Text style={styles.text_sm}>{ defaultValues?.serviceNote?.operators?.map( op => `${op?.firstName || ''} ${op?.lastName || ''}`)?.join(', ')}</Text>
                        </View>
                    </View>
                )}
            </>}

            { defaultValues?.recommendationNote?.note?.trim() && < >
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.lable}>RECOMMENDATION  Note</Text>
                        <Text style={styles.text_sm}>{ defaultValues?.recommendationNote?.note || ''}</Text>
                    </View>
                </View>
                {defaultValues?.recommendationNote?.technicians?.length > 0 && (
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.lable}>Technicians</Text>
                            <Text style={styles.text_sm}>{ defaultValues?.recommendationNote?.technicians?.map( op => `${op?.firstName || ''} ${op?.lastName || ''}`)?.join(', ')}</Text>
                        </View>
                    </View>
                )}
                {defaultValues?.recommendationNote?.operators?.length > 0 && (
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.lable}>Operators</Text>
                            <Text style={styles.text_sm}>{ defaultValues?.recommendationNote?.operators?.map( op => `${op?.firstName || ''} ${op?.lastName || ''}`)?.join(', ')}</Text>
                        </View>
                    </View>
                )}
            </>}

            { defaultValues?.suggestedSpares?.note?.trim() && < >
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.lable}>SUGGESTED SPARES</Text>
                        <Text style={styles.text_sm}>{ defaultValues?.suggestedSpares?.note || ''}</Text>
                    </View>
                </View>
                {defaultValues?.suggestedSpares?.technicians?.length > 0 && (
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.lable}>Technicians</Text>
                            <Text style={styles.text_sm}>{ defaultValues?.suggestedSpares?.technicians?.map( op => `${op?.firstName || ''} ${op?.lastName || ''}`)?.join(', ')}</Text>
                        </View>
                    </View>
                )}
                {defaultValues?.suggestedSpares?.operators?.length > 0 && (
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.lable}>Operators</Text>
                            <Text style={styles.text_sm}>{ defaultValues?.suggestedSpares?.operators?.map( op => `${op?.firstName || ''} ${op?.lastName || ''}`)?.join(', ')}</Text>
                        </View>
                    </View>
                )}
            </>}

            { defaultValues?.internalNote?.note?.trim() && < >
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.lable}>INTERNAL NOTE</Text>
                        <Text style={styles.text_sm}>{ defaultValues?.internalNote?.note || ''}</Text>
                    </View>
                </View>
                {defaultValues?.internalNote?.technicians?.length > 0 && (
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.lable}>Technicians</Text>
                            <Text style={styles.text_sm}>{ defaultValues?.internalNote?.technicians?.map( op => `${op?.firstName || ''} ${op?.lastName || ''}`)?.join(', ')}</Text>
                        </View>
                    </View>
                )}
                {defaultValues?.internalNote?.operators?.length > 0 && (
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.lable}>Operators</Text>
                            <Text style={styles.text_sm}>{ defaultValues?.internalNote?.operators?.map( op => `${op?.firstName || ''} ${op?.lastName || ''}`)?.join(', ')}</Text>
                        </View>
                    </View>
                )}
            </>}

            { defaultValues?.operatorNotes?.note?.trim() && < >
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.lable}>Operators Notes</Text>
                        <Text style={styles.text_sm}>{ defaultValues?.operatorNotes?.note || ''}</Text>
                    </View>
                </View>
                {defaultValues?.operatorNotes?.technicians?.length > 0 && (
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.lable}>Technicians</Text>
                            <Text style={styles.text_sm}>{ defaultValues?.operatorNotes?.technicians?.map( op => `${op?.firstName || ''} ${op?.lastName || ''}`)?.join(', ')}</Text>
                        </View>
                    </View>
                )}
                {defaultValues?.operatorNotes?.operators?.length > 0 && (
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.lable}>Operators</Text>
                            <Text style={styles.text_sm}>{ defaultValues?.operatorNotes?.operators?.map( op => `${op?.firstName || ''} ${op?.lastName || ''}`)?.join(', ')}</Text>
                        </View>
                    </View>
                )}
            </>}

            { defaultValues?.reportSubmission && Array.isArray(defaultValues?.files) && defaultValues?.files?.filter( f => f?.src )?.length > 0 && <>
                <Text style={styles.title}>Documents / Images</Text>
                <View style={styles.row}>
                    <View style={styles.image_row} >
                        {defaultValues?.files?.filter( f => f?.src )?.map((file, fileIndex) => {
                            const imageUrl = getImageUrl(file);
                            return (
                                ( file?.src && <View key={file?._id} style={styles.image_column}>
                                    { imageUrl && <Image style={{ borderRadius:5, height:"372px", objectFit: "cover" }} src={ imageUrl } />}
                                </View> || '' )
                            );
                        })}
                    </View>
                </View>
            </>}
        </View>

        <View style={styles.footer} fixed>
            <Text style={styles.footer_line_1} fixed><Text style={styles.bold}>www.howickltd.com</Text> P: +64 9 534 5569 | 117 Vincent Street, Howick, Auckland, New Zealand</Text>
            {/* {(defaultValues.footerLeftText || defaultValues.footerCenterText || defaultValues.footerRightText) &&
                <View style={styles.footer_line_2}>
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
            } */}
        </View>

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
    page:{
        paddingTop:10,
        paddingBottom:25,
    },
    body: {
        paddingHorizontal: 25,
    },
    header: {
        flexDirection: "row",
        position:'absolute',
        top:0,
        fontSize: 10,
        paddingHorizontal:10,
        paddingVertical:10,
        fontFamily:'Arimo',
        backgroundColor:'#2065D1', 
        color:'#fff',
    },
    footer: {
        position:'absolute',
        bottom:0,
        fontSize: 10,
        paddingHorizontal:10,
        fontFamily:'Arimo',
        backgroundColor:'#2065D1', 
        color:'#fff',
        width:'100%'
    },
    footer_line_1:{
        display:'flex',
        flexDirection: "row",
        alignSelf:'center',
        paddingVertical:5,
    },
    footer_line_2:{
        display:'flex',
        flexDirection: "row",
        paddingVertical:5,
        width:'100%',
        borderTop:'1px solid #fff'
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '110%',
    },
    logo: {
        width: '150px',
        alignSelf:'flex-start',
        marginHorizontal:25,
        marginVertical:10
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
        paddingHorizontal:0,
        width:'100%',
        columnGap:5,
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
    image_row: {
        display:'flex',
        flexDirection: "row",
        marginTop:2,
        paddingHorizontal:0,
        width:'100%',
        flexWrap: 'wrap',
    },
    image_column:{width: "100%", flexDirection: "column", paddingHorizontal: 1, paddingTop: 1, paddingBottom: 5},
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
        backgroundColor:'lightgray',
        paddingHorizontal:2,
        paddingVertical:2,
        borderRadius:3,
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
