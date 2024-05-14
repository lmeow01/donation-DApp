# Unicef Charity Donation Platform

This is a platform for donating to charities in the context of the UNICEF charity donation platform. 
Idea referenced to https://help.unicef.org/malaysia/save-children-lives?gad_source=1

## How to run the project locally

Create a ganache blockchain using ganache-cli or whatsoever
e.g. Download the Ganache app from https://www.trufflesuite.com/ganache, run it and create a new workspace.

Compile the smart contracts using truffle

```bash
truffle compile
truffle migrate
```

Install dependencies needed to run the project

```bash
npm install
```

Run the React app

```bash
npm run start
```

## Browser Configuration

To run the project in the browser, you need to have a web3 provider like MetaMask installed.

Add a network in MetaMask with the following details:

- Network Name: Ganache CLI
- New RPC URL: http://127.0.0.1:7545
- Chain ID: 1337
- Currency Symbol: ETH

Create an account by importing the private key of the first account created in Ganache CLI other.
This account will be the owner of the charity donation platform.
Only owner can withdraw the donation funds.

Create an account by importing the private key of one of the other accounts created in Ganache CLI.
This account will be the donor.
Of course, the owner can be the donor as well.

## Testing 

To test the project, run the following command:

```bash
truffle test
```