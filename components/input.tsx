import { Field } from "formik";
import React from "react";

const Input = ({ invalid, errorMessage, ...rest }: any) => {
  return (
    <>
      <Field
        className={`border ${
          invalid ? "border-red-400" : "border-gray-100"
        } pl-11 text-sm focus:border-green-400 h-[50px] md:h-14 w-full border border-gray-100 rounded-lg`}
        {...rest}
      />
      {!!errorMessage && (
        <p className={`mt-1 text-red-500 text-xs italic absolute -bottom-[18px] md:-bottom-6 z-[1]`}>
          {errorMessage}
        </p>
      )}
    </>
  );
};

export default Input;
