import web3 from './web3';
import campaignFactory from './build/CampaignFactory.json';

export default new web3.eth.Contract(
    campaignFactory.abi,
    '0x453606d2DD392Abf6b92EA4a88ED1aCcC1B7A281'
);