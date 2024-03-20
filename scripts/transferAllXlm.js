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

  console.log("---------------------------------------");
  console.log("----- ATTEMPT TO TRANSFER ALL XLM -----");
  console.log("---------------------------------------");

  let keypairSender = Keypair.random();
  let keypairReceiver = Keypair.random();
  let amount = 10000;

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

  console.log("Attempting transaction...");
  transaction = new TransactionBuilder(senderAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
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

  try {
    let res = await server.submitTransaction(transaction);
    console.log(`Transaction Successful! Hash: ${res.hash}\n`);
  } catch (error) {
    console.log(
      `${error}. More details:\n${JSON.stringify(
        error.response.data.extras,
        null,
        2
      )}`
    );
    console.log("\nUnable to execute transaction.");
  }

  console.log("\nChecking account balances after transfer attempt...\n");

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

  // await attemptTransfer(keypairSender, keypairReceiver, server, 10000);
})();
