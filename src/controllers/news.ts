import { Request, Response, Router } from "express";
import { NewsService } from "../services/news";
import { validateRequestBody } from "../middlewares/validateRequestBody";
import { newsCreateValidationSchema, newsDeleteValidationSchema, newsEditValidationSchema } from "../models/news";
import { MessagingService } from "../services/messaging";

/**
* News controller class. Provides API to work with news
*/
export class NewsController {
  constructor(router: Router) {
    router.get("/api/news", this.getNews.bind(this));
    router.post("/api/news/", validateRequestBody(newsCreateValidationSchema), this.createNews.bind(this));
    router.put("/api/news/", validateRequestBody(newsEditValidationSchema), this.editNews.bind(this));
    router.delete("/api/news/", validateRequestBody(newsDeleteValidationSchema), this.deleteNews.bind(this));
  }

  /**
   * GET request handler. Used to fetch news
   * @param req
   * @param res
   */
  async getNews(req: Request, res: Response) {
    const news = await NewsService.getNews({
      id: req.query.id,
      page: req.query.page,
      limit: req.query.limit
    });

    return res.send(news);
  }

  /**
   * POST request handler. Used to create news
   * @param req
   * @param res
   */
  async createNews(req: Request, res: Response) {
    const news = await NewsService.createNews(res.locals.user, req.body);

    if (new Date(news.createdAt) <= new Date()) {
      MessagingService.sendNewNewsMessage(res.locals.user.login);
    }

    return res.send(news);
  }

  /**
   * PUT request handler. Used to edit news
   * @param req
   * @param res
   */
  async editNews(req: Request, res: Response) {
    const news = await NewsService.editNews(req.body);
    MessagingService.sendNewsEditedMessage(news._id);

    return res.send(news);
  }

  /**
   * DELETE request handler. Used to delete news
   * @param req
   * @param res
   */
  async deleteNews(req: Request, res: Response) {
    const news = await NewsService.deleteNews(req.body);
    MessagingService.sendNewsDeletedMessage(news._id);

    return res.send(news);
  }
}
