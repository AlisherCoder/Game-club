function selfPolice(roles) {
   return (req, res, next) => {
      let { id } = req.params;
      if (id == req.user.id || roles.includes(req.user.role)) {
         next();
      } else {
         res.status(400).json({ message: "Not allowed" });
      }
   };
}

export default selfPolice;
