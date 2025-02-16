function rolePolice(roles) {
   return (req, res, next) => {
      if (roles.includes(req.user.role)) {
         next();
      } else {
         res.status(400).json({ message: "Not allowed" });
      }
   };
}

export default rolePolice;
