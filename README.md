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

1. `transferAllMinus2Xlm.js`:

```bash
yarn transferAllMinus2
```

**Description**: Fund account with 10000 XLM and attempt to transfer 9998 to another account. \
**Result:** Transaction succeds.
