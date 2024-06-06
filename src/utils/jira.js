
export const getJiraStatusSX=(fields)=> getJiraStatusChipColor(fields?.status?.statusCategory?.colorName);

export const getJiraStatusChipColor=(colorName)=>{

  const jiraStatus = {background:'#919eab29', color:'#000'}
  
  if(colorName === 'blue-gray'){
    jiraStatus.background='#919eab29';
    jiraStatus.color='#000';
  }

  if(colorName === 'green'){
    jiraStatus.background='#1f8524';
    jiraStatus.color='#fff';
  }

  if(colorName === 'yellow'){
    jiraStatus.background='#2b64cd';
    jiraStatus.color='#fff';
  }

  return jiraStatus;
}