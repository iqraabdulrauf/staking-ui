import React from "react";

//Stateless functional component
const Navbar = ({ chainname, nodeName, lastblock, nodeVersion ,className}) => {

  return (

    <nav className="navbar navbar-light bg-light ">
      <a className="navbar-brand" href="#none">
        CHAIN
        <span className={className}>{chainname}</span>
        NODE
        <span className={className}>{nodeName}</span>
        NODE VERSION
        <span className={className}>
          {nodeVersion}
        </span>
        LAST BLOCK
        <span className={className}>{lastblock}</span>
      </a>
    </nav>
  );
};

export default Navbar;
