const {
  Keypair,
  Server,
  TransactionBuilder,
  Networks,
  Operation,
  BASE_FEE,
  SorobanRpc,
  Horizon,
  Asset,
  Memo,
} = require("stellar-sdk");

(async function main() {
  const server = new Horizon.Server("https://horizon-testnet.stellar.org");

  console.log("BASE FEE: ", BASE_FEE);

  // let K = process.argv[2];

  // if (!K) {
  //   console.log("Please provide amount of trustlines to set as an argument.");
  //   return;
  // }

  console.log("\n-----------------------------------------");
  console.log(`-------- SET TRUSTLINES AND THEN --------`);
  console.log("---- ATTEMPT TO TRANSFER MAX AMOUNT -----");
  console.log("-----------------------------------------\n");

  let keypairSender = Keypair.random();
  let keypairReceiver = Keypair.random();

  console.log(`Receiver's Public Key: ${keypairReceiver.publicKey()}`);
  let receiverAccount;
  try {
    console.log("Funding the receiver account...");
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(
        keypairReceiver.publicKey()
      )}`
    );
    receiverAccount = await server.loadAccount(keypairReceiver.publicKey());
    console.log("SUCCESS! Receiver account created\n");
  } catch (e) {
    console.error("ERROR!", e);
    return;
  }

  console.log(`Sender's Public Key: ${keypairSender.publicKey()}`);
  let senderAccount;
  try {
    console.log("Funding the sender account...");
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(
        keypairSender.publicKey()
      )}`
    );
    senderAccount = await server.loadAccount(keypairSender.publicKey());
    console.log("SUCCESS! Sender account created\n");
  } catch (e) {
    console.error("ERROR!", e);
    return;
  }

  console.log("Initial balances for receiverAccount: ");
  receiverAccount.balances.forEach(function (balance) {
    console.log(
      "Type:",
      balance.asset_type,
      ", Balance:",
      balance.balance,
      "\n"
    );
  });

  console.log("Initial balances for senderAccount: ");
  senderAccount.balances.forEach(function (balance) {
    console.log(
      "Type:",
      balance.asset_type,
      ", Balance:",
      balance.balance,
      "\n"
    );
  });

  console.log("Issuing new assets...");
  let astroDollar1 = new Asset("AstroDollar1", keypairSender.publicKey());
  console.log("AstroDollar1: ", astroDollar1);

  let amount = 10000 - 1 - Number(BASE_FEE) * 10 ** -7 - 0.5;

  console.log(
    "\nWe will now set a trustline for the new asset, and the try to transfer the maximum amount of XLM to the receiver account."
  );
  console.log(
    "The amount to transfer will be the total balance (10000 XLM) - the base reserve (1 XLM) - network fees (~0.00001 XLM) - 0.5 XLM for the trustline: ",
    amount
  );
  console.log("\nSetting trustlines and transfering...");
  const transaction = new TransactionBuilder(senderAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.changeTrust({
        asset: astroDollar1,
        source: keypairReceiver.publicKey(),
      })
    )
    // .addOperation(
    //   Operation.payment({
    //     destination: keypairReceiver.publicKey(),
    //     asset: astroDollar1,
    //     amount: amount.toString(),
    //     source: keypairSender.publicKey(),
    //   })
    // )
    .addOperation(
      Operation.payment({
        destination: keypairReceiver.publicKey(),
        asset: Asset.native(),
        amount: amount.toString(),
      })
    )
    .addMemo(Memo.text("Test Transaction"))
    .setTimeout(180)
    .build();

  transaction.sign(keypairSender);
  transaction.sign(keypairReceiver);

  try {
    console.log("Submitting transaction...");
    let res = await server.submitTransaction(transaction);
    console.log("Transaction successful!");
  } catch (e) {
    console.error("ERROR!", e);
    console.log(e.response.data.extras.result_codes);
  }

  senderAccount = await server.loadAccount(keypairSender.publicKey());
  console.log("Balances for senderAccount: ");
  senderAccount.balances.forEach(function (balance) {
    console.log(
      "Type:",
      balance.asset_type,
      ", Balance:",
      balance.balance,
      "\n"
    );
  });

  console.log(
    "Subentry count for senderAccount: ",
    senderAccount.subentry_count
  );

  receiverAccount = await server.loadAccount(keypairReceiver.publicKey());
  console.log("\nBalances for receiverAccount: ");
  receiverAccount.balances.forEach(function (balance) {
    console.log(
      "Type:",
      balance.asset_type,
      ", Balance:",
      balance.balance,
      "\n"
    );
  });

  console.log(
    "Subentry count for receiverAccount: ",
    receiverAccount.subentry_count
  );
})();
