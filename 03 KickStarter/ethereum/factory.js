import web3 from './web3';
import campaignFactory from './build/CampaignFactory.json';

export default new web3.eth.Contract(
    campaignFactory.abi,
    '0x457C198070CB25d01F9624b1d3fad7b67B3e354B'
);