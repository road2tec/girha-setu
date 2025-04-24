import { Flat } from "./flat";

export interface Notification {
  _id: string;
  type: string;
  message: string;
  createdAt: string;
  property: Flat;
}
