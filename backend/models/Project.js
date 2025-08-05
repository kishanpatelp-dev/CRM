import mongoose from "mongoose";

const collaboratorSchema = new mongoose.Schema({
    uesrId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "editor", "viewer"],
        default: "viewer",
    },    
});

const projectSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true, 
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    collaborators: [collaboratorSchema],
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed", "archived"],
        default: "pending",
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date, 
        required: false,

    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});

projectSchema.virtual("isOverdue").get(function() {
    return this.status != "Completed" && this.endDate && this.endDate < new Date();
}); 

const Project = mongoose.model("Project", projectSchema);
export default Project;
