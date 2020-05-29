import React, { Component } from "react";
import Navbar from "./components/navbar";
import "./App.css";
import moment from "moment";
import toaster from "toasted-notes";
import "toasted-notes/src/styles.css"; // optional styles
import Loading from "./components/loader";
import Content from "./components/content";
import { staking } from "./polkadot-api";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      searchValidator: false,
    };
    this.validatorAddrs = this.validatorAddrs.bind(this);
  }
  componentDidMount() {
    this.onSearch("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY");
  }
  onSearch = (ADDR = "") => {
    this.setState({ loading: true });
    staking(ADDR).then((result) => {
      this.setState({
        ...result,
        searchValidator: true,
        timestamp: moment.unix(result.now / 1000).format("DD/MM/YYYY h:mm:ss"),
        loading: false,
      });
    }).catch = (e) => {
      return e;
    };
  };
  Editnavigate = (e, ADDR) => {
    e.preventDefault();
    toaster.notify(`Searching for address ${ADDR}`, {
      position: "top-right",
      duration: 2000,
    });
    this.setState({ address: ADDR });
    this.onSearch(ADDR);
  };
  validatorAddrs() {
    return (
      <div>
        <label>Top 15 Validators in the current session : </label>
        {this.state.validator.map((obj, index) => (
          <div key={index}>
            <a href="####" onClick={(e) => this.Editnavigate(e, obj)}>
              {obj}
            </a>
          </div>
        ))}
        <br />
      </div>
    );
  }
  render() {
    let {
      chainname = "Not Defined",
      timestamp = 0,
      lastblock = 0,
      address = "Not Defined",
      balance = 0,
      nonce = 0,
      SessionIndex = 0,
      authoredBlocks = 0,
      heartbeatAfter = 0,
      validatorCount = 0,
      nodeName = "Not Defined",
      nodeVersion = "Not Defined",
      erasTotalStake = "Not Defiend",
      activeEra = "0",
    } = this.state;
    if (this.state.loading) {
      return <Loading></Loading>;
    }
    return (
      <React.Fragment>
        <Navbar
          chainname={chainname}
          nodeName={nodeName}
          lastblock={lastblock}
          nodeVersion={nodeVersion}
        ></Navbar>

        <main className="container">
          <Content
            addressOnDevChain={address}
            address={this.state.address}
            timestamp={timestamp}
            nonce={nonce}
            validatorCount={validatorCount}
            validatorAddrs={this.validatorAddrs}
            authoredBlocks={authoredBlocks}
            heartbeatAfter={heartbeatAfter}
            searchValidator={this.state.searchValidator}
            balance={balance}
            SessionIndex={SessionIndex}
            erasTotalStake={erasTotalStake}
            activeEra={activeEra}
          ></Content>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
