import { ServerResponse, PageResult } from './response';

enum EnumContactFormType {
  NONE = 'NONE',
  DATA_MATCH = 'DATA_MATCH',
}

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

interface ContactMessage {
  type: EnumContactFormType,
  companyName?: string,
  email: string,
  firstName?: string,
  lastName?: string,
  message: string,
  phoneCountryCode?: string,
  phoneNumber?: string,
  privacyTermsAccepted: boolean,
}

interface ContactMessageResponse extends ContactMessage {
  companyName: string,
  firstName: string,
  lastName: string,
  phoneCountryCode: string,
  phoneNumber: string,
  status: 'PENDING' | 'COMPLETED',
  updatedAt: string,
}

export {
  EnumContactFormType,
  ClientContact,
  MessagesResponse,
  MessageThreadResponse,
  Message,
  ContactMessage,
  ContactMessageResponse,
};
