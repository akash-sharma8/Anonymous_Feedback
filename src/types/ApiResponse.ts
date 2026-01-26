import { Message } from "@/model/User";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}
