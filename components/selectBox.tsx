import React, { useState } from "react";
import { City } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "./input";
import axios from "axios";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { CitiesResponse } from "../pages/api/cities/getCities";
import { Oval } from "react-loader-spinner";
import { useRouter } from "next/router";

const SelectBox = ({ ...props }) => {
  const { icon, setFieldValue, ...rest } = props;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CitiesResponse>();
  const [city, setCity] = useState(router.query[props.name] ?? "");
  const [listShown, setListShown] = useState(false);
  const [selection, setSelection] = useState(router.query[props.name] ?? "");

  const domNode = useOutsideClick(() => {
    setListShown(false);
  });

  const fetchCities = async (query: string) => {
    setListShown(true);
    setLoading(true);
    const res = await axios.get(`/api/cities/getCities?name=${query}`);
    setData(res.data);
    setLoading(false);
  };

  const removeSelection = () => {
    setCity("");
    setSelection("");
    setFieldValue(props.name, "");
  };

  const selectCity = (city: City) => {
    setFieldValue(props.name, city.name);
    setCity(city.name);
    setSelection(city.name);
    setListShown(false);
  };

  return (
    <div className="relative">
      <FontAwesomeIcon
        className="w-5 h-5 text-green-500 absolute left-3 top-[19px]"
        icon={icon}
      />
      <input
        onFocus={() => {
          setListShown(true);
        }}
        onChange={(e: any) => {
          setCity(e.target.value);
          fetchCities(e.target.value);
        }}
        value={city}
        placeholder={props.placeholder}
        className={`${
          !!selection && "pointer-events-none"
        } pl-11 text-sm focus:border-green-400 h-[50px] md:h-14 w-full border border-gray-100 rounded-lg`}
      />

      {selection != "" && (
        <div className="pl-3 pr-3 h-8 text-sm flex items-center justify-center rounded-lg bg-green-400 absolute left-10 top-[13px] text-white">
          {selection}
          <FontAwesomeIcon
            className="cursor-pointer ml-2 w-5 h-5 text-white"
            icon={faXmark}
            onClick={() => removeSelection()}
          />
        </div>
      )}

      <Input type="hidden" {...rest} />

      {listShown && city != "" && (
        <div
          ref={domNode}
          className={`py-0 border border-gray-100 bg-white w-full min-h-[52px] max-h-[200px] overflow-hidden overflow-y-auto rounded-md absolute top-[60px] z-[2] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}
        >
          {!loading ? (
            data?.success == true ? (
              <ul className="py-2">
                {data?.cities.map((city) => {
                  return (
                    <li
                      className="px-5 cursor-default text-sm py-2 hover:bg-green-400 hover:text-white"
                      onClick={() => selectCity(city)}
                      key={city.id}
                    >
                      {city.name}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-center text-sm text-gray-400 py-4">
                {data?.message}
              </p>
            )
          ) : (
            <div className="w-full h-[70px] flex items-center justify-center">
              <Oval
                height={20}
                width={20}
                color="#4ade80"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#4fa94d"
                strokeWidth={3}
                strokeWidthSecondary={2}
              />
            </div>
          )}
        </div>
      )}
    </div>

    
  );
};

export default SelectBox;
