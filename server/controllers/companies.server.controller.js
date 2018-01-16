'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require('../../../../config/lib/sequelize'),
  Company = db.company,
  User = db.user,
  Plan = db.plan,
  CompanyPlan = db.companyplan,
  sequelize = require('sequelize');

/**
 * Create a Company
 */
exports.create = function(req, res) {
  req.body.UserId = req.user.id;
  Company.create(req.body).then(function(company) {
    return res.jsonp(company);
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current Company
 */
exports.read = function(req, res) {
  res.jsonp(req.company);
};

/**
 * Update a Company
 */
exports.update = function(req, res) {
  var company = req.company;
  Company.update(company, {
    where: {
      id: company.id
    }
  }).then(function(company) {
    return res.jsonp(company);
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete a Company
 */
exports.delete = function(req, res) {
  var company = req.company;

  company.destroy().then(function() {
    return res.jsonp(company);
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Companies
 */
exports.list = function(req, res) {
  var criteria = {
    where: {}
  };

  if (typeof req.query.search !== 'undefined' && req.query.search.length) {
    criteria.where =
      sequelize.where(
        sequelize.fn('lower', sequelize.col('name')), {
          $like: '%' + req.query.search + '%'
        });
  }

  Company.findAll(criteria).then(function(companies) {
    return res.jsonp(companies);
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};


/**
 * Count companies
 */
exports.count = function(req, res) {
  var criteria = {
    where: {}
  };
  if (typeof req.query.search !== 'undefined' && req.query.search.length) {
    criteria.where = sequelize.where(
      sequelize.fn('lower', sequelize.col('name')), {
        $like: '%' + req.query.search + '%'
      });
  }

  Company.count(criteria).then(function(companiesCount) {
    res.json(companiesCount);
    return null;
  }).catch(function(err) {
    console.log(err);
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Company middleware
 */
exports.getCompany = function(req, res, next) {
  console.log('Getting company');
  Company.findOne({
    where: {
      id: req.user.companyId
    },
    include: [{
      model: CompanyPlan,
      required: false,
      where: {
        startingFrom: {
          $lte: sequelize.fn('now')
        }
      },
      attributes: [
        'id',
        'purchasedById',
        'companyId',
        'planId',
        'trialPeriodLength', [sequelize.fn('date_format', sequelize.col('companyplans.startingFrom'), '%Y-%m-%d %H:%i:%s'), 'startingFrom']
      ],
      include: [{
        model: Plan
      }],
    }],
    order: 'companyplans.createdAt DESC'
  }).then(function(companyTmp) {
    if (!companyTmp) return next(new Error('Failed to load Company ' + req.user.companyId));
    return res.jsonp(companyTmp);
  }).catch(function(err) {
    console.log(err);
    return next(err);
  });
};

/**
 * Company middleware
 */
exports.companyByID = function(req, res, next, id) {
  Company.findById(id).then(function(company) {
    if (!company) return next(new Error('Failed to load Company ' + id));
    company.user = {
      id: req.user.id
    };
    req.company = company;
    return next();
  }).catch(function(err) {
    return next(err);
  });
};

/**
 * Company authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.company.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};