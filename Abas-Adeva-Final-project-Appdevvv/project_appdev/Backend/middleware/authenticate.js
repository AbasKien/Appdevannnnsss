const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Check for session first
  if (!req.session || !req.session.userId) {
    // If no session, check for JWT token
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming "Bearer <token>" format

    if (!token) {
      return res.status(401).json({ message: 'Please login to continue.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using your secret key
      req.user = decoded; // Attach decoded user data to the request
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }
  } else {
    // Set user info from session
    req.user = {
      id: req.session.userId,
      role: req.session.role
    };
  }
  
  next();
};
