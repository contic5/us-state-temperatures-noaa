import { useState,useEffect } from 'react'
import './App.css'
import DataElement from './StateData.jsx';

import get_excel_data from './get_excel_data.js'

const file_name="average_monthly_temperature_by_state_1950_2022.xlsx";

function LoadExcelTemplate() 
{
  function handleDataElements()
  {
    const res=data.map(item=>
      <DataElement item={item} key={item.ID}></DataElement>
    );
    setDataElements(res);
  }
  //The main data values
  const [dataElements,setDataElements]=useState([]);
  const [data,setData]=useState(null);

  useEffect(()=>
  {
    get_excel_data(file_name).then(setData);
  },[]);

  useEffect(()=>
  {
    if(data&&data.length>0)
    {
      handleDataElements();
    }
  },[data]);

  if(!data)
  {
    return (
      <>
      <h1>Loading Data</h1>
      </>
    )
  }
  return (
    <>
    <h1>Data Loaded</h1>
    <div>{dataElements}</div>
    </>
  )
}

export default LoadExcelTemplate
