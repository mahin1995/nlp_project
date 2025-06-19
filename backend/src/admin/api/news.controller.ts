import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import NewsRepository from '../../admin/repository/news.repository';
import NewsService from '../../admin/service/news.service';
import AbstractApiClass from '../../common/abstract/api/AbstractApi';
import {
  Body,
  Controller,
  Next,
  Param,
  Req,
  Res,
} from '../../common/decorator/controller.decorator';
import { Get, Post } from '../../common/decorator/router.decorator';
import Logger from '../../utils/Logger';
import { INews } from '../model/News-model';
import { ImageUploadService } from '../service/image-upload.service';
const uploadService = new ImageUploadService('public/uploads/news');
@Controller('/api/v1/news')
export default class NewsController extends AbstractApiClass<
  INews,
  NewsRepository,
  NewsService
> {
  protected dropownResponse(data: INews[]) {
    return data.map((news) => ({
      id: news._id,
      title: news.title,
    }));
  }
  protected service = Container.get(NewsService);
  @Post('/upload/image')
  async uploadImage(@Req() req: Request, @Res() res: Response) {
    try {
      await new Promise<void>((resolve, reject) => {
        const uploadMiddleware = uploadService.getUploadMiddleware('image');

        uploadMiddleware(req, res, (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileUrl = uploadService.getFileUrl(req.file.filename);

      return res.status(201).json({
        message: 'Image uploaded successfully',
        url: process.env.BASE_URL + fileUrl,
        fileName: req.file.filename,
        fileInfo: {
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (error) {
      return res.status(400).json({ error: (error as any)?.message || '' });
    }
  }
  @Post('/delete/image')
  //   @Middleware()
  async deleteImage(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() body: any
  ) {
    try {
      const { filename } = req.params;
      const success = await uploadService.deleteFile(filename);

      if (success) {
        res.json({ message: 'File deleted successfully' });
      } else {
        res
          .status(404)
          .json({ error: 'File not found or could not be deleted' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  @Get('/previews/image/:filename/')
  //   @Middleware()
  async previewImage(
    @Req() req: Request,
    @Res() res: Response,
    @Param('filename') filename: string
  ) {
    try {
      if (!filename || !uploadService.isValidImage(filename)) {
        return res.status(400).json({ error: 'Invalid image file' });
      }
      const imagePath = uploadService.getAbsolutePath(filename);

      res.set({
        'Content-Type': uploadService.getContentType(filename),
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      });
      console.log('My Log imagePath: ', imagePath);
      return res.sendFile(imagePath, { root: '/' }, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          if (!res.headersSent) {
            res.status(404).json({ error: 'Image not found' });
          }
        }
      });
    } catch (error) {
      console.log('My Log error: ', error);
      Logger.logError(error);
      return res.status(404).json({ error: (error as any)?.message });
    }
  }
}
