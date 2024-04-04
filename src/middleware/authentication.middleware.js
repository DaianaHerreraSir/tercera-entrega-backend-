const authorization = roleArray => {
    return (req, res, next) => {
        console.log("Authorization Middleware Triggered");

    if (roleArray[0] === "PUBLIC") return next();

    // Verifica si hay un usuario autenticado
    if (!req.user) {
        console.log("No se ha autenticado ningún usuario");
        return res.status(401).json({ status: "error", error: "Unauthorized" });
    }

    // Verifica si el rol del usuario está autorizado
    if (!roleArray.includes(req.user.role)) {
        console.log("El usuario no tiene permisos suficientes:", req.user.role);
        return res.status(401).json({ status: "error", error: "Not permissions" });
    }

    const userId = req.user._id;
    console.log("User ID:", userId);

    next();
    };
};

export default authorization;
