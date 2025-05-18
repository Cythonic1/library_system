interface Book {
    book_id: string;
    title: string;
    author: string;
    genre: string;
    url: string;
    desc: string;
}
// TypeScript: BookCreate type to match backend schema
interface BookCreate {
  title: string
  author: string
  publication_year?: number
  desc: string
  genre?: string
  url: string
  counter: number
}
// types.ts
export interface User {
  user_id: number;
  username: string;
  email: string;
  role: 'admin' | 'librarian' | 'user';
  created_at: string;
  updated_at: string;
}

export interface NewUser {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'librarian' | 'user';
}

export interface UpdateUser {
  username?: string;
  email?: string;
  role?: 'admin' | 'librarian' | 'user';
}

export type { Book ,BookCreate};