import {
  faLocationDot,
  faCircle,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Filter from "../components/filter";
import { DistanceResponse } from "./api/cities/getDistance";
import { Puff } from "react-loader-spinner";
import BottomInfo from "../components/bottomInfo";

const Search = ({ query }: any) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DistanceResponse>();
  const intermCities =
    typeof query["intermCities"] === "string"
      ? [query["intermCities"]]
      : query["intermCities"];

  const CityList = [
    query["origin"],
    ...(intermCities ?? ""),
    query["destination"],
  ].filter((item) => item != undefined && item != "");

  const getDistances = async () => {
    setLoading(true);
    const response = await axios.get(
      `/api/cities/getDistance?cityList=${[
        query["origin"],
        query["intermCities"],
        query["destination"],
      ]}`
    );
    setData(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getDistances();
  }, [query]);

  return (
    <>
      <Filter />
      <div className="result mt-10 md:mt-16 pb-10 md:pb-20">
        <div className="mx-auto max-w-[1220px] w-full px-5  sm:px-10">
          {!loading ? (
            data?.success ? (
              <>
                <div className="flex justify-between relative">
                  {CityList.map((city, i) => {
                    return (
                      <div
                        key={city}
                        className="flex flex-col items-center w-5 -mx-1 relative z-[1]"
                      >
                        <p
                          className={`${
                            i == 0
                              ? "self-baseline"
                              : i === CityList.length - 1
                              ? "self-end"
                              : ""
                          } text-sm md:text-base tracking-wide font-medium text-gray-600 whitespace-nowrap`}
                        >
                          {city}
                        </p>
                        <FontAwesomeIcon
                          className={`${
                            i === CityList.length - 1
                              ? "p-1 md:py-2.5 md:px-1"
                              : "p-1 md:py-2.5 md:px-2"
                          } w-3 h-3 md:w-5 md:h-5 text-green-500 bg-white`}
                          icon={
                            i === CityList.length - 1 ? faLocationDot : faCircle
                          }
                        />
                      </div>
                    );
                  })}
                  <div className="absolute bottom-[10px] md:bottom-[19px] w-full border-b-2 border-green-500"></div>
                </div>

                <ul className="flex justify-around mt-0">
                  {data?.distances?.map((distance) => (
                    <li
                      className="font-medium text-sm md:text-base tracking-wide"
                      key={distance + ""}
                    >
                      {distance} KM
                    </li>
                  ))}
                </ul>

                <div className="text-xl md:text-2xl lg:text-3xl text-center mt-10 lg:mt-20 font-md tracking-wide">
                  Total Distance:{" "}
                  <span className="text-gray-600">
                    {" "}
                    {data?.distances?.reduce((a, b) => a + b, 0).toFixed(2)} KM
                  </span>
                </div>
              </>
            ) : (
              <BottomInfo icon={faXmarkCircle} message={data?.message ?? ""} />
            )
          ) : (
            <div className="w-full flex items-center justify-center">
              <Puff color="#4ade8063" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async ({ query }: any) => {
  return {
    props: {
      query,
    },
  };
};

export default Search;
