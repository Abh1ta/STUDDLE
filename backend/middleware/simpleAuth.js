import jwt from "jsonwebtoken";

const simpleAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    const token =
      authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : req.cookies?.token || req.cookies?.authToken;

    if (!token) {
      return res.status(401).json({
        message: "Nu ești autentificat."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id || decoded._id || decoded.userId
    };

    if (!req.user.id) {
      return res.status(401).json({
        message: "Token invalid: userId lipsă."
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token invalid sau expirat."
    });
  }
};

export default simpleAuth;