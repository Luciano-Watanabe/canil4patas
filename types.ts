
export interface Dog {
  id: number;
  name: string;
  breed: string;
  age: string;
  description: string;
  imageUrl: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
}

export interface ScheduledMessage {
  id: string;
  clientIds: string[];
  message: string;
  sendAt: string;
}
