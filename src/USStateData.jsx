import './USStateData.css';

function USStateData(props)
{
    function round(number,places)
    {
        number=number*Math.pow(10,places);
        number=Math.round(number);
        number=number/Math.pow(10,places);
        return number;
    }
    const item=props.item;
    const difference=round(item.average_temp-item.monthly_mean_from_1901_to_2000,2);

    const month_names=["ERROR","January","February","March","April","May","June","July","August","September","October","November","December"];

    return(
        <>
        <div className="StateData">
        <h2>{item.state} {month_names[item.month]} {item.year}</h2>
        <h3>Monthly Average Temperature: {item.average_temp}</h3>
        <h3>Historical Monthly Average Temperature: {item.monthly_mean_from_1901_to_2000}</h3>
        <h3>Monthly Average Temperature vs Historical Monthly Average Temperature: {difference}</h3>
        </div>
        </>
    );
}

export default USStateData;