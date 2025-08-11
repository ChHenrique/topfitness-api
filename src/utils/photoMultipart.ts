import { photoStorageService } from "../services/photoStorageService";
import { typeUploads } from "../types/typeUploads";

export async function createUserPhotoMultipart(rawData: any, parsedData: any, typeUploads: typeUploads) {
    const foto = rawData.foto;
    if (foto && typeof foto.toBuffer === 'function') {
        const buffer = await foto.toBuffer();
        const { filename, mimetype } = foto;
        parsedData.data.foto = await photoStorageService({ buffer, filename, mimetype }, typeUploads);
    } else {
        parsedData.data.foto = "uploads/alunoUploads/photo-default.jpg";
    }
}


export async function updateUserPhotoMultipart(rawData: any, parsedData: any, typeUploads: typeUploads) {
    const foto = rawData.foto;
    if (foto && typeof foto.toBuffer === 'function') {
        const buffer = await foto.toBuffer();
        const { filename, mimetype } = foto;
        parsedData.data.foto = await photoStorageService({ buffer, filename, mimetype }, typeUploads);
    }
}