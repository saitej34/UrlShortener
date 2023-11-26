import mongoose, { Document, Schema } from 'mongoose';

interface UrlShort {
  targetUrl: string;
  keySearch: string;
  createdAt: Date;
}

const UrlShortSchema = new Schema<UrlShort & Document>({
  targetUrl: { type: String, required: true },
  keySearch: { type: String,required:true },
  createdAt: {type : Date , required:true}
});

const UrlShortModel = mongoose.models.UrlShort || mongoose.model<UrlShort & Document>('UrlShort', UrlShortSchema);

export default UrlShortModel;
