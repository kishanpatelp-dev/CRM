import mongoose from "mongoose";    

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: String,
    phone: String,
    company: String,
    status: {
        type: String,
        enum: ["active", "inactive", "pending"],
        default: "pending",
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

export default mongoose.model("Client", clientSchema);

