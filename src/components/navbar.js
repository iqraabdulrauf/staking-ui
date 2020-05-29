import React from "react";

//Stateless functional component
const Navbar = ({ chainname, nodeName, lastblock, nodeVersion }) => {
  return (
    <nav className="navbar navbar-light bg-light ">
      <a className="navbar-brand" href="#none">
        CHAIN
        <span className="badge badge-pill badge-success m-4">{chainname}</span>
        NODE
        <span className="badge badge-pill badge-success m-4">{nodeName}</span>
        NODE VERSION
        <span className="badge badge-pill badge-success m-4">
          {nodeVersion}
        </span>
        LAST BLOCK
        <span className="badge badge-pill badge-success m-4">{lastblock}</span>
      </a>
    </nav>
  );
};

export default Navbar;
