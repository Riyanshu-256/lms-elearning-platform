import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/educator/Navbar";

const Educator = () => {
  return (
    <div className="text-default min-h-screen bg-white">
      <Navbar />
      <h1>Educator Pages</h1>
      {<Outlet />}
    </div>
  );
};

export default Educator;
