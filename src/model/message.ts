import { ServerResponse, PageResult } from "./response";

interface ClientContact {
  /**
   * User unique id
   */
  id: string;
  /**
   * Company image
   */
  logoImage: string | null;
  /**
   * Company image mime type
   */
  logoImageMimeType: string | null;
  /**
   * User full name
   */
  name: string;
}

interface Message {
  /**
   * Created at
   */
  createdAt: string;
  /**
   * Message unique id
   */
  id: string;
  /**
   * Message is marked as read
   */
  read: boolean;
  /**
   * Read at
   */
  readAt: string;
  /**
   * Map with all contacts (sender/recipient) for all messages in the response. 
   * The key is the contract key.
   */
  recipient: ClientContact;
  /**
   * Message recipient identifier
   */
  recipientId: string;
  /**
   * Reply message unique id
   */
  reply: string;
  /**
   * Map with all contacts (sender/recipient) for all messages in the response.
   * The key is the contract key.
   */
  sender: ClientContact;
  /**
   * Message sender identifier
   */
  senderId: string;
  /**
   * Message text
   */
  text: string;
  /**
   * Message thread unique id
   */
  thread: string;
}

interface Thread {
  key: string;
  owner: string;
  subject: string;
  text: string;
  modifiedAt: string;
  count: number;
  unread: number;
  messages: Message[];
}

interface MessagesResponse extends ServerResponse<PageResult<Message>> {
  contacts: {
    [key: string]: ClientContact;
  }[]
}

interface MessageThreadResponse extends ServerResponse<Thread> {
  contacts: {
    [key: string]: ClientContact;
  }[]
}

export {
  ClientContact,
  MessagesResponse,
  MessageThreadResponse,
  Message,
};
