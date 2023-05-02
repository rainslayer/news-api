import { NewsDto } from "../dto/NewsDto";
import { IUser } from "../models/user";
import { INews, NewsModel } from "../models/news";
import { IFile } from "../models/file";
import { FileService } from "./fileService";

/**
 * Service. Responsible for news management
 */
export class NewsService {
  /**
   * Used to get news by id
   * @param id
   * @private
   */
  private static async getById(id: string) {
    return NewsModel.findOne({_id: id}).populate("author", "login").populate("attachments");
  }

  /**
   * Used to get either single news by id or list of news following pagination rules
   * @param id
   * @param page
   * @param limit
   */
  static async getNews({ id, page, limit }) {
    if (id) {
      return this.getById(id);
    }

    const news = await NewsModel.find({
      createdAt: { $lt: Date.now() },
    }).populate("author", "login")
      .populate("attachments").sort({
      createdAt: -1
    }).skip((page - 1) * limit).limit(limit);

    const count = await NewsModel.countDocuments({
      createdAt: { $lt: Date.now() }
    });

    return { news, count };
  }

  /**
   * Used to create new news
   * @param author
   * @param news
   */
  static async createNews(author: IUser, news: NewsDto) {
    const createdNews = await NewsModel.create({
      ...news,
      author
    });

    await createdNews.save();
    return this.getById(createdNews._id);
  }

  /**
   * Used to edit existing news
   * @param news
   */
  static async editNews(news: INews) {
    return NewsModel.findOneAndUpdate({_id: news._id}, news, { new: true });
  }

  /**
   * Used to delete news
   * @param news
   */
  static async deleteNews(news: INews) {
    const deletedNews = await NewsModel.findOneAndDelete({_id: news._id}).populate("attachments");
    const removedAttachments = Promise.all(deletedNews?.attachments?.map((a: IFile) => FileService.deleteFile(a)));

    await removedAttachments;
    return deletedNews;
  }
}
