import React from "react";
import toaster from "toasted-notes";
import "toasted-notes/src/styles.css"; // optional styles
import { subscription } from "../polkadot-api.js";

const Content = ({
  timestamp,
  nonce,
  balance,
  validatorCount,
  SessionIndex,
  authoredBlocks,
  heartbeatAfter,
  searchValidator,
  validatorAddrs,
  addressOnDevChain,
  address,
  erasTotalStake,
  activeEra,
}) => {
  let className= 'badge badge-pill badge-success m-4';
  function subscribe() {
    subscription(address);
    toaster.notify("Subscribe to chain updates !!", {
      position: "top-right",
      duration: 1000,
    });
    setTimeout(() => {
      toaster.notify("Subscription will end after 8 seconds !!", {
        position: "top-right",
        duration: 2000,
      });
    }, 1100);
    setTimeout(() => {
      toaster.notify("Unsubscribed after 8 seconds !!", {
        position: "top-right",
        duration: 2000,
      });
    }, 10000);
  }
  return (
    
    <React.Fragment>
      <div>
        ADDRESS
        <span className={className}>
          {addressOnDevChain}
        </span>
        <button
          style={{
            float: "right",
          }}
          className="btn btn-info btn-sm m-2"
          onClick={subscribe}
        >
          SUBSCRIBE
        </button>
      </div>
      <div>
        TIMESTAMP
        <span className="badge badge-pill badge-success m-3"> {timestamp}</span>
        NONCE
        <span className={className}>{nonce}</span>
        BALANCE
        <span className={className}>{balance}</span>
        VALIDATOR COUNT
        <span className={className}>
          {validatorCount}
        </span>
        <div>
          ERA TOTAL STAKE
          <span className={className}>
            {erasTotalStake}
          </span>
          ACTIVE ERA INDEX
          <span className={className}>
            {activeEra}
          </span>
        </div>
        <div>
          {/* <span className="btn btn-info">IMONLINE EVENTS </span> */}
          {/* {"   "} */}
          SESSION INDEX
          <span className="badge badge-pill badge-success m-3">
            {SessionIndex}
          </span>
          AUTHORED BLOCKS
          <span className={className}>
            {authoredBlocks}
          </span>
          HEART BEAT AFTER
          <span className={className}>
            {heartbeatAfter}
          </span>
        </div>
        {searchValidator && validatorAddrs()}
      </div>
    </React.Fragment>
  );
};
export default Content;
