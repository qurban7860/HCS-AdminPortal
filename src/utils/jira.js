
export const getJiraStatusSX=(fields)=>{

  const jiraStatus = {background:'#919eab29', color:'#000'}
  
  if(fields?.status?.statusCategory?.colorName === 'blue-gray'){
    jiraStatus.background='#919eab29';
    jiraStatus.color='#000';
  }

  if(fields?.status?.statusCategory?.colorName === 'green'){
    jiraStatus.background='#1f8524';
    jiraStatus.color='#fff';
  }

  if(fields?.status?.statusCategory?.colorName === 'yellow'){
    jiraStatus.background='#2b64cd';
    jiraStatus.color='#fff';
  }

  return jiraStatus;
}