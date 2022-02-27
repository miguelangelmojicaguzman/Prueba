const Soportes = require('../models/Soportes');
const Avances = require('../models/Avances');

exports.agregarAvance = async (req, res, next) => {    
    const soporte = await Soportes.findOne({where: { url: req.params.url }});
    
    const { avance } = req.body;
    //console.log(req.body);
    const estado = 0;
    const soporteId = soporte.id;    

    const result = await Avances.create({ avance, estado, soporteId });

    if(!result) return next();

    //console.log(req.params.url);

    res.redirect(`/soportes/${req.params.url}`);

};

exports.cambiarEstado = async (req, res, nex) => {
    const { id } = req.params;
    const avance = await Avances.findOne({where: { id } }); // cuando es id: id, se puede dajar solo id (o el nombre que sea)

    let estado = 0;
    if(avance.estado === estado) estado = 1;

    avance.estado = estado;
    
    const resultado = await avance.save();

    if(!resultado) return next();

    res.status(200).send('Actualizado...');

};

exports.eliminarAvance = async (req, res) => {
    // console.log(req.query);

    const {idAvance} = req.query;
    const resultado = await Avances.destroy({ where: { id : idAvance} });

    if(!resultado){
        return next();
    };

    res.status(200).send('Avance Eliminado correctamente');
    
};

