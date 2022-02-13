import web3 from './web3';
import campaignFactory from './build/CampaignFactory.json';

export default new web3.eth.Contract(
    campaignFactory.abi,
    '0xA8903CbCCa7ba95F2A110a172FE35d7fbD864DBf'
);