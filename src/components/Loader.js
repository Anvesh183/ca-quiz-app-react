import React from "react";

const Loader = ({ type = "" }) => (
  <div id="loader" className="flex flex-col justify-center items-center p-8">
    <div className={`loader-inner ${type}`}></div>
    <p className="loader-text mt-4 italic text-gray-400">
      Waking up the server... this might take a moment
    </p>
  </div>
);

export default Loader;
