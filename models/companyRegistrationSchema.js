const mongoose = require('mongoose');

const companyDocumentsSchema = new mongoose.Schema({
    companyId: { type: mongoose.Types.ObjectId, ref: 'companys' },
    Registration_Number: { type: String, required: true },
    Gst_Number: { type: String, required: true },
    Sector: { type: String, required: true },
    company_address: { type: String, required: true }
});

const companyDocumentsModel = mongoose.model('companyDocuments', companyDocumentsSchema);

module.exports = companyDocumentsModel;
