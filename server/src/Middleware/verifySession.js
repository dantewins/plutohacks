const verifySession = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.session.user;

        // Check if user is logged in
        if (!user) {
            return res.status(401).send({ message: "Unauthorized", status: "error" });
        }

        // Check if user has one of the allowed roles
        const hasRole = allowedRoles.includes(user.role);
        if (!hasRole) {
            return res.status(403).send({ message: "Forbidden", status: "error" });
        }

        next();
    };
};

module.exports = { verifySession };
