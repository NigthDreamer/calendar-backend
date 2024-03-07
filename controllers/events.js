const { response } = require('express');
const Evento = require('../models/Evento');

const getEventos = async (req, res = response) => {
  //* Del modelo la propiedad user (que es el modelo User) quiero la propiedad name
  const eventos = await Evento.find().populate('user', 'name');

  try {
    return res.status(200).json({
      ok: true,
      eventos,
    });
  } catch (error) {
    console.error(error);
  }
};

const crearEvento = async (req, res = response) => {
  const evento = new Evento(req.body);

  try {
    evento.user = req.uid;
    const eventoGuardado = await evento.save();

    return res.status(201).json({
      ok: true,
      evento: eventoGuardado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

const actualizarEvento = async (req, res = response) => {
  //* Saco el id de los params de la request
  const eventoId = req.params.id;
  const uid = req.uid;

  try {
    const evento = await Evento.findById(eventoId);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: 'El evento no existe para ese id',
      });
    }

    //* Verifico que la persona que actualiza la nota sea la misma que lo creo
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegio de editar este evento',
      });
    }

    const nuevoEvento = {
      ...req.body,
      user: uid,
    };

    //* Si ponemos la opcion new, devolvera el documento actualizado en vez del antiguo
    const eventoActualizado = await Evento.findByIdAndUpdate(
      eventoId,
      nuevoEvento,
      { new: true }
    );

    return res.status(200).json({
      ok: true,
      evento: eventoActualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

const eliminarEvento = async (req, res = response) => {
  const eventoId = req.params.id;
  const uid = req.uid;

  try {
    const evento = await Evento.findById(eventoId);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: 'El evento no existe para ese id',
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegio de eliminar este evento',
      });
    }

    await Evento.findByIdAndDelete(eventoId);

    return res.status(200).json({
      ok: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
};
