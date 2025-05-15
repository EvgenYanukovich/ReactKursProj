export interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
  helpful: number; // Счетчик полезных отзывов
  helpfulBy: string[]; // Массив ID пользователей, отметивших отзыв как полезный
}
