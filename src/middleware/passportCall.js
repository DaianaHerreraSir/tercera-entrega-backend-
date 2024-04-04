import passport from "passport";

export const passportCall = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            console.log(user);

            if (err) return next(err);
            if (!user) {
                const errorMessage = info && info.message ? info.message : "Unauthorized";
                return res.status(401).send({
                    status: "error",
                    error: errorMessage
                });
            }

            req.user = user;
            next();
        })(req, res, next);
    };
};

