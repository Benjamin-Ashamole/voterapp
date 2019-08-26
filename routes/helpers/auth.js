const jwt = require('jsonwebtoken');



exports.validateToken = (req, res, next) => {

  const authorizationHeaader = req.headers.authorization;
  console.log(authorizationHeaader)

  let result;

  if (authorizationHeaader) {
    const token = req.headers.authorization.split(' ')[1];
    const options = {
      expiresIn: '2d',
      issuer: 'http://'+req.headers.host
    }
    console.log(token)
    try {
      result = jwt.verify(token, 'mynameisobinna', options);
      req.decoded = result;
      console.log('>>>>>>',result, '<<<<');
      res.send(result)
      next();
    }catch (err) {
      throw new Error(err)
    }
  } else {
    result = {
      error: 'There was an error',
      status: 401
    }
    res.status(401).send(result);
  }
}
// const getTokenFromHeaders = (req) => {
//
//   const { headers: {authorization}} = req;
//
//   if (authorization && authorization.split(' ')[0] === 'Token') {
//     return authorization.split(' ')[1];
//   }
//   return null;
// }
//
// const auth = {
//   required: jwt({
//     secret: 'secret',
//     userProperty: 'payload',
//     getToken: getTokenFromHeaders,
//   }),
//   optional: jwt({
//     secret: 'secret',
//     userProperty: 'payload',
//     getToken: getTokenFromHeaders,
//     credentialsRequired: false,
//   }),
// };
//
// module.exports = auth;
