const { ApiPromise, WsProvider } = require("@polkadot/api");

async function connection() {
  const KUSAMA_CHAIN_URL = "wss://kusama-rpc.polkadot.io/";
  const wsProvider = new WsProvider(KUSAMA_CHAIN_URL);
  const api = await ApiPromise.create({ provider: wsProvider });
  return api;
}

async function staking(address) {
  console.log("getting stake for address : ", address);
  const api = await connection();
  const staking = api.query.staking;

  let validatorCount = await staking.validatorCount();
  validatorCount = validatorCount.toNumber();
  console.log("validatorCount: ", validatorCount);

  let genesishash = api.genesisHash.toHex();
  console.log("genesis hash : " + genesishash);

  // Make our basic chain state/storage queries, all in one go

  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
  ]);
  //Indicates if we are connected to the correct chain
  console.log(
    `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
  );
  //STAKING
  let [{ nonce, data: balance }, now, validators] = await Promise.all([
    api.query.system.account(address),
    api.query.timestamp.now(),
    api.query.session.validators(),
  ]);

  console.log(`nonce(${address}) ${nonce}`);
  console.log(`last block timestamp ${now.toNumber()}`);
  let validatorArr = [];
  for (let i = 0; i < 15; i++) {
    validatorArr.push(validators[i].toHuman());
  }

  now = now.toNumber();
  let NONCE = nonce.toNumber();
  let BAL = balance.free.toNumber();

  console.log(`address: balance of ${balance.free} and a nonce of ${nonce}`);
  //ACCOUNT DETAILS
  let [
    lastHeader,
    currentIndex,
    validators1,
    accDetails,
    bonded,
    currentEra,
    slashes,
    activeEra,
    nominators,
  ] = await Promise.all([
    api.rpc.chain.getHeader(),
    api.query.session.currentIndex(),
    api.query.staking.validators(address),
    api.query.system.account(address),
    api.query.staking.bonded(address),
    api.query.staking.currentEra(),
    api.query.staking.slashRewardFraction(),
    api.query.staking.activeEra(),
    api.query.staking.nominators(address),
  ]);

  let CHAIN = chain.toString();
  let lastHeaderNum = lastHeader.number.toNumber();

  console.log(
    `CHAIN  ${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`
  );
  console.log("currentIndex: ", currentIndex.toNumber());
  console.log("validators1: ", validators1.toHuman());
  console.log("account details : " + accDetails.toHuman());
  console.log("bonded: ", bonded.toString());
  currentEra = currentEra.toHuman();
  console.log("currentEra: ", currentEra);
  let erasTotalStake = await api.query.staking.erasTotalStake(currentEra);
  erasTotalStake = erasTotalStake.toString();
  console.log("erasTotalStake: ", erasTotalStake);
  let erasStakers = await api.query.staking.erasStakers(currentEra, address);
  erasStakers = erasStakers.toString();
  console.log("erasStakers : ", erasStakers);
  console.log("slashes:  ", slashes.toHuman());
  activeEra = activeEra.toHuman().index;
  console.log("activeEra:  ", activeEra);
   console.log("nominators:  ", nominators.toHuman());

  // imonline

  let SessionIndex = currentIndex;
  let [authoredBlocks, heartbeatAfter] = await Promise.all([
    api.query.imOnline.authoredBlocks(SessionIndex, address),
    api.query.imOnline.heartbeatAfter(),
  ]);
  SessionIndex = SessionIndex.toHuman();
  authoredBlocks = authoredBlocks.toHuman();
  heartbeatAfter = heartbeatAfter.toHuman();
  console.log("SessionIndex:", SessionIndex);
  console.log("authoredBlocks: ", authoredBlocks);
  console.log("heartbeatAfter: ", heartbeatAfter);

  //OFFENCES
  let deferredOffences = await api.query.offences.deferredOffences();
  deferredOffences = deferredOffences.toJSON();
  console.log("deferredOffences : ", deferredOffences);

  return {
    validator: validatorArr,
    genesishash,
    chain: CHAIN,
    nodeName:nodeName.toString(),
    now: now,
    balance: BAL,
    nonce: NONCE,
    lastblock: lastHeaderNum,
    validatorCount,
    nodeVersion:nodeVersion.toString(),
    erasTotalStake,
    activeEra,
    //imonline
    SessionIndex,
    authoredBlocks,
    heartbeatAfter,
  };
}

async function subscription(address) {
  console.log(
    "============ SUBSCRIPTION STARTS =========================== ",
    address
  );
  const api = await connection();
  // Subscribe to chain updates and log the current block number on update.
  const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
    console.log(`Chain is at block: #${header.number}`);
  });

  const unsub = await api.derive.chain.subscribeNewHeads((lastHeader) => {
    console.log(`#${lastHeader.number} was authored by ${lastHeader.author}`);
  });
  // Retrieve the current timestamp via subscription
  const unsubTimeStamp = await api.query.timestamp.now((moment) => {
    console.log(`Retrieve the current timestamp via subscription ${moment}`);
  });

  // Subscribe to balance changes for our account
  const unsubBAL = await api.query.system.account(
    address,
    ({ nonce, data: balance }) => {
      console.log(
        `free balance is ${balance.free} with ${balance.reserved} reserved and a nonce of ${nonce}`
      );
    }
  );
  // In this example we're calling the unsubscribe() function that is being
  // returned by the api call function after 7s.

  setTimeout(() => {
    unsubscribe();
    unsub();
    unsubBAL();
    unsubTimeStamp();
    console.log("Unsubscribed from all");
  }, 7000);
}
export { staking, subscription };
