import mongoose from "mongoose";

const sequenceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
});

const Sequence = mongoose.model("Sequence", sequenceSchema);

// id 순차적으로 삽입
export const getNextSequenceValue = async (sequenceName) => {
  const sequenceDocument = await Sequence.findOneAndUpdate(
    { name: sequenceName },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return sequenceDocument.value;
};

export default Sequence;
