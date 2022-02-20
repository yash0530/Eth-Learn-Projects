// Required for dynamic routing

const routes = require('next-routes')();

routes.add('/campaigns/new', '/campaigns/new');
routes.add('/campaigns/:CampaignAddress', '/campaigns/show');

module.exports = routes;