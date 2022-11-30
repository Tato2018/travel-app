import React, { useEffect, useState } from "react";
import { Form, FormikProvider, useFormik } from "formik";
import Image from "next/image";
import trainImage from "../public/img/train.jpg";
import Input from "./input";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  faLocationDot,
  faCalendarDays,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import SelectBox from "./selectBox";
import { useRouter } from "next/router";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { useIsMounted } from "../hooks/useIsMounted";
import moment from "moment";
import SelectBoxMultiple from "./SelectBoxMultiple";
import Link from "next/link";

const FormSchema = () => {
  return yup.object().shape({
    origin: yup.string().required("Please select city of origin"),
    destination: yup.string().required("Please select city of destination"),
    date: yup.string().required("Date of the trip is required"),
    passengers: yup.string().required("Number of passengers is required"),
  });
};

const Filter = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const router = useRouter();
  const isMount = useIsMounted();
  const [dateValue, onChange] = useState<Date>(
    !!router.query.date ? new Date(router.query.date + "") : new Date()
  );

  const formik = useFormik({
    initialValues: {
      origin: router.query.origin || "",
      destination: router.query.destination || "",
      intermCities: router.query.intermCities || [],
      date: router.query.date || "",
      passengers: router.query.passengers || "",
    },
    validateOnBlur: false,
    enableReinitialize: true,
    validationSchema: FormSchema,
    onSubmit: (res) => {
      const { date, ...rest } = res;
      router.push({
        pathname: "/search",
        query: { date: date.toString(), ...rest },
      });
    },
  });

  const domNode = useOutsideClick(() => {
    setShowCalendar(false);
  });

  useEffect(() => {
    if (!isMount) {
      setShowCalendar(false);
      formik.setFieldValue("date", moment(dateValue).format("MM/DD/yyyy"));
    }
  }, [dateValue]);

  return (
    <div
      className={`py-10 md:py-20 w-full relative flex items-center justify-center px-5 sm:px-10`}
    >
      <div className="bg-black/50 w-full h-full absolute left-0 top-0 z-[1]"></div>
      <Image
        src={trainImage}
        alt="transport background image"
        className="w-full h-full object-cover object-center absolute left-0 top-0"
      />
      <div className="relative z-[1] mx-auto max-w-[960px] w-full">
        <Link href={"/"}>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-5 md:mb-16 text-white text-center uppercase tracking-[6px]">
            Travel <span className="text-green-400">App</span>
          </h1>
        </Link>
        <FormikProvider value={formik}>
          <Form autoComplete="off" className="md:flex w-full md:space-x-10">
            <div className="flex-1 space-y-6 md:space-y-9">
              <SelectBox
                value={router.query.origin}
                icon={faCircle}
                setFieldValue={formik.setFieldValue}
                name="origin"
                placeholder="Type in the city of origin"
                errorMessage={formik.errors.origin}
                invalid={!!formik.errors.origin}
              />
              <SelectBoxMultiple
                value={router.query.intermCities}
                icon={faCircle}
                setFieldValue={formik.setFieldValue}
                name="intermCities"
                placeholder="Search for intermediate cities"
                errorMessage={formik.errors.intermCities}
                invalid={!!formik.errors.intermCities}
              />
            </div>
            <div className="flex-1 space-y-6 md:space-y-9">
              <SelectBox
                value={router.query.destination}
                icon={faLocationDot}
                setFieldValue={formik.setFieldValue}
                name="destination"
                placeholder="Type in the city of destination"
                errorMessage={formik.errors.destination}
                invalid={!!formik.errors.destination}
              />
              <div className="relative">
                <FontAwesomeIcon
                  className="w-5 h-5 text-green-500 absolute left-3 top-[19px]"
                  icon={faCalendarDays}
                />
                <Input
                  type="text"
                  name="date"
                  placeholder="Date of the trip"
                  onFocus={() => setShowCalendar(true)}
                  invalid={!!formik.errors.date}
                  errorMessage={formik.errors.date}
                  onKeyDown={(e: Event) => e.preventDefault()}
                />
                {showCalendar && (
                  <div ref={domNode}>
                    <Calendar
                      className="absolute z-[2] rounded-md overflow-hidden"
                      prev2Label={null}
                      next2Label={null}
                      prevLabel={
                        <FontAwesomeIcon
                          className="text-gray-500 h-3 ml-4"
                          icon={faChevronLeft}
                        />
                      }
                      nextLabel={
                        <FontAwesomeIcon
                          className="text-gray-500 h-3 ml-4"
                          icon={faChevronRight}
                        />
                      }
                      onChange={onChange}
                      minDate={new Date()}
                      value={dateValue}
                    />
                  </div>
                )}
              </div>
              <div className="flex space-x-5">
                <div className="relative flex-1">
                  <FontAwesomeIcon
                    className="w-5 h-5 text-green-500 absolute left-3 top-[19px]"
                    icon={faPerson}
                  />
                  <Input
                    type="number"
                    min="1"
                    name="passengers"
                    placeholder="Passengers"
                    errorMessage={formik.errors.passengers}
                    invalid={!!formik.errors.passengers}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!formik.isValid}
                  className={`${
                    !formik.isValid && "opacity-80"
                  } uppercase flex-1 bg-green-400 text-white font-medium tracking-[2px] px-5 flex items-center justify-center rounded-md`}
                >
                  search
                </button>
              </div>
            </div>
          </Form>
        </FormikProvider>
      </div>
    </div>
  );
};

export default Filter;
