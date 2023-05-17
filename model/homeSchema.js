const mongoose = require("mongoose");

const schema = mongoose.Schema;
const userSchema = new schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    userId: {
      type: Number,
      unique: true,
    },
  },
  { versionKey: false }
);
userSchema.pre("save", async function (next) {
  if (!this.userId) {
    const count = await mongoose.model("logins", userSchema).countDocuments();
    this.userId = count + 1;
  }
  next();
});
module.exports = mongoose.model("logins", userSchema);
