import { Joi } from 'celebrate';
import mongoose from 'mongoose';
import { deleteFile } from '../utils/delete';
import path from 'path';

interface IImage {
    fileName: string;
    originalName: string;
}

export interface IProduct {
    title: string;
    image: IImage;
    category: string;
    description: string;
    price: number | null;
}

const imageSchema = new mongoose.Schema<IImage>({
    fileName: {
        type: String,
        required: true,
    },
    originalName: {
        type: String,
        required: true,
    },
});

const productSchema = new mongoose.Schema<IProduct>({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
        unique: true,
    },
    image: imageSchema,
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: null,
    },
});

productSchema.post('deleteOne', async (doc) => {
    await deleteFile(path.join(__dirname, '../../public/images', doc.image.fileName));
});

export default mongoose.model<IProduct>('product', productSchema);
