import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Oval } from "react-loader-spinner";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { CitiesResponse } from "../pages/api/cities/getCities";
import Input from "./input";

const SelectBoxMultiple = ({ ...props }) => {
  const { icon, setFieldValue, ...rest } = props;
  const router = useRouter();
  const selectedList =
    typeof router.query[props.name] === "string"
      ? [router.query[props.name]]
      : (router.query[props.name] as any);
  const clearedSelectedList = selectedList?.filter(
    (item: string) => item != undefined && item != ""
  );

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CitiesResponse>();
  const [city, setCity] = useState("");
  const [listShown, setListShown] = useState(false);
  const [selection, setSelection] = useState<any>(clearedSelectedList ?? []);

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

  const removeSelection = (city: string) => {
    const updatedSelection = selection.filter((item: string) => item !== city);
    setSelection([...updatedSelection]);
    setFieldValue(props.name, [...updatedSelection]);
  };

  const selectCity = (city: string) => {
    if (!selection.includes(city)) {
      const updatedSelection = [...selection, city];
      setSelection(updatedSelection);
      setFieldValue(props.name, updatedSelection);
      setCity("");
    }
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
        className={`pl-11 text-sm focus:border-green-400 h-14 w-full border border-gray-100 rounded-lg`}
      />

      <Input type="hidden" {...rest} />

      <div className="flex flex-wrap mt-3">
        <div className="flex flex-wrap">
          <p className="text-white text-sm mt-[6px] mr-2">
            {selection.length != 0 ? "Selected:" : ""}
          </p>
          {selection.length != 0 &&
            selection.map((item: string) => {
              return (
                <div
                  key={props.name + item}
                  className="pl-3 pr-3 h-8 mr-3 mb-3 flex items-center justify-center rounded-lg bg-green-400 text-sm text-white"
                >
                  {item}
                  <FontAwesomeIcon
                    className="cursor-pointer ml-2 w-5 h-5 text-white"
                    icon={faXmark}
                    onClick={() => removeSelection(item)}
                  />
                </div>
              );
            })}
        </div>
      </div>

      {listShown && city != "" && (
        <div
          ref={domNode}
          className={`py-0 border border-gray-100 bg-white w-full min-h-[52px] max-h-[200px] overflow-hidden overflow-y-auto rounded-md absolute top-[60px] z-[2] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}
        >
          {!loading ? (
            data?.success ? (
              <ul className="py-2">
                {data?.cities.map((city) => {
                  return (
                    <li
                      className="px-5 cursor-default text-sm py-2 hover:bg-green-400 hover:text-white"
                      onClick={() => selectCity(city.name)}
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

export default SelectBoxMultiple;
