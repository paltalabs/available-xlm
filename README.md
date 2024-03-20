# available-xlm

This repository is intended to test and understand the Minimum Balance needed for an account to be able to perform transactions in the Stellar Network, specifically when setting trustlines and making payments.

For more information on this see the Stellar Docs:
https://developers.stellar.org/docs/learn/fundamentals/lumens#minimum-balance

## How to use this repository

This repository contains a series of independant scripts that set up a certain situation in the Stellar Network and then perform a transaction. The scripts are written in Javascript and use the `stellar-sdk` library to interact with the network.

Before beginning, you will need to run the docker container:

```bash
bash docker/run.sh
```

And then intall the dependencies:

```bash
yarn install
```

---

The scripts and their respective conclusions are the following:

### 1. transferAllXlm.js:

```bash
yarn transferAll
```

**Description**: Fund account with 10000 XLM and attempt to transfer all to another account. \
**Result:** Transaction fails and only 0.00001 XLM is used (as base fee).

### 2. `transferMaxAmount.js`:

```bash
yarn transferAllMinus2
```

**Description**: Here we try to find the max amount that can be transfered. First we try to transfer the total balance, minus 1.00001 XLM (1 as base reserve plus 0.00001 as transaction fee). Then we attempt to do it again, with just 0.000001 XLM more. \
**Result:** First ransaction succeds and second fails. This shows that there is a minimum of 1 XLM + transaction fee that needs to be kept in the account in order to be able to transfer.

### 3. `setTrustlines.js`:

```bash
yarn setTrustlines
```

**Description**: Sender issues a new asset, then sets a trustline for the receiver, and finally attempts to send the maximum amount of XLM to the recever. \
**Result:** Transaction works when an a base reserve (1 XLM), plus the trustline reserve (0.5 XLM), plus the transaction fee (0.00001 XLM) is kept blocked in the sender's account. This shows that for a transaction to work, there must be an aditional 1 XLM + 0.5 XLM for each trustline + the respective amount of transaction fee in the sender's account.
