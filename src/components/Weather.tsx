import React from 'react';
import { AppStateType } from '../App';
import DailyWeather from './DailyWeather';

// type WeatherPropsType = Omit<AppStateType, 'location' | 'isLoading'>;

// type WeatherPropsType = Pick<
//   AppStateType,
//   Exclude<keyof AppStateType, 'location' | 'isLoading'>
// >;

export type WeatherPropsType = Pick<AppStateType, 'weather' | 'info'>;
type StateType = Record<string, never>;

class Weather extends React.Component<WeatherPropsType, StateType> {
  constructor(props: WeatherPropsType) {
    super(props);
  }

  render(): React.ReactNode {
    if (!this.props.weather) return;
    const {
      temperature_2m_max: max,
      temperature_2m_min: min,
      time: dates,
      weathercode: codes,
    } = this.props.weather;
    return (
      <div>
        <div className='info'>
          <h2>{this.props.info.country_name}</h2>
          <img
            src={`https://flagcdn.com/h20/${this.props.info.country_code.toLowerCase()}.png`}
            alt={this.props.info.country_code}
          />
        </div>

        <ul className='weather'>
          {dates.map((date, i) => (
            <DailyWeather
              key={date}
              date={date}
              max={max[i]}
              min={min[i]}
              code={codes[i]}
              i={i}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default Weather;
