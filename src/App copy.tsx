import React, { ChangeEvent, FormEvent } from 'react';
import Weather from './components/Weather';

type AppPropsType = Record<string, never>;

type WeatherType = {
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  time: string[];
  weathercode: number[];
} | null;

export type AppStateType = {
  location: string;
  info: {
    country_code: string;
    country_name: string;
  };
  isLoading: boolean;
  weather: WeatherType;
};

class App extends React.Component<AppPropsType, AppStateType> {
  state = {
    location: '',
    info: {
      country_code: '',
      country_name: '',
    },
    isLoading: false,
    weather: null,
  };

  handleChangeInput = (event: ChangeEvent) => {
    this.setState({
      location: (event.target as HTMLInputElement).value,
    });
  };

  fetchWeather = async (event: FormEvent) => {
    event.preventDefault();
    try {
      this.setState({ isLoading: true });
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
      );
      const geoData = await geoRes.json();
      // console.log(geoData);

      if (!geoData.results) throw new Error('Location not found');

      const { latitude, longitude, timezone, name, country_code } =
        geoData.results.at(0);
      this.setState({
        info: { country_code, country_name: name },
      });
      // console.log(`${name} ${convertToFlag(country_code)}`);

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      const weatherData = await weatherRes.json();
      // console.log(weatherData.daily);
      this.setState({
        weather: weatherData.daily,
        isLoading: false,
      });
    } catch (err) {
      this.setState({
        info: { country_code: '', country_name: '' },
        isLoading: false,
        weather: null,
      });
      console.error(err);
    }
  };

  render() {
    return (
      <div className='app'>
        <h1>Classy Weather</h1>
        <form onSubmit={this.fetchWeather}>
          <input
            type='text'
            placeholder='Search for location'
            value={this.state.location}
            onChange={this.handleChangeInput}
          />
          <button style={{ marginTop: '20px' }}>Get Weather</button>
        </form>
        {this.state.isLoading && <p className='loader'>Loading ...</p>}

        {!this.state.isLoading && this.state.weather && (
          <Weather weather={this.state.weather} info={this.state.info} />
        )}
      </div>
    );
  }
}

export default App;
