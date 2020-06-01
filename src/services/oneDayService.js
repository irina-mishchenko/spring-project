const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?';

export default {
  key: 'f1eb03cbf29532e3266fc8d482a9ae80',

  query: '',
  fetchCountury() {
    const requestParams = `q=${this.query}&units=metric&appid=${this.key}`;

    return (
      fetch(baseUrl + requestParams)
        .then(response => {
          return response.json();
        })
        .catch(error => {
          throw error;
        })
    );
  },

  set searchQuery(string) {
    this.query = string;
  },
  get searchQuery() {
    return this.query;
  },
};