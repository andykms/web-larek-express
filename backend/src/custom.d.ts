declare namespace Express {
    export interface Request {
        user?: string;
        file?: Multer.File;
    }
}
