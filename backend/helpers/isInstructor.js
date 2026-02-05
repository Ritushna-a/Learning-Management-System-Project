const isInstructor = (req, res, next) => {
  console.log("User info:", req.user); 

  if (req.user && req.user.role === "instructor") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied: Instructors only",
  });
};

module.exports = isInstructor;
