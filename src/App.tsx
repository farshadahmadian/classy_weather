import React, { ChangeEvent } from 'react';
import Weather from './components/Weather';

type EmptyObject = Record<string, never>;

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

class App extends React.Component<EmptyObject, AppStateType> {
  controller;

  constructor(props: EmptyObject) {
    super(props);
    this.state = {
      location: '',
      info: {
        country_code: '',
        country_name: '',
      },
      isLoading: false,
      weather: null,
    };

    this.controller = new AbortController();
    // this.handleChangeInput = this.handleChangeInput.bind(this);
  }

  handleChangeInput(event: ChangeEvent) {
    this.setState({
      location: (event.target as HTMLInputElement).value,
    });
  }

  async fetchWeather(controller: AbortController) {
    if (this.state.location.length < 2) {
      this.setState({ weather: null });
      return;
    }
    try {
      this.setState({ isLoading: true });
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`,
        { signal: controller.signal }
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
  }

  // 1) when the App component is mounted (first render), the state gets updated in componentDidMount(), which causes a re-render
  componentDidMount(): void {
    this.setState({ location: localStorage.getItem('location') || '' });
  }

  // 2) when a re-render happens, componentDidUpdate() gets called and compares the previous value of this.state.location, e.g. "" as the initial value, with the new value
  componentDidUpdate(
    _prevProps: Readonly<EmptyObject>,
    prevState: Readonly<AppStateType>
  ): void {
    if (this.state.location !== prevState.location) {
      this.controller.abort(); // cancel the previous http request
      this.controller = new AbortController(); // re-assign the controller
      this.fetchWeather(this.controller); // send the new http request
      localStorage.setItem('location', this.state.location);
    }
  }

  componentWillUnmount(): void {
    this.controller.abort();
  }

  render() {
    return (
      <div className='app'>
        <h1>Classy Weather</h1>
        <Input
          location={this.state.location}
          onChangeInput={this.handleChangeInput.bind(this)}
        />
        {this.state.isLoading && <p className='loader'>Loading ...</p>}
        {!this.state.isLoading && this.state.weather && (
          <Weather weather={this.state.weather} info={this.state.info} />
        )}
      </div>
    );
  }
}

type InputPropsType = {
  location: string;
  onChangeInput: (event: ChangeEvent) => void;
};

class Input extends React.Component<InputPropsType, EmptyObject> {
  constructor(props: InputPropsType) {
    super(props);
  }

  render() {
    return (
      <input
        type='text'
        placeholder='Search for location'
        value={this.props.location}
        onChange={this.props.onChangeInput}
      />
    );
  }
}

export default App;
