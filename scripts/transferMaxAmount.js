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

  console.log("\n---------------------------------------");
  console.log("--- ATTEMPT TO TRANSFER ALL - 1 XLM ---");
  console.log("---------------------------------------");

  let keypairSender = Keypair.random();
  let keypairReceiver = Keypair.random();
  let amount1 = 9998.99999;
  let amount2 = 9998.999991;

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

  console.log(
    "Let's try to transfer all XLM minus 1.00001 (1 XLM as base reserve, and 0,00001 XLM as fee)...\n"
  );
  let transaction = new TransactionBuilder(senderAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({
        destination: keypairReceiver.publicKey(),
        asset: Asset.native(),
        amount: amount1.toString(),
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

  console.log("Now let's try to do it again, with just 0.000001 XLM more...");

  let keypairSender2 = Keypair.random();
  let keypairReceiver2 = Keypair.random();

  console.log(`Sender's Public Key: ${keypairSender2.publicKey()}`);
  let senderAccount2;
  try {
    console.log("Funding the sender account...");
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(
        keypairSender2.publicKey()
      )}`
    );
    senderAccount2 = await server.loadAccount(keypairSender2.publicKey());
    console.log("SUCCESS! Sender account created\n");
  } catch (e) {
    console.error("ERROR!", e);
    return;
  }

  console.log(`Receiver's Public Key: ${keypairReceiver2.publicKey()}`);
  let receiverAccount2;
  try {
    console.log("Funding the receiver account...");
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(
        keypairReceiver2.publicKey()
      )}`
    );
    receiverAccount2 = await server.loadAccount(keypairReceiver2.publicKey());
    console.log("SUCCESS! Receiver account created\n");
  } catch (e) {
    console.error("ERROR!", e);
    return;
  }

  console.log("Initial balances for the new receiverAccount: ");
  receiverAccount2.balances.forEach(function (balance) {
    console.log(
      "Type:",
      balance.asset_type,
      ", Balance:",
      balance.balance,
      "\n"
    );
  });

  console.log("Initial balances for the new senderAccount: ");
  senderAccount2.balances.forEach(function (balance) {
    console.log(
      "Type:",
      balance.asset_type,
      ", Balance:",
      balance.balance,
      "\n"
    );
  });

  console.log("Attempting transaction...\n");
  transaction = new TransactionBuilder(senderAccount2, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({
        destination: keypairReceiver2.publicKey(),
        asset: Asset.native(),
        amount: amount2.toString(),
      })
    )
    .addMemo(Memo.text("Test Transaction 2"))
    .setTimeout(180)
    .build();

  transaction.sign(keypairSender2);

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
})();
