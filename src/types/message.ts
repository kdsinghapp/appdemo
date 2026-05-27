export interface Message {
  id: string;
  text: string;
  timestamp: number;
  isSender: boolean;
  senderId?: string; // MAC address of sender
  receiverId?: string; // MAC address of receiver
}
