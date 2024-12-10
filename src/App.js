import React, { useState, useEffect } from 'react';
import './App.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Slider } from '@mui/material';
import Papa from 'papaparse';
import { Icon } from 'leaflet';
import L from 'leaflet';
import { Polyline } from 'react-leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { ReactSortable} from 'react-sortablejs';


//This app helps users plan a trip.  You start by choosing a city, then you get destinations that are in that city.
//Then the user can click on a destination to add it to the plan.
//The plan is sortable by dragging and dropping allowing users to see the destinations in the order they want to visit them on the map.

const cities = ['Paris','Rome', 'Oslo', 'Munich', 'Stockholm', 'Helsinki', 'Zurich', 'London', 'Dublin', 'Austin', 'Boston', 'Denver', 'Las Vegas', 'Orlando', 'Phoenix', 'San Diego', 'San Jose', 'Washington D.C.']  

const city = 'Paris';

const topDestinations = [
  { City: 'Paris', Place: 'Notre Dame', lat: 48.852968, lon: 2.349902 },
  { City: 'Paris', Place: 'Louvre', lat: 48.860846, lon: 2.337144 },
  { City: 'Paris', Place: 'Eiffel Tower', lat: 48.858844, lon: 2.294351 },
  { City: 'Paris', Place: 'Charles De Gaulle Airport', lat: 49.009724, lon: 2.5479 },
  { City: 'Paris', Place: 'Paris Opera House', lat: 48.871992, lon: 2.331818 },
  { City: 'Paris', Place: 'Montmartre', lat: 48.886473, lon: 2.342566 },
  { City: 'Rome', Place: 'Colosseum', lat: 41.890251, lon: 12.492373 },
  { City: 'Rome', Place: 'Trevi Fountain', lat: 41.900943, lon: 12.475798 },
  { City: 'Rome', Place: 'Piazza Navona', lat: 41.896366, lon: 12.479386 },
  { City: 'Rome', Place: 'Roman Forum', lat: 41.890251, lon: 12.492373 },
  { City: 'Rome', Place: 'Pantheon', lat: 41.898764, lon: 12.475181 },  
  { City: 'Oslo', Place: 'Oslo Opera House', lat: 59.9138, lon: 10.7522 },
  { City: 'Oslo', Place: 'Vigeland Sculpture Park', lat: 60.3933, lon: 10.6951 },
  { City: 'Oslo', Place: 'Oslo City Hall', lat: 59.9138, lon: 10.7522 },
  { City: 'Oslo', Place: 'Oslo City Museum', lat: 59.9138, lon: 10.7522 },  
  { City: 'Munich', Place: 'Munich City Museum', lat: 48.1351, lon: 11.5820 },
  { City: 'Munich', Place: 'Munich City Hall', lat: 48.1351, lon: 11.5820 },
  { City: 'Munich', Place: 'Munich Opera House', lat: 48.1351, lon: 11.5820 },  
];

//The plan is the subset of destinations that the user has added to their plan.
const plan = [];

//Filter the destinations to only include those in the selected city
const destinations = topDestinations.filter(destination => destination.City === city);



const CityChooser = ({ onCityChange }) => {
  return (
    <div>
      <h2>Choose a city</h2>
      <select onChange={(e) => onCityChange(e.target.value)}>
        {cities.map((city, index) => (
          <option key={index} value={city}>{city}</option>
        ))}
      </select>
    </div>
  );
}



// Main map component
function ShowMap({ plan, style }) {
  // Ensure each plan item has the required properties
  return (
        <div style={{ height: '400px', width: '100%', maxWidth: style.maxWidth, margin: '0 auto' }}>
          <MapContainer          
            center={[48.852968, 2.349902]}
            zoom={14} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {plan.map(event => (
              // Ensure event has the required properties
              <Marker 
                key={event.id} // Ensure each event has a unique id
                position={[event.position.lat, event.position.lon]} // Ensure position is defined
                icon={new Icon({ iconUrl: markerIcon, iconSize: [25, 41], iconAnchor: [12, 41], shadowUrl: markerShadow })}
              >
                <Popup>{event.event}</Popup> {/* Ensure event has a description */}
              </Marker>
            ))}
            
            {/* Draw a line between the locations of the plan */}
            {plan.length > 0 && (
              <Polyline 
                positions={plan.map(event => [event.position.lat, event.position.lon])} 
                color="blue" 
                weight={4} 
                opacity={0.7} 
              />
            )}
          </MapContainer>
        </div>
  );
}




// Update the ShowPlan component
const ShowPlan = ({ plan, updatePlan }) => {
  const [list, setList] = useState(plan);
  return (
    <div>
      <h2>Here is your plan</h2>
      <ul>
        {plan.map((destination, index) => (
          <li key={index}>{destination.event}</li>
        ))}
      </ul>
      <ReactSortable
        filter=".addImageButtonContainer"
        dragClass="sortableDrag"
        list={list}
        setList={setList}
        animation="200"
        easing="ease-out">
        {list.map(item => (
          <div className="draggableItem" key={item.id}>{item.event}</div>
        ))}
      </ReactSortable>



    </div>
  );
}

//For each destination in the city, add a checkbox next to the destination.  When the destiantion is clicked, add it to the plan list

const ShowDestinations = ({ destinations, updatePlan, plan }) => {
  const handleCheckboxChange = (destination) => {
    updatePlan(destination); // Call the updatePlan function with the selected destination
  };

  return (
    <div>
      <h2>Here is a list of destinations in this city</h2>
      <ul>
        {destinations.map((destination, index) => (
          <li key={index}>
            <input 
              type="checkbox" 
              onChange={() => handleCheckboxChange(destination)} 
              checked={plan.some(item => item.id === destination.Place)} 
            />
            {destination.Place}
          </li>
        ))}
      </ul>
    </div>
  );
}



// Main app component
function App() {
  const [plan, setPlan] = useState([]); // State to manage the plan

  const updatePlan = (destination) => {
    setPlan((prevPlan) => {
      // Check if the destination is already in the plan
      if (prevPlan.some(item => item.id === destination.Place)) {
        // If it is, remove it from the plan
        return prevPlan.filter(item => item.id !== destination.Place);
      } else {
        // If it isn't, add it to the plan with the required properties
        return [...prevPlan, { 
          id: destination.Place, // Ensure a unique id
          position: { lat: destination.lat, lon: destination.lon }, // Ensure position is defined
          event: destination.Place // Ensure event has a description
        }];
      }
    });
  };

  return (
    <div className="App" style={{ textAlign: 'center', height: '100vh', padding: '20px', backgroundColor: '#eaeaea' }}>
      <header style={{ paddingBottom: '1em' }}>
        <h1>City Trip Planner</h1>
        <p>Created by: <a href="https://www.linkedin.com/in/wgreunke/" target="_blank" rel="noopener noreferrer">Ward Greunke</a></p>
      </header>
      <CityChooser onCityChange={updatePlan} />
      <ShowMap plan={plan} style={{ maxWidth: '1000px' }} />
      <ShowPlan plan={plan} updatePlan={updatePlan} />
      <ShowDestinations destinations={destinations} updatePlan={updatePlan} plan={plan} />
    </div>
  );
}

export default App;
