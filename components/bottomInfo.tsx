import { Icon } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type Props = {
  icon: any;
  message: string;
};

const BottomInfo = ({ icon, message }: Props) => {
  return (
    <div className="flex items-center justify-center">
      <FontAwesomeIcon
        icon={icon}
        className="w-20 h-20 text-gray-200 hidden md:block"
      />
      <p className="text-center md:text-left md:ml-10 text-2xl md:text-3xl font-medium text-gray-500 uppercase tracking-wide">
        {message}
      </p>
    </div>
  );
};

export default BottomInfo;
