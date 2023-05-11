import Treatment from "./model.js";

export const listTreatments = () => {
    return Treatment.find({}, {treatment: 1})
}