const mongoose = require("mongoose");

const companyDocumentsSchema = new mongoose.Schema({
  companyId: { type: mongoose.Types.ObjectId, ref: "companys" },
  Registration_Number: { type: String, required: true },
  Gst_Number: { type: String, required: true },
  Sector: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  pincode: { type: String, required: true },
  companylogo: { type: String, required: true },
});

const companyDocumentsModel = mongoose.model(
  "companyDocuments",
  companyDocumentsSchema
);

module.exports = companyDocumentsModel;
