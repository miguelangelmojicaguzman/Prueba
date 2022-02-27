const Soportes = require('../models/Soportes');
const Avances = require('../models/Avances');

exports.soportesHome = async (req, res) =>{
    const usuarioId = res.locals.usuario.id;
    const soportes = await Soportes.findAll({where: {usuarioId}}); //findAll es lo mismo que select * soportes

    res.render('index', {
        nombrePag : 'WxSoporte',
        soportes
    });
};

exports.nuevoSoporte = async (req, res) =>{
    const usuarioId = res.locals.usuario.id;
    const soportes = await Soportes.findAll({where: {usuarioId}}); //findAll es lo mismo que select * soportes
    res.render('nuevoSoporte', {
        nombrePag : 'Nuevo Soporte',
        soportes
    });
};

exports.creaYeditaSoporte = async (req, res) =>{
    const usuarioId = res.locals.usuario.id;
    const soportes = await Soportes.findAll({where: {usuarioId}}); //findAll es lo mismo que select * soportes
    const { nombre } = req.body;

    let err = [];

    if(!nombre) err.push({'texto': 'Debe Agregar un nombre'});        

    if(err.length > 0){
        res.render('nuevoSoporte', {
            nombrePag : 'Nuevo Soporte',
            err, 
            soportes
        });
    } else {
        // Soportes.create({ nombre }).then(() => console.log('insertado correctamente'))
        //                            .catch(err => console.log(err));
        
        // console.log(req.params.id + ' ' + nombre);
        if(req.params.id == 0){
            // console.log('create');
            const usuarioId = res.locals.usuario.id;
            // console.log(usuarioId);
            await Soportes.create({ nombre, usuarioId }); // esta linea hace lo mismo que las 2 anteriores, pero cuando se afecta la BD es mejor usar async y await            
            // console.log(user);            
        }else{
            // console.log('update');
            await Soportes.update(
                { nombre: nombre },
                { where: { id: req.params.id}}
            );
        }            
        
        
        res.redirect('/');

        
    }
};

exports.soporteURL = async (req, res, next) =>{
    // const soportes = await Soportes.findAll(); //findAll es lo mismo que select * soportes
    // const soporte = await Soportes.findOne({
    //     where: {
    //         url: req.params.url
    //     }
    // }); se podria dejar de esta forma si la segunda consulta dependiera de la primera, pero en este caso son independientes, entonces se optimiza a continuación    

    const usuarioId = res.locals.usuario.id;
    const soportesPromise = Soportes.findAll({where: {usuarioId}}); //findAll es lo mismo que select * soportes
    const soportePromise = Soportes.findOne({
        where: {
            url: req.params.url
        }
    });
    const [ soportes, soporte ] = await Promise.all([ soportesPromise, soportePromise]);

    // consultar tareas del proyecto actual
    const avances = await Avances.findAll({
        where: { soporteId: soporte.id 
        },
        // include: [
        //     {model: Soportes}
        // ] include es como un join en sequelize
    });
    // console.log(avances);


    if(!soporte) return next();

    res.render('avances', {
        nombrePag: 'Avances el Soporte',
        soporte,
        soportes,
        avances
    });
};

exports.editarSoporte = async (req, res) =>{
    const usuarioId = res.locals.usuario.id;
    const soportesPromise = Soportes.findAll({where: {usuarioId}}); //findAll es lo mismo que select * soportes
    const soportePromise = Soportes.findOne({
        where: {
            id: req.params.id
        }
    });
    const [ soportes, soporte ] = await Promise.all([ soportesPromise, soportePromise ]);

    res.render('nuevoSoporte', {
        nombrePag: 'Editar Soporte',
        soportes, 
        soporte
    });
};

exports.eliminarSoporte = async (req, res) => {
    // console.log(req);

    const {urlSoporte} = req.query;
    const resultado = await Soportes.destroy({ where: { url : urlSoporte} });

    if(!resultado){
        return next();
    };

    res.status(200).send('Soporte Eliminado correctamente');
    
};