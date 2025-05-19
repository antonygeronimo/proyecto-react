// App.jsx
import React, { useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSun, 
  faCloud, 
  faCloudRain, 
  faCloudShowersHeavy, 
  faSnowflake, 
  faSmog,
  faTemperatureHigh,
  faTint,
  faWind,
  faCloudSun
} from '@fortawesome/free-solid-svg-icons';

const iconMap = {
  Clear: faSun,
  Clouds: faCloud,
  Rain: faCloudRain,
  Drizzle: faCloudShowersHeavy,
  Snow: faSnowflake,
  Mist: faSmog,
  Smoke: faSmog,
  Haze: faSmog,
  Dust: faSmog,
  Fog: faSmog,
  Sand: faSmog,
  Ash: faSmog,
  Squall: faSmog,
  Tornado: faSmog,
};

const App = () => {
  const [ciudad, setCiudad] = useState('');
  const [busquedas, setBusquedas] = useState([]);
  const [clima, setClima] = useState(null);
  const [error, setError] = useState('');

  const API_KEY = "dc247ef2a35751d66c86c95f473dc48d";

  const buscarClima = async () => {
    if (!ciudad.trim()) return;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`
      );

      if (!response.ok) throw new Error('Ciudad no encontrada');

      const data = await response.json();

      setClima({
        nombre: data.name,
        temp: data.main.temp,
        humedad: data.main.humidity,
        viento: data.wind.speed,
        descripcion: data.weather[0].description,
        main: data.weather[0].main,
      });

      setError('');

      if (!busquedas.includes(ciudad.toLowerCase())) {
        setBusquedas([ciudad.toLowerCase(), ...busquedas].slice(0, 3));
      }

    } catch (err) {
      setClima(null);
      setError(err.message);
    }
  };

  return (
    <div className="clima-app">
      <div className="clima-card">
        <header className="clima-header">🌤 App del Clima</header>

        <div className="clima-busqueda">
          <input
            type="text"
            placeholder="Escribe una ciudad..."
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && buscarClima()}
          />
          <button onClick={buscarClima}>Buscar</button>
        </div>

        {busquedas.length > 0 && (
          <div className="clima-recientes">
            <p>Búsquedas recientes:</p>
            <div>
              {busquedas.map((item, index) => (
                <button 
                  key={index} 
                  onClick={() => { setCiudad(item); buscarClima(); }}
                  className="btn-reciente"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        {clima && (
          <div className="clima-info">
            <h3 className="ciudad-nombre">
              {clima.nombre}{' '}
              <FontAwesomeIcon 
                icon={iconMap[clima.main] || faSmog} 
                size="2x" 
                className="icon-principal"
              />
            </h3>

            <div className="info-grid">
              <div className="info-item">
                <FontAwesomeIcon icon={faTemperatureHigh} className="icon-temp" />
                <div>
                  <div className="info-label">Temperatura</div>
                  <div className="info-value">{clima.temp} °C</div>
                </div>
              </div>

              <div className="info-item">
                <FontAwesomeIcon icon={faTint} className="icon-humedad" />
                <div>
                  <div className="info-label">Humedad</div>
                  <div className="info-value">{clima.humedad} %</div>
                </div>
              </div>

              <div className="info-item">
                <FontAwesomeIcon icon={faWind} className="icon-viento" />
                <div>
                  <div className="info-label">Viento</div>
                  <div className="info-value">{clima.viento} m/s</div>
                </div>
              </div>

              <div className="info-item">
                <FontAwesomeIcon icon={faCloudSun} className="icon-descripcion" />
                <div>
                  <div className="info-label">Descripción</div>
                  <div className="info-value">{clima.descripcion}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="clima-footer">
          Datos proporcionados por OpenWeatherMap
        </footer>
      </div>
    </div>
  );
};

export default App;
