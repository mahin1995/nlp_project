import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import {
  Controller,
  Next,
  Param,
  Req,
  Res,
  SwaggerDoc,
} from '../../common/decorator/controller.decorator';
import { Get } from '../../common/decorator/router.decorator';
import StoryAnalyticsService from '../service/story.analytics.service';

@Controller('/api/v1/story-analytics')
export default class StoryAnalyticsController {
  protected service = Container.get(StoryAnalyticsService);

  @SwaggerDoc({
    summary: 'Add Story count',
    //   bodyExample: {
    //     title: 'Example News Title',
    //     content: 'This is sample content for a Create request.',
    //     category: 'General',
    //   },
    parameters: [
      {
        name: 'storyId',
        in: 'path',
        required: true,
        description: 'ID of the story to increment count for',
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: { description: 'Successfully created item' },
    },
  })
  @Get('/:storyId/count')
  //   @Middleware()
  async incrimentCount(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Param('storyId') id: string
  ) {
    try {
      const count = await this.service.incrementStoryCount(id);
      return res.json({ count });
    } catch (error) {
      next(error);
    }
  }
}
