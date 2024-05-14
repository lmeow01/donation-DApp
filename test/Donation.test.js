const Donation = artifacts.require('./Donation.sol')

contract('Donation', (accounts) => {
  let donation

  before(async () => {
    donation = await Donation.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await donation.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await donation.name()
      const organizer = await donation.organizer()
      assert.equal(name, 'Charity Donation')
    })

  })

  describe('donations', async () => {
    it('make donation', async () => {
        const donor = accounts[2]
        await donation.donate({from: donor, value: web3.utils.toWei('1', 'ether')})
        const contractBalance = await web3.eth.getBalance(donation.address)
        const donorBalance = await web3.eth.getBalance(donor)
        assert.equal(contractBalance, donorBalance)
    })  
    
  })
})
