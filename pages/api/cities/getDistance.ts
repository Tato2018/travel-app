import { cities } from './../../../data';
import { NextApiResponse, NextApiRequest } from 'next'
import { calcDistances } from '../../../utils/calcDistances';
import { checkDuplicates } from '../../../utils/checkDuplicates';

export type DistanceResponse = {
  success: boolean,
  distances?: number[],
  message: string,
  cityList?: string | string[] | undefined,
}

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<DistanceResponse>
) {

  const { query } = _req
  const { cityList } = query as any

  const duplicates = checkDuplicates(cityList?.split(','))


  const filteredCities = cities.filter(item => cityList?.includes(item.name))
  const distances = filteredCities.map((item, i) => {
    if (i < filteredCities.length - 1) {
      return ({
        lat1: filteredCities[i].lat,
        lon1: filteredCities[i].long,
        lat2: filteredCities[i + 1].lat,
        lon2: filteredCities[i + 1].long
      })
    }
  }).map((item: any) => {
    return calcDistances(item?.lat1, item?.lon1, item?.lat2, item?.lon2)
  }).filter(item => item != null).map(item => Number(item))

  

  setTimeout(() => {
    return duplicates ? res.status(200).json({ success: false, message: "Search Failed. Please select unique cities" }) : res.status(200).json({ success: true, distances, cityList, message: "Success" })
  }, 1500)
}
