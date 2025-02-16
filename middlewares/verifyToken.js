import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
   try {
      let [typeToken, token] = req.header("Authorization").split(" ");
      if (!token) {
         return res.status(401).json({ message: "Not authorized" });
      }
      let key = process.env.JWTSECRETKEY;
      let data = jwt.verify(token, key);
      req.user = data;
      next();
   } catch (error) {
      res.status(400).json({ message: "Something is wrong with your token" });
   }
};

export default verifyToken;
