import React, { Component, useEffect, useState } from 'react';
import Web3 from 'web3';
import Donation from '../abis/Donation.json'
import './App.css';

const ethButton = () => {
  <button className='bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-full'> 5 ETH </button>
}
const App = () => {

  const [donation, setDonation] = useState("");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [donationPool, setDonationPool] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [withdrawnAmount, setWithdrawnAmount] = useState("");

  useEffect(() => {
    loadWeb3()
    loadBlockchainData()
  })
  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async function loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])

    // Load contract
    const networkId = await web3.eth.net.getId()
    const networkData = Donation.networks["5777"]

    if(networkData) {
      const donation = new web3.eth.Contract(Donation.abi, networkData.address)
      setDonation(donation)

      const _currentAmount = await donation.methods.getCurrentAmount().call({from: account})
      setDonationPool(Web3.utils.fromWei(_currentAmount, 'ether'));

      const _totalAmount = await donation.methods.getTotalAmount().call()
      setTotalAmount(Web3.utils.fromWei(_totalAmount, 'ether'));

      
      const _withdrawnAmount = parseInt(_totalAmount) - parseInt(_currentAmount);
      setWithdrawnAmount(Web3.utils.fromWei(_withdrawnAmount.toString(), 'ether'));


    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }
  return (
    <>

      <header className='w-full h-16 flex flex-col justify-center bg-sky-400'>
        <div className='flex justify-between items-center'>
          <h1 className='text-white font-bold text-3xl md:text-xl ml-5'>Unicef Donate Now</h1>
          <button className='bg-green-400 hover:bg-green-700 font-bold py-2 px-4 rounded-full mr-5' onClick={async () => {
            try{
              await donation.methods.organizerWithdraw(account).send({
                from: account
              }).once('receipt', async (receipt) => {
                console.log(receipt);
                setDonationPool(await donation.methods.getCurrentAmount().call());
                const _totalAmount = await donation.methods.getTotalAmount().call()
                setTotalAmount(Web3.utils.fromWei(_totalAmount, 'ether'));
                setWithdrawnAmount(Web3.utils.fromWei(_totalAmount, 'ether'));
                window.alert("Donation funds have been withdrawn successfully!")
              })
            } catch (err) {
              window.alert("Only the owner is allowed to withdraw the donation funds.");
            }
          }}>Withdraw</button>
        </div>
        
      </header>
      <main className='h-screen'>
        <div className="w-full flex h-4/6 flex-col bg-kid-background bg-auto items-end">
          <div className='flex flex-col size-full items-center justify-center w-1/3 mt-10 mb-10 mr-10 border-solid border-2 border-gray-300 rounded-2xl bg-white p-4 space-y-4 content-center gap-6'>
            <h1 className='text-center text-3xl'>YOU can save a child's life</h1>
            <h1 className='text-center text-xl'>Donate now and make a life-long impact, every single day</h1>
            <div className='flex space-x-3'>
              <button className='bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-full' onClick={() => {
                setAmount("3");
              }}> 3 ETH </button>
              <button className='bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-full' onClick={() => {
                setAmount("2");
              }}> 2 ETH </button>
              <button className='bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-full' onClick={() => {
                setAmount("1");
              }}> 1 ETH </button>
              <button className='bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-full' onClick={() => {
                document.getElementById("donation-amount").focus()
                setAmount("");
              }}> Other </button>
            </div>
            <div className='flex justify-between items-center mt-5 space-x-12'>
              <input type="text" id="donation-amount" className="w-56 border-solid border-2 border-gray-300 rounded-lg bg-white p-2" placeholder="Enter your donation amount" value={amount} onChange={(e) =>{
                const inputAmount = e.target.value;
                setAmount(inputAmount);
              }}/>
              <button type="submit" className="bg-green-400 hover:bg-green-700 font-bold py-2 px-4 rounded-full" onClick={async (e) => {
                e.preventDefault();
                const donationAmount = Web3.utils.toWei(amount, 'ether');
                const _donationPool = donationPool + amount;
                try{
                  await donation.methods.donate().send({
                    from: account,
                    value: donationAmount
                  }).once('receipt', async (receipt) => {
                    console.log(receipt);
                    setDonationPool(Web3.utils.fromWei(await donation.methods.getCurrentAmount().call(), 'ether'));
                    setTotalAmount(Web3.utils.fromWei(await donation.methods.getTotalAmount().call(), 'ether'));
                    window.alert("Thank you for your donation!")
                  })
                } catch (err) {
                  window.alert(err.message);
                }
                
              }}>Donate</button>
            </div>
          </div>
        </div>
        <div className='flex justify-between items-center ml-10 mr-10 mt-10 mb-10'>
          <h1 className='font-sans font-bold text-8xl md:text-3xl'>Donation Pool: {donationPool} ETH</h1>
          <div className='flex flex-col items-end'>
            <h1 className='font-sans text-3xl md:text-xl'>Withdrawn Amount: {withdrawnAmount} ETH</h1>
            <h1 className='font-sans text-3xl md:text-xl'>Historical Accumulated Amount: {totalAmount} ETH</h1>
          </div>
      </div>
      </main>
      
      
    </>
  );
}


export default App;
