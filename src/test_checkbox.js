//This is a sample app that just outputs the checkbox.  
//The purpose is to practice javascript


//Checkbox Component

//cities is a list of cities that you check box component to show.
const CityCheckbox =({cities, onCityChange}) =>{
    const[selectedCities, setSelectedCities] = useState([]);

    const handlesCheckboxChange = (city) => {
        const updatedCities=selectedCities.includes(city)
        ? selectedCities.filter((c)=> c !==city) //This is an if statment.
        : [...selectedCities, city];
    setSelectedCities(updatedCities);
    onCityChange(updatedCities);
    };

return (
    <div>
        {cities.map((city)=> (
            <label key={city}>
                <input
                type="checkbox"
                value={city}
                checked={selectedCities.includes(city)}
                onChange={()=> handlesCheckboxChange(city)}
                />
            {city}
            </label>
        ))}
    </div>
    ); // return
};
export default CityCheckbox;


//CityResults
//This takes a list called selectedCities, maps through the list
//and outputs and unorded list.
//.map is like a for loop that loops through a list.
const CityResults=({selectedCities}) =>{
    return(
        <div>
            <h2>Selected Cities:</h2>
        <ul>
            {
            selectedCities.map((city)=>(<li key={city}>{city}</li>))
            }
        </ul>
        </div>
    );
};


//Now lets do the main app
const App=()=> {
    const citiesList=['New York', 'Los Angels', 'Chicago', 'San Francisco'];
    //Create a list and set it blank.
    const [selectedCities, setSelectedCities]=useState([]);
    
    const handleCityChange=(updatedCities)=> {
        setSelectedCities(updatedCities)
    };

    return(
        <div className="App">
        <h1>City Checkbox App</h1>
        <CityCheckbox cities={citiesList} onCityChange={handleCityChange} />
        <CityResults selectedCities={selectedCities} />
        </div>

    );

};  //App