export type Message = {
  id: number;
  content: string;
  contentType: number;
  rid: number;
  sid: number;
};
export type User = {
  uid: number;
  avatar: string;
  nickname: string;
  username: string;
  introduction: string;
  online: number;
  type: number;
  phone: string;
  password: string;
  gender: number;
  book_time: string;
};
export interface Props {
  user?: User;
}
