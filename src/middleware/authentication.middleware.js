
// export default authorization
const authorization = roleaArray => {
    return async (req, res, next) => {
        if (roleaArray[0] === "PUBLIC") return next();

        if (!req.user) {
            
            return next();
        }
        if (!roleaArray.includes(req.user.role)) {
            return res.status(401).json({ status: "error", error: "Not permissions" });
        }

        next();
    };
};

export default authorization;
