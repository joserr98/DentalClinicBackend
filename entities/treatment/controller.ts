import Treatment from "./model.js";

export const listTreatments = () => {
    return Treatment.find({deleted_at: null}, {treatment: 1})
}

export const createTreatment = async (req) => {
    if(req.token == "admin"){
      req.body.created_at = new Date();
      return Treatment.create(req.body);
    } else throw new Error ('PERMISSION_RESTRICTED')
}

export const deleteTreatment = async (req) => {
    if(req.token == "admin"){
        const treatment = Treatment.findOne({_id: req.params.id})
        req.body.deleted_at = new Date()
        if (!treatment) throw new Error ('NOT_FOUND')
        await Treatment.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { returnDocument: "after" }
        );
    } else throw new Error ('PERMISSION_RESTRICTED')
}