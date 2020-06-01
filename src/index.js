'use strict';

import './styles.css';
import '../node_modules/basiclightbox/dist/basicLightbox.min.css';
import weatherTemplate from './templates/weather-template.hbs';
import apiServiceOneDay from './services/oneDayService.js';
import '@pnotify/core/dist/BrightTheme.css';
import { alert, error } from '@pnotify/core/dist/PNotify';
import '@pnotify/core/dist/PNotify.css';
import _ from 'lodash';

const refs = {
  cityInput: document.getElementsByClassName('city-input'),
  currentWeather: document.getElementsByClassName('weather-wrapper'),
  bodyImg: document.querySelector('body'),
};

refs.input.addEventListener('input', _.debounce(handleInputValue, 2000));
refs.currentWeather.style.display = 'none';

function handleInputValue(event) {
  event.preventDefault();
  clearMarkup();
  const searchQuery = event.target.value;
  apiServiceOneDay.searchQuery = searchQuery;
  event.target.value = '';
  createWeatherTemplate();
}

function createWeatherTemplate() {
  apiServiceOneDay
    .fetchCountury()
    .then(response => {
      if (response.cod === '404') {
        refs.currentWeather.style.display = 'none';
        error('No such city found');
      } else {
        const dataTemp = { ...response };
        const cityName = dataTemp.name;
        const sysCountry = dataTemp.sys.country;
        const iconSrc = dataTemp.weather[0].icon;
        const mainTemp = Math.round(dataTemp.main.temp);
        const mainTempMin = Math.round(dataTemp.main.temp_min);
        const mainTempMax = Math.round(dataTemp.main.temp_max);
        return {
          cityName,
          mainTemp,
          iconSrc,
          sysCountry,
          mainTempMin,
          mainTempMax,
        };
      }
    })

    .then(buildWeatherItemsMarkup)
    .catch(error => {
      alert('Error :(');
      console.warn(error);
    });
}

function buildWeatherItemsMarkup(items) {
  if (items === undefined) {
    return;
  } else {
    refs.currentWeather.style.display = 'flex';
    const markup = weatherTemplate(items);
    refs.currentWeather.insertAdjacentHTML('beforeend', markup);
  }
}
function clearMarkup() {
  refs.currentWeather.innerHTML = '';
}

