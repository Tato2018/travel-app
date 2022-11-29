import { cities } from './../../../data';
import { NextApiResponse, NextApiRequest } from 'next'
import { City } from '../../../types'


export type CitiesResponse = {
    success: boolean,
    cities: City[],
    message: string,
}
  

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<CitiesResponse>
) {
  const { query } = _req
  const { name } = query
  
  const filtered = cities.filter(city => city.name.toLocaleLowerCase().includes((name + "").toLocaleLowerCase()))

  setTimeout(() => {
    return filtered.length != 0 ? res.status(200).json({success: true, cities: filtered, message: "Cities found"}) : res.status(200).json({success: false, cities: [], message: "City not found"})
  }, 600);
}
