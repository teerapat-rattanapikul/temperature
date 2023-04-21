import { useEffect, useState } from 'react';
import './App.css';
import { provice } from './province'
import zipCode from './zipcode.json'
import axios from 'axios';

const apiEndpoint = 'https://api.openweathermap.org/data/2.5/weather?zip={ZIP},th&appid={API_KEY}'

function App() {
  const [zipCodeData,setZipCodeData] = useState([])
  const [temperature, setTemperature] = useState()
  const [inputDistrict, setInputDistrict] = useState({district: 'เมืองน่าน', zip: '55000'})
  const [inputProvice, setInputProvice] = useState('น่าน')

  useEffect(()=>{
    const zip = zipCode.filter((zip) => zip.province === 'น่าน')
    setZipCodeData(zip)
  },[])

  useEffect(()=>{
    if(inputDistrict && inputProvice){
      handleSearch()
    }
  },[inputDistrict, inputProvice])

  const handleSelectProvice = (event) =>{
    setInputProvice(event.target.value)
    const zip = zipCode.filter((zip) => zip.province === event.target.value)
    setZipCodeData(zip)
    setInputDistrict({zip: zip[0].zip, district: zip[0].district})
  }

  const handleSelectDistrict = (event) =>{
    setInputDistrict(zipCodeData.find((item) => item.zip === event.target.value))
  }

  const weatherSwtich = (weather) =>{
    let imageName = ''
    switch (weather){
      case 'clear sky': 
        imageName = 'clear'
        break;
      case 'few clouds':
        imageName = 'mist'
        break;
      case 'scattered clouds': 
        imageName = 'clouds'
        break;
      case 'broken clouds':
        imageName = 'drizzle'
        break;
      case '	shower rain': 
        imageName = 'rain'
        break;
      case 'rain':
        imageName = 'rain'
        break;
      case '	thunderstorm': 
        imageName = 'thunder'
        break;
      case 'snow':
        imageName = 'snow'
        break;
      default:
        break;
    }
    if(imageName===''){
      if (weather.includes('rain'))imageName = 'rain'
      else if (weather.includes('cloud'))imageName = 'clouds'
    }
    return imageName
  }

  const handleSearch = async () =>{
    const endpoint = apiEndpoint.replace('{ZIP}',inputDistrict.zip).replace('{API_KEY}', process.env.REACT_APP_API_KEY)
    const result = await axios.get(endpoint)
    if(result.data){
      const temperatureData = {
        temp: (result.data.main.temp - 273.15).toFixed(2),
        temp_min: (result.data.main.temp_min - 273.15).toFixed(2),
        temp_max: (result.data.main.temp_max - 273.15).toFixed(2),
        humidity: result.data.main.humidity,
        weather: weatherSwtich(result.data.weather[0].description),
        wind: result.data.wind.speed
      }
      setTemperature(temperatureData)
    }
  }

  return (
    <div className='container'>
      <div className='select'>
        <select onChange={handleSelectProvice} value={inputProvice}>
            {
              provice.map((item, index) =>{
                return (
                  <option key={index} value={item} >{item}</option>
                )
              })
            }
          </select>
      </div>
      <div className='select'>
        <select onChange={handleSelectDistrict} value={inputDistrict?.zip}>
            {
              zipCodeData.map((item, index) =>{
                return (
                  <option key={index} value={item.zip} >{item.district}</option>
                )
              })
            }
          </select>
      </div>
      {
        temperature && 
        <>
          { temperature.weather? <img src={require(`./images/${temperature.weather}.png`)} atl={temperature.weather} width={150} height={150} /> 
          : <div style={{width:'150px', height: '150px', visibility: 'hidden'}} />
          }
          <p className='temp_text'>
            {temperature.temp} °C
          </p>
          <p style={{color:'white', fontWeight:'bold', margin: 0}}>เย็นสุด {temperature.temp_min} °C , ร้อนสุด {temperature.temp_max} °C </p>
          <div className='humidity'>
            <img src={require('./images/humidity.png')} width={40} height={40} alt='humidity'/>
            <div style={{textAlign: 'center'}}>
              <p style={{margin: 0, color: 'white', fontWeight: 'bold'}}>{temperature.humidity} % </p>
              <p style={{margin: 0, color: 'white', fontWeight: 'bold'}}>ความชื้น</p>
            </div>
            <img src={require('./images/wind.png')} width={40} height={40} alt='wind' style={{marginLeft: '18px'}}/>
            <div style={{textAlign: 'center'}}>
              <p style={{margin: 0, color: 'white', fontWeight: 'bold'}}>{temperature.wind} km/h</p>
              <p style={{margin: 0, color: 'white', fontWeight: 'bold'}}>ความเร็วลม</p>
            </div>
          </div>
        </>
      }
    </div>
  );
}

export default App;
