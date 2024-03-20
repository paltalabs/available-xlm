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

  let K = process.argv[2];

  if (!K) {
    console.log("Please provide amount of trustlines to set as an argument.");
    return;
  }

  console.log("\n---------------------------------------");
  console.log(`------ SET ${K} TRUSTLINES AND THEN ------`);
  console.log("--- ATTEMPT TO TRANSFER ALL - 2 XLM ---");
  console.log("---------------------------------------");

  let keypairSender = Keypair.random();
  let keypairReceiver = Keypair.random();
  let issuerKeypair = Keypair.random();

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

  console.log(`Issuer's Public Key: ${issuerKeypair.publicKey()}`);
  let issuerAccount;
  try {
    console.log("Funding the issuer account...");
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(
        issuerKeypair.publicKey()
      )}`
    );
    issuerAccount = await server.loadAccount(issuerKeypair.publicKey());
    console.log("SUCCESS! Issuer account created\n");
  } catch (e) {
    console.error("ERROR!", e);
    return;
  }

  let astroDollar1 = new Asset("AstroDollar1", issuerKeypair.publicKey());
  let astroDollar2 = new Asset("AstroDollar2", issuerKeypair.publicKey());
  let astroDollar3 = new Asset("AstroDollar3", issuerKeypair.publicKey());
  let astroDollar4 = new Asset("AstroDollar4", issuerKeypair.publicKey());
  let astroDollar5 = new Asset("AstroDollar5", issuerKeypair.publicKey());

  const transaction = new TransactionBuilder(issuerAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  });

  transaction.addOperation(
    Operation.changeTrust({
      asset: astroDollar1,
      source: keypairSender.publicKey(),
    })
  );

  transaction.addOperation(
    Operation.changeTrust({
      asset: astroDollar2,
      source: keypairSender.publicKey(),
    })
  );

  transaction.addOperation(
    Operation.changeTrust({
      asset: astroDollar3,
      source: keypairSender.publicKey(),
    })
  );

  transaction.addOperation(
    Operation.changeTrust({
      asset: astroDollar4,
      source: keypairSender.publicKey(),
    })
  );

  transaction.addOperation(
    Operation.changeTrust({
      asset: astroDollar5,
      source: keypairSender.publicKey(),
    })
  );

  transaction.addOperation(
    Operation.payment({
      destination: keypairSender.publicKey(),
      asset: astroDollar1,
      amount: "1000",
      source: issuerKeypair.publicKey(),
    })
  );

  transaction.setTimeout(100);
  transaction.build();

  try {
    console.log("Submitting transaction...");
    await server.submitTransaction(transaction);
    console.log("Transaction successful!");
  } catch (e) {
    console.error("ERROR!", e);
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

  receiverAccount = await server.loadAccount(keypairReceiver.publicKey());
  console.log("Balances for receiverAccount: ");
  receiverAccount.balances.forEach(function (balance) {
    console.log(
      "Type:",
      balance.asset_type,
      ", Balance:",
      balance.balance,
      "\n"
    );
  });

  issuerAccount = await server.loadAccount(issuerKeypair.publicKey());
  console.log("Balances for issuerAccount: ");
  issuerAccount.balances.forEach(function (balance) {
    console.log(
      "Type:",
      balance.asset_type,
      ", Balance:",
      balance.balance,
      "\n"
    );
  });
})();
