import mongoose, {Schema} from "mongoose";

const Appointment = mongoose.model(
  "Appointment",
  new mongoose.Schema(
    {
      type: {
        type: Schema.Types.Mixed,
        required: true,
        ref: 'Treatment'
      },
      client: {
        type: Schema.Types.Mixed,
        required: true,
        ref: 'User'
      },
      dentist: {
        type: Schema.Types.Mixed,
        required: true,
        ref: 'User'
      },
      start_date: {
        type: Date,
      },
      end_date: {
        type: Date,
      },
      created_at: Date,
      updated_at: Date,
      deleted_at: Date
    },
    { versionKey: false }
  )
);

export default Appointment