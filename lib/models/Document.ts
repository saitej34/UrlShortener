import mongoose, { Document, Schema } from 'mongoose';

interface Docstore {
  email:string,
  uniqueKey:string,
}

const UrlShortSchema = new Schema<Docstore & Document>({
  email:{type:String,required:true},
  uniqueKey:{type:String,required:true},
});

const docstore = mongoose.models.Docstore || mongoose.model<Docstore & Document>('Docstore', UrlShortSchema);

export default docstore;
