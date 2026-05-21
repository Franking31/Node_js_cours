function authorizeRole(roles) {
  return (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbidden" });
    }
  };
}

export default authorizeRole;
