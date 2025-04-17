import axios from 'axios';

export const rawgAxiosClient = axios.create({
  baseURL: process.env.RAWG_API_URL,
  params: {
    key: process.env.RAWG_API_KEY,
  },
});
