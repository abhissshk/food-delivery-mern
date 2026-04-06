const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => { // ✅ added next
  const { token } = req.headers;

  if (!token) {
    return res.json({
      success: false,
      message: "Not authorized, login again",
    });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ attach userId safely
    req.userId = token_decode.id;

    next(); // ✅ works now

  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware;