const jwt = require('jsonwebtoken');

// ===================
// Validación de token
// ===================

let validarToken = (req, res, next) => {

    // El token se envió en los headers de la petición como Authorization
    let token = req.get('Authorization');

    // Verificamos si el token coincide con la SEED
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }


        // Se crea la propiedad "usuario" dentro del objeto "req",
        // al cuál se le asigna el valor de "decoded.usuario",
        // Es decir se asigna la información del usuario verificado.
        req.usuario = decoded.usuario;

        // Necesario para que continúe la ejecución del servicio
        next();

    });
};




// =======================
// Validación de AdminRole
// =======================

let validarRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {

        next();

    } else {

        return res.status(401).json({
            ok: false,
            err: { message: 'No estas autorizado, no eres administrador' }
        });

    };

};

module.exports = {
    validarToken,
    validarRole
}