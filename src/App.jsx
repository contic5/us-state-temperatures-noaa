import { useState,useEffect } from 'react'
import './App.css'
import DataElement from './USStateData.jsx';
import SummaryElement from './SummaryElement.jsx';

import { get_excel_data,get_unique_values } from './get_excel_data.js'

const file_name="(new) US State Temperatures NOAA Rewritten.xlsx";

function App() 
{
  function handleDataElements()
  {
    let filtered_data=[...data];
    if(target_us_state!="*")
    {
      filtered_data=filtered_data.filter((item) => item.state==target_us_state);
    }

    if(target_month&&target_month!="*")
    {
      filtered_data=filtered_data.filter((item) => item.month==target_month);
    }

    if(start_year&&start_year!="*")
    {
      filtered_data=filtered_data.filter((item) => item.year>=start_year);
    }
    if(end_year&&end_year!="*")
    {
      filtered_data=filtered_data.filter((item) => item.year<=end_year);
    }

    const summary_element_temp=<SummaryElement items={filtered_data}></SummaryElement>;
    setSummaryElement(summary_element_temp);

    console.log(sort_column+" "+sort_direction);
    if(sort_direction=="ASC")
    {
      if(sort_column=="state")
      {
        filtered_data.sort((a,b) => a[sort_column].localeCompare(b[sort_column]));
      }
      else
      {
        filtered_data.sort((a,b) => parseInt(a[sort_column])-parseInt(b[sort_column]));
      }
    }
    else
    {
      if(sort_column=="state")
      {
        filtered_data.sort((a,b) => b[sort_column].localeCompare(a[sort_column]));
      }
      else
      {
        filtered_data.sort((a,b) => parseInt(b[sort_column])-parseInt(a[sort_column]));
      }
    }

    let display_data=filtered_data.slice((page_number-1)*100,page_number*100);
    const data_elements_temp=display_data.map(item=>
      <DataElement item={item} key={item.ID}></DataElement>
    );
    setDataElements(data_elements_temp);
  }
  function handleTargetUSState(e)
  {
    const new_target_us_state=e.target.value;
    setPageNumber(1);
    setTarget_US_State(new_target_us_state);
  }
  function handleTargetMonth(e)
  {
    const new_target_month=e.target.value;
    setPageNumber(1);
    setTargetMonth(new_target_month);
  }
  function handleStartYear(e)
  {
    const new_start_year=e.target.value;
    setPageNumber(1);
    setStartYear(new_start_year);
  }
  function handleEndYear(e)
  {
    const new_end_year=e.target.value;
    setPageNumber(1);
    setEndYear(new_end_year);
  }
  function handlePageNumber(e)
  {
    const new_page_number=e.target.value;
    setPageNumber(new_page_number);
  }
  function handleSortData(sort_column,sort_direction)
  {
    setSortColumn(sort_column);
    setSortDirection(sort_direction);
    setPageNumber(1);
  }

  //The main data values
  const [dataElements,setDataElements]=useState([]);
  const [summaryElement,setSummaryElement]=useState(null);
  const [data,setData]=useState(null);

  const [target_us_state,setTarget_US_State]=useState("*");
  const [us_state_option_elements,setUS_State_Option_Elements]=useState([]);

  const [target_month,setTargetMonth]=useState("*");
  const [month_option_elements,setMonth_Option_Elements]=useState([]);

  const [start_year,setStartYear]=useState(1895);
  const [end_year,setEndYear]=useState(2024);
  const [year_option_elements,setYear_Option_Elements]=useState([]);

  const [page_number,setPageNumber]=useState(1);

  const [sort_column,setSortColumn]=useState("ID");
  const [sort_direction,setSortDirection]=useState("ASC");

  const month_names=["ERROR","January","February","March","April","May","June","July","August","September","October","November","December"];

  useEffect(()=>
  {
    get_excel_data(file_name).then((excel_data) =>
    {
        console.log(excel_data);
        setData(excel_data);
    });
  },[]);

  useEffect(()=>
  {
    if(data&&data.length>0)
    {
      get_unique_values(data,"state").then((unique_us_states) =>
      {
          console.log(unique_us_states);

          let us_state_option_elements_temp=unique_us_states.map(unique_us_state => (
          <option key={unique_us_state} value={unique_us_state}>{unique_us_state}</option>
          ));
          us_state_option_elements_temp.splice(0,0,<option key="*" value="*">Any</option>)
          setUS_State_Option_Elements(us_state_option_elements_temp);
      });

      get_unique_values(data,"month").then((unique_months) =>
      {
          console.log(unique_months);
  
          let month_elements_temp=unique_months.map(unique_month => (
          <option key={unique_month} value={unique_month}>{month_names[unique_month]}</option>
          ));
          month_elements_temp.splice(0,0,<option key="*" value="*">Any</option>)
          setMonth_Option_Elements(month_elements_temp);
      });

      get_unique_values(data,"year").then((unique_years) =>
      {
          console.log(unique_years);

          let year_elements_temp=unique_years.map(unique_year => (
          <option key={unique_year} value={unique_year}>{unique_year}</option>
          ));
          year_elements_temp.splice(0,0,<option key="*" value="*">Any</option>)
          setYear_Option_Elements(year_elements_temp);
      });
    }
  },[data]);

  useEffect(()=>
  {
    if(data&&data.length>0)
    {
      handleDataElements();
    }
  },[data,target_month,start_year,end_year,target_us_state,page_number,sort_column,sort_direction]);

  const shared_header=(
    <>
    <h1>US State Temperature</h1>
      <h2>Notes</h2>
      <p>This dataset contains average monthly temperatures for each American State from 1895 to 2024. It also contains the average monthly temperature from 1901 to 2000 for each state. This century long average should give an idea of a State's typical temperatures.</p>
      <h2>Works Cited</h2>
      <a href="https://www.ncei.noaa.gov/pub/data/cirs/climdiv/climdiv-tmpcst-v1.0.0-20250404">https://www.ncei.noaa.gov/pub/data/cirs/climdiv/climdiv-tmpcst-v1.0.0-20250404
    </a>
    </>
  );

  if(!data)
  {
    return (
      <>
      {shared_header}
      <h2>Loading Data</h2>
      </>
    )
  }

  return (
    <>
    {shared_header}
    <div id="sort_div">
    <table>
    <thead><tr>
    <th>ID</th>
    <th>Year</th>
    <th>Month</th>
    <th>US State</th>
    </tr></thead>
    <tbody><tr>
    <td>
    <button onClick={()=>handleSortData("ID","ASC")}>ID ASC</button>
    <button onClick={()=>handleSortData("ID","DESC")}>ID DESC</button>
    </td>
    <td>
    <button onClick={()=>handleSortData("year","ASC")}>Year ASC</button>
    <button onClick={()=>handleSortData("year","DESC")}>Year DESC</button>
    </td>
    <td>
    <button onClick={()=>handleSortData("month","ASC")}>Month ASC</button>
    <button onClick={()=>handleSortData("month","DESC")}>Month DESC</button>
    </td>
    <td>
    <button onClick={()=>handleSortData("state","ASC")}>State ASC</button>
    <button onClick={()=>handleSortData("state","DESC")}>State DESC</button>
    </td>
    </tr></tbody>
    </table>
    </div>

    <div id="inputs_div">
    <div className="input_div">
    <label htmlFor="page_number">Page Number</label>
    <input type="number" value={page_number} onChange={handlePageNumber}></input>
    </div>

    <div className="input_div">
    <label htmlFor="target_us_state">Target State</label>
    <select id="target_us_state" value={target_us_state} onChange={handleTargetUSState}>
    {us_state_option_elements}
    </select>
    </div>

    <div className="input_div">
    <label htmlFor="target_month">Target Month</label>
    <select id="target_month" value={target_month} onChange={handleTargetMonth}>
    {month_option_elements}
    </select>
    </div>

    <div className="input_div">
    <label htmlFor="start_year">Start Year</label>
    <select id="start_year" value={start_year} onChange={handleStartYear}>
    {year_option_elements}
    </select>

    <label htmlFor="end_year">End Year</label>
    <select id="end_year" value={end_year} onChange={handleEndYear}>
    {year_option_elements}
    </select>
    </div>
    </div>

    {summaryElement}
    <div>{dataElements}</div>
    </>
  )
}

export default App;