import axios from 'axios'

const baseUrl = `https://json.extendsclass.com/bin/0d4f4ac25efd`

const getData = () => {
  const config = {
    method: 'GET',
    url: baseUrl,

    headers: { 'Content-Type': 'application/json' },
  }
  return axios(config)
}

export { getData }
