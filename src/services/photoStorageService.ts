import { mkdirSync } from "fs";
import { join } from "path";
import { IPhotoStorageDTO } from "../utils/IPhotoStorage";
import { save } from "../utils/savePhoto";

export function photoStorageService(data: IPhotoStorageDTO, type: string) {
    const uploads = "uploads";
    
    const typeUploads = {
        trainingUploads: join(uploads, 'training'),
        exerciseUploads: join(uploads, 'exercise'),
        alunoUploads: join(uploads, 'aluno'),
        administradorUploads: join(uploads, 'administrador'),
        personalUploads: join(uploads, 'personal'),
    } as const;

    [uploads, ...Object.values(typeUploads)].forEach(dir => mkdirSync(dir, { recursive: true }));

    const savePhoto = save(typeUploads, data, type);
    return savePhoto;
}
