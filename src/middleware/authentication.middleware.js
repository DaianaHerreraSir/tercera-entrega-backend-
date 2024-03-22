// const authorization = roleaArray =>{

//     return async(req, res, next) =>{
        
//         if(roleaArray [0]=== "PUBLIC") return next()
        
//         if(!req.user) return res.status(401).json({status: "error", error : "Unauthorized"})
//          console.log(req.user)
        
//         if(!roleaArray.includes(req.user.role)) return res.status(401).json({status: "error", error : "Not permissions"})
       
//         next()
//     }

// }

// export default authorization
const authorization = roleArray => {
    return (req, res, next) => {
        if (roleArray[0] === "PUBLIC") return next();

        if (!req.user) return res.status(401).json({ status: "error", error: "Unauthorized" });

        if (!roleArray.includes(req.user.role)) return res.status(401).json({ status: "error", error: "Not permissions" });

        // Asegúrate de que req.user incluya el ID del usuario
        const userId = req.user._id;
        console.log("User ID:", userId);

        next();
    };
};
export default authorization