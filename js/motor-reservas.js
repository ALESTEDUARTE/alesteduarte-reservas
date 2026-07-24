const CONFIGURACION_RESERVAS = {
  motosMaximasPorSalida: 4,

  horariosManana: [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30"
  ],

  horariosTarde: [
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30"
  ],

  horariosProtegidos: ["10:00", "16:00"],

  ultimaSalida30Manana: "13:30",
  ultimaSalida60Manana: "13:00",

  ultimaSalida30Tarde: "18:30",
  ultimaSalida60Tarde: "18:00"
};

function obtenerHorariosValidos(duracion) {
  if (![30, 60].includes(duracion)) {
    throw new Error("La duración debe ser de 30 o 60 minutos.");
  }

  const horarios = [
    ...CONFIGURACION_RESERVAS.horariosManana,
    ...CONFIGURACION_RESERVAS.horariosTarde
  ];

  return horarios.filter((hora) => {
    if (duracion === 30) {
      return true;
    }

    const horariosNoValidos60 = ["13:30", "18:30"];
    return !horariosNoValidos60.includes(hora);
  });
}

function calcularPlazasDisponibles(motosReservadas) {
  return Math.max(
    0,
    CONFIGURACION_RESERVAS.motosMaximasPorSalida - motosReservadas
  );
}

function esHorarioProtegido(hora) {
  return CONFIGURACION_RESERVAS.horariosProtegidos.includes(hora);
}

function seleccionarMejorHorario({
  duracion,
  motosSolicitadas,
  salidasExistentes = []
}) {
  if (![1, 2, 3, 4].includes(motosSolicitadas)) {
    throw new Error("El número de motos debe estar entre 1 y 4.");
  }

  const horariosValidos = obtenerHorariosValidos(duracion);

  const salidasCompatibles = salidasExistentes
    .filter((salida) => salida.duracion === duracion)
    .filter((salida) => horariosValidos.includes(salida.hora))
    .map((salida) => ({
      ...salida,
      plazasDisponibles: calcularPlazasDisponibles(
        salida.motosReservadas
      )
    }))
    .filter(
      (salida) => salida.plazasDisponibles >= motosSolicitadas
    );

  const salidasNoProtegidas = salidasCompatibles
    .filter((salida) => !esHorarioProtegido(salida.hora))
    .sort((a, b) => {
      if (b.motosReservadas !== a.motosReservadas) {
        return b.motosReservadas - a.motosReservadas;
      }

      return a.hora.localeCompare(b.hora);
    });

  if (salidasNoProtegidas.length > 0) {
    return {
      tipo: "completar_salida",
      hora: salidasNoProtegidas[0].hora,
      duracion,
      motosSolicitadas,
      motivo: "Completar una salida existente antes de abrir otra."
    };
  }

  const horariosOcupados = salidasExistentes
    .filter((salida) => salida.duracion === duracion)
    .map((salida) => salida.hora);

  const nuevosHorariosNormales = horariosValidos.filter(
    (hora) =>
      !horariosOcupados.includes(hora) &&
      !esHorarioProtegido(hora)
  );

  if (nuevosHorariosNormales.length > 0) {
    return {
      tipo: "nueva_salida",
      hora: nuevosHorariosNormales[0],
      duracion,
      motosSolicitadas,
      motivo: "Abrir una nueva salida en horario normal."
    };
  }

  const salidasProtegidas = salidasCompatibles
    .filter((salida) => esHorarioProtegido(salida.hora))
    .sort((a, b) => b.motosReservadas - a.motosReservadas);

  if (salidasProtegidas.length > 0) {
    return {
      tipo: "completar_salida_protegida",
      hora: salidasProtegidas[0].hora,
      duracion,
      motosSolicitadas,
      motivo:
        "Usar un horario protegido porque no existe otra opción disponible."
    };
  }

  const nuevosHorariosProtegidos = horariosValidos.filter(
    (hora) =>
      !horariosOcupados.includes(hora) &&
      esHorarioProtegido(hora)
  );

  if (nuevosHorariosProtegidos.length > 0) {
    return {
      tipo: "nueva_salida_protegida",
      hora: nuevosHorariosProtegidos[0],
      duracion,
      motosSolicitadas,
      motivo:
        "Abrir un horario protegido únicamente como último recurso."
    };
  }

  return {
    tipo: "sin_disponibilidad",
    hora: null,
    duracion,
    motosSolicitadas,
    motivo: "No existe capacidad suficiente para esta reserva."
  };
}

window.MotorReservas = {
  CONFIGURACION_RESERVAS,
  obtenerHorariosValidos,
  calcularPlazasDisponibles,
  seleccionarMejorHorario
};
