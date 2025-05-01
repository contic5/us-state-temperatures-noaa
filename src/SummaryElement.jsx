import './USStateData.css';

function SummaryElement(props)
{
    function round(number,places)
    {
        number=number*Math.pow(10,places);
        number=Math.round(number);
        number=number/Math.pow(10,places);
        return number;
    }

    const items=props.items;
    let average_temp=0;
    let monthly_mean_from_1901_to_2000=0;
    for(let item of items)
    {
        average_temp+=item.average_temp;
        monthly_mean_from_1901_to_2000+=item.monthly_mean_from_1901_to_2000;
    }
    average_temp/=items.length;
    average_temp=round(average_temp,2);

    monthly_mean_from_1901_to_2000/=items.length;
    monthly_mean_from_1901_to_2000=round(monthly_mean_from_1901_to_2000,2);

    const difference=round(average_temp-monthly_mean_from_1901_to_2000,2);

    return (
        <>
        <div className="StateData">
        <h2>Summary</h2>
        <h3>Total Elements: {items.length}</h3>
        <h3>Monthly Average Temperature: {average_temp}</h3>
        <h3>Historical Monthly Average Temperature: {monthly_mean_from_1901_to_2000}</h3>
        <h3>Monthly Average Temperature vs Historical Monthly Average Temperature: {difference}</h3>
        </div>
        </>
    );
}

export default SummaryElement;