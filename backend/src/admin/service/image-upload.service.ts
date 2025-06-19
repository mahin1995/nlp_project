// src/services/image-upload.service.ts
import { Request } from 'express';
import fs from 'fs';
import multer, { Multer, StorageEngine } from 'multer';
import path from 'path';

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export class ImageUploadService {
  private upload: Multer;
  private storage: StorageEngine;

  constructor(private uploadFolder: string = 'uploads') {
    // Ensure upload directory exists
    this.ensureUploadDirectoryExists();

    // Configure storage
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.getFullUploadPath());
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
      },
    });

    // Initialize multer
    this.upload = multer({
      storage: this.storage,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: this.imageFileFilter,
    });
  }

  private ensureUploadDirectoryExists(): void {
    const fullPath = this.getFullUploadPath();
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  }

  public getFullUploadPath(): string {
    return path.join(process.cwd(), this.uploadFolder);
  }

  private imageFileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) {
    const filetypes = /jpe?g|png|gif|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png, gif, webp) are allowed'));
    }
  }

  public getUploadMiddleware(fieldName: string) {
    return this.upload.single(fieldName);
  }

  public getMultiUploadMiddleware(fieldName: string, maxCount: number = 5) {
    return this.upload.array(fieldName, maxCount);
  }

  public getFilesUploadMiddleware(
    fields: { name: string; maxCount?: number }[]
  ) {
    return this.upload.fields(fields);
  }

  public getFileUrl(filename: string): string {
    return `/${this.uploadFolder}/${filename}`;
  }

  public deleteFile(filename: string): Promise<boolean> {
    const filePath = path.join(this.getFullUploadPath(), filename);

    return new Promise((resolve) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
  public getImagePath(filename: string): string {
    const fullPath = path.join(this.getFullImagePath(), filename);

    if (!fs.existsSync(fullPath)) {
      throw new Error('Image not found');
    }

    return fullPath;
  }
  public getAbsolutePath(filename: string): string {
    const fullPath = path.resolve(
      __dirname,
      '..',
      '..',
      this.uploadFolder,
      filename
    );
    console.log('My Log fullPath: ', fullPath);
    // Security check: prevent directory traversal
    const relativePath = path.relative(
      path.resolve(__dirname, '..', '..', this.uploadFolder),
      fullPath
    );

    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      throw new Error('Invalid file path');
    }

    if (!fs.existsSync(fullPath)) {
      throw new Error('Image not found');
    }

    return fullPath;
  }
  public getFullImagePath(): string {
    return path.join(process.cwd(), this.uploadFolder);
  }
  public isValidImage(filename: string): boolean {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(filename).toLowerCase();
    return validExtensions.includes(ext);
  }
  public getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
      case '.png':
        return 'image/png';
      case '.gif':
        return 'image/gif';
      case '.webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  }
}
