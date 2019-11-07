let express = require('express');
let bcrypt = require('bcryptjs');

let mdAuthentication = require('../middlewares/authentication');

let app = express();



let Usuario = require('../models/usuario');

//Obtener Usuarios
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error Cargando Ususarios',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    usuarios
                });
            });
});

//Crear Usuarios
app.post('/', mdAuthentication.verificaToken, (req, res) => {

    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
    });

    usuario.save((err, usuarioSave) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Ususarios',
                errors: err
            });
        }

        usuarioSave.password = ':)';

        res.status(201).json({
            ok: true,
            usuario: usuarioSave,
            usuariotoken: req.usuario
        });
    });

});

//Actualizar Usuario
app.put('/:id', mdAuthentication.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        usuarioSave.password = ':)';

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el' + id + 'no existe',
                errors: { message: 'No existe el usuario con ese id' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioSave) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioSave.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioSave
            });

        });
    })
});

//Borrar usuario

app.delete('/:id', mdAuthentication.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un usuarios con ese id',
                errors: { menssage: 'No existe un usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});



module.exports = app;