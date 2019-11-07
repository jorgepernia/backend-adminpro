let jwt = require('jsonwebtoken');
let SEED = require('../config/config').SEED;

exports.verificaToken = function (req, res, next) {

    //verificar Token
    let token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();
        // return res.status(200).json({
        //     ok: true,
        //     decoded: decoded
        // });
    });
}