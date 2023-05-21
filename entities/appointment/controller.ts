import Appointment from "./model.js";

export const listAppointment = async (data) => {
  const appointmentTypeRegex = new RegExp(data.query.type, "i");
  const dentistNameRegex = new RegExp(data.query.dentist, "i");
  const clientNameRegex = new RegExp(data.query.client, "i");
  const startDate = new Date(data.query.start_date);
  const endDate = new Date(data.query.end_date);
  const filter = {
    deleted_at: null,
    ...(data.query.client && { client : clientNameRegex }),
    ...(data.query.dentist && { dentist : dentistNameRegex }),
    ...(data.query.type && { type: appointmentTypeRegex }),
    ...(data.query.start_date && { start_date: { $lte: startDate } }),
    ...(data.query.end_date && { end_date: { $gt: endDate } }),
    ...(data.token.role === "client" && { client: data.token.id }),
    ...(data.token.role === "dentist" && { dentist: data.token.id }),
    ...(data.token.role === "admin" && {}),
  };
  const proyection = { type: 1, dentist: 1, start_date: 1, end_date: 1 };
  const populateOptions = [
    { path: "client", select: ["name", "lastname"] },
    { path: "dentist", select: ["name", "lastname"] },
    { path: "type", select: ["name"] }
  ];
  return await Appointment.find(filter, proyection)
    .populate(populateOptions)
    .sort({ start_date: -1 });
};

export const detailedAppointment = async (data) => {
  const filter = { _id: data.params.id };
  const proyection = { updated_at: 0, deleted_at: 0 };
  const populateOptions = [
    { path: "client", select: ["name", "lastname"] },
    { path: "dentist", select: ["name", "lastname"] },
    { path: "type", select: ["name"] },
  ];
  const appointment = await Appointment.findOne(filter, proyection);
  if (!appointment) throw new Error("NO_APPOINTMENT");
  if (
    data.token.role === "admin" ||
    (data.token.role === "dentist" && data.token.id == appointment.dentist) ||
    (data.token.role === "client" && data.token.id == appointment.client)
  ) {
    return appointment.populate(populateOptions);
  } else throw new Error("INVALID_USER_ROLE");
};

export const createAppointment = async (data) => {
  const { body, token } = data;
  const { dentist, client, start_date, end_date } = body;
  if (start_date > end_date) {
    throw new Error("WRONG_DATE");
  }
  const appointmentExists = await Appointment.findOne({
    $or: [{ dentist }, { client }],
    $and: [
      {
        $or: [
          { start_date: { $gte: start_date, $lt: end_date } },
          { end_date: { $gt: start_date, $lte: end_date } },
          {
            $and: [
              { start_date: { $lte: start_date } },
              { end_date: { $gte: end_date } },
            ],
          },
        ],
      },
      { deleted_at: null },
    ],
  });
  if (appointmentExists) {
    throw new Error("UNAVAILABLE_DATE");
  }
  if (token.role === "client") {
    body.client = token.id;
  }
  if (token.role === "dentist") {
    body.dentist = token.id;
  }
  body.created_at = new Date();
  const appointment = new Appointment(body);
  return await appointment.save();
};

export const deleteAppointment = async (req) => {
  const { params, body, token } = req;
  const appointment = await Appointment.findOne({
    _id: params.id,
    deleted_at: null,
  });
  if (!appointment) throw new Error("NO_APPOINTMENT");
  if (
    (token.role === "client" && appointment.client != token.id) ||
    (token.role === "dentist" && appointment.dentist != token.id)
  )
    throw new Error("INVALID_AUTH");
  body.deleted_at = new Date();
  body.client = token.id;
  await Appointment.findOneAndUpdate(
    {
      _id: params.id,
      ...(token.role === "client" ? { client: token.id } : {}),
    },
    { $set: { deleted_at: new Date() } }
  );
};

export const modifyAppointment = async (data) => {
  const { body, params, token } = data;
  if (body.start_date > body.end_date) {
    throw new Error("WRONG_DATE");
  }
  const appointment = await Appointment.findOne({
    _id: params.id,
    deleted_at: null,
  });
  if (!appointment) {
    throw new Error("NO_APPOINTMENT");
  }
  if (
    (token.role === "client" && appointment.client != token.id) ||
    (token.role === "dentist" && appointment.dentist != token.id)
  )
    throw new Error("INVALID_AUTH");
  const appointmentExists = await Appointment.findOne({
    $or: [{ dentist: appointment.dentist }, { client: appointment.client }],
    $and: [
      {
        $or: [
          { start_date: { $gte: body.start_date, $lt: body.end_date } },
          { end_date: { $gt: body.start_date, $lte: body.end_date } },
          {
            $and: [
              { start_date: { $lte: body.start_date } },
              { end_date: { $gte: body.end_date } },
            ],
          },
        ],
      },
      { _id: { $ne: appointment._id } },
      { deleted_at: null },
    ],
  });
  if (appointmentExists) {
    throw new Error("UNAVAILABLE_DATE");
  }
  body.updated_at = new Date();
  body.client = token.id;
  const updatedAppointment = await Appointment.findOneAndUpdate(
    { _id: params.id, client: token.id },
    { $set: body },
    { new: true }
  );
  return updatedAppointment;
};
