import axios from 'axios';

// https://api.hgbrasil.com/weather?key=ba513b07&lat=-23.682&lon=-46.875

export const key = 'ba513b07';

const api = axios.create({
  baseURL: 'https://api.hgbrasil.com'
});

export default api;