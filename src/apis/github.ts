import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`
  }
});

const Users = {
  resource: 'users',

  get(username : String) {
    // This will return a promise !
    return api.get(`/${this.resource}/${username}`);
  }
}

export { Users }