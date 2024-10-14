const authorizeRoles = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Access Denied, You do not have permission' });
        }
        next();
    };
};

export default authorizeRoles;
