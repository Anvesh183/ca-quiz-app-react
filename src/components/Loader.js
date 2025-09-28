import React from "react";

const Loader = ({ type = "" }) => (
  <div id="loader" className="flex flex-col justify-center items-center p-8">
    <div className={`loader-inner ${type}`}></div>
    <p className="loader-text mt-4 italic text-gray-400">
      It's not a code problem, it's your internet speed. Have patience
    </p>
  </div>
);

export default Loader;
