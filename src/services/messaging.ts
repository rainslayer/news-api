import { wss } from "../..";
import WebSocket from "ws";

/**
 * Service. Responsible for communications via websocket
 */
export class MessagingService {
  /**
   * Used to inform clients that new news was posted
   * @param authorLogin
   */
  static sendNewNewsMessage(authorLogin: string) {
    return wss?.clients?.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          message: "NEW_NEWS",
          author: authorLogin
        }));
      }
    })
  }

  /**
   * Used to inform clients that the news was edited
   * @param id
   */
  static sendNewsEditedMessage(id: string) {
    return wss?.clients?.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          message: "NEWS_EDITED",
          id
        }));
      }
    })
  }

  /**
   * Used to inform clients that the news was deleted
   * @param id
   */
  static sendNewsDeletedMessage(id: string) {
    return wss?.clients?.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          message: "NEWS_DELETED",
          id
        }));
      }
    })
  }
}
