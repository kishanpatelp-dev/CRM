import mongoose from "mongoose";
import Project from "./Project.js"; // make sure the path is correct

const clientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

clientSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await Project.deleteMany({ clientId: this._id });
      next();
    } catch (err) {
      next(err);
    }
  }
);

clientSchema.pre("findOneAndDelete", async function (next) {
  try {
    const client = await this.model.findOne(this.getFilter());
    if (client) {
      await Project.deleteMany({ clientId: client._id });
    }
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Client", clientSchema);
