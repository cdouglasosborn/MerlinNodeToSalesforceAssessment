'use strict';

module.exports = function(app) {

  var companiesPolicy = require('../policies/companies.server.policy'),
    companies = require('../controllers/companies.server.controller');



  //Get company details
  app.route('/api/company')
    .get(companies.getCompany);

  // Companies Routes
  app.route('/api/companies').all(companiesPolicy.isAllowed)
    .get(companies.list)
    .post(companies.create);

  // Count companies
  app.route('/api/companies/count').all(companiesPolicy.isAllowed)
    .get(companies.count);

  app.route('/api/companies/:companyId').all(companiesPolicy.isAllowed)
    .get(companies.read)
    .put(companies.hasAuthorization, companies.update)
    .delete(companies.hasAuthorization, companies.delete);

  // Finish by binding the Company middleware
  app.param('companyId', companies.companyByID);
};