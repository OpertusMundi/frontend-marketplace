interface TobieUserMessage {
  sender: string,
  message: string,
}

interface TobieResponse {
  recipient_id: string,
  text: string,
}

export { TobieUserMessage, TobieResponse };
