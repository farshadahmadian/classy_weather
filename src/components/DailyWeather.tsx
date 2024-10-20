import React from 'react';
import clear from '../assets/clear.png';
import mainlyClear from '../assets/mainly-clear.png';
import partlyCloudy from '../assets/partly-cloudy.png';
import overcast from '../assets/overcast.png';
import mist from '../assets/mist.png';
import drizzle from '../assets/drizzle.png';
import rain from '../assets/rain.png';
import snow from '../assets/snow.png';
import thunderstorm from '../assets/thunderstorm.png';
import thunderstormRain from '../assets/thunderstorm-rain.png';

const icons = new Map([
  [[0], clear],
  [[1], mainlyClear],
  [[2], partlyCloudy],
  [[3], overcast],
  [[45, 48], mist],
  [[51, 56, 61, 66, 80], drizzle],
  [[53, 55, 63, 65, 57, 67, 81, 82], rain],
  [[71, 73, 75, 77, 85, 86], snow],
  [[95], thunderstorm],
  [[96, 99], thunderstormRain],
]);

function getWeatherIcon(code: number) {
  const arr = [...icons.keys()].find(key => key.includes(code));
  if (!arr) return 'NOT FOUND';
  return icons.get(arr);
}

function getWeatherType(code: number) {
  switch (true) {
    case [0].includes(code):
      return 'clear';
    case [1].includes(code):
      return 'mainly clear';
    case [2].includes(code):
      return 'partly cloudy';
    case [3].includes(code):
      return 'overcast';
    case [45, 48].includes(code):
      return 'mist';
    case [51, 56, 61, 66, 80].includes(code):
      return 'drizzle';
    case [53, 55, 63, 65, 57, 67, 81, 82].includes(code):
      return 'rain';
    case [71, 73, 75, 77, 85, 86].includes(code):
      return 'snow';
    case [95].includes(code):
      return 'thunderstorm';
    case [96, 99].includes(code):
      return 'thunderstormRain';
    default:
      return 'unknown';
  }
}

function formatDay(dateStr: string) {
  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
  }).format(new Date(dateStr));
}

type DailyWeatherStateType = Record<string, never>;
type DailyWeatherPropsType = {
  max: number;
  min: number;
  date: string;
  code: number;
  i: number;
};

class DailyWeather extends React.Component<
  DailyWeatherPropsType,
  DailyWeatherStateType
> {
  constructor(props: DailyWeatherPropsType) {
    super(props);
  }

  render(): React.ReactNode {
    const { max, min, date, code, i } = this.props;
    return (
      <li className='day'>
        <div className='icon-container'>
          <img
            className='icon'
            src={getWeatherIcon(code)}
            alt={getWeatherType(code)}
          />
        </div>
        <p>{i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : formatDay(date)}</p>
        <p>
          {Math.round(min)}&deg; &mdash; <strong>{Math.round(max)}&deg;</strong>
        </p>
      </li>
    );
  }
}

export default DailyWeather;
