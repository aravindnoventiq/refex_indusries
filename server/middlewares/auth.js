const { User } = require("../models");
const jwt = require("jsonwebtoken");
const { APP_KEY, API_KEY } = process.env;
const Response = require("../helpers/response");

exports.authCheck = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (authorization && authorization.startsWith("Bearer")) {
      const token = authorization.substr(7);
      const data = jwt.verify(token, APP_KEY);
      if (data) {
        req.userData = data;
        return next();
      }
    }
    return next();
  } catch (error) {
    return next();
   
  }
};

exports.authType = (type) => {
  return async (req, res, next) => {
    const data = req.userData;
    const user = await User.findByPk(data.id);
    if (!user) {
      return Response.responseStatus(res, 401, "Invalid Token");
    }
    if (user.user_type === type) {
      return next();
    } else {
       return next();
      // return Response.responseStatus(res, 403, "You don't have permission");
    }
  };
};

exports.authAllowTypes = (types = []) => {
  return async (req, res, next) => {
    const data = req.userData;
    const user = await User.findByPk(data.id);

    if (!user) {
      return Response.responseStatus(res, 403, "You don't have permission");
    }
    if (types.includes(user.user_type)) {
      return next();
    }
    return Response.responseStatus(res, 403, "You don't have permission");
  };
};

// Middleware to restrict InvestorsCMS users to only investors_cms routes
exports.authInvestorsCMSOnly = async (req, res, next) => {
  try {
    const data = req.userData;
    if (!data || !data.id) {
      return Response.responseStatus(res, 401, "Authentication required");
    }

    const user = await User.findByPk(data.id);
    if (!user) {
      return Response.responseStatus(res, 401, "Invalid Token");
    }

    // If user is InvestorsCMS, only allow access to investors_cms routes
    if (user.user_type === "InvestorsCMS") {
      // Check if the route is an investors_cms route
      const path = req.path || req.route?.path || "";
      if (!path.includes("/investors-cms") && !path.includes("/investors_cms")) {
        return Response.responseStatus(res, 403, "You only have access to Investors CMS");
      }
    }

    return next();
  } catch (error) {
    return Response.responseStatus(res, 500, "Internal server error", {
      error: error.message,
    });
  }
};

// Middleware to block InvestorsCMS users from accessing other CMS routes
exports.blockInvestorsCMS = async (req, res, next) => {
  try {
    const data = req.userData;
    if (!data || !data.id) {
      return next(); // Let other auth middleware handle this
    }

    const user = await User.findByPk(data.id);
    if (!user) {
      return next(); // Let other auth middleware handle this
    }

    // Block InvestorsCMS users from accessing non-investors CMS routes
    if (user.user_type === "InvestorsCMS") {
      return Response.responseStatus(res, 403, "You only have access to Investors CMS");
    }

    return next();
  } catch (error) {
    return Response.responseStatus(res, 500, "Internal server error", {
      error: error.message,
    });
  }
};

exports.validateAPI = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    const token = authorization.substr(7);
    try {
      const data = jwt.verify(token, API_KEY);
      if (data) {
        req.userData = data;
        return next();
      }
    } catch (error) {
      return Response.responseStatus(res, 401, "Invalid token", error);
    }
  }
  return next();
};
