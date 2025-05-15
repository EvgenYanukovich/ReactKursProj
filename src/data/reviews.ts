import { Review } from "../types/Review";
import { getUserData } from "../utils/localStorage";

// Начальные данные для отзывов
const initialReviews: Review[] = [
  {
    id: 1,
    productId: 1,
    author: "Александр К.",
    rating: 5,
    date: "12.04.2025",
    text: "Отличный корм для моего лабрадора! Пес ест с удовольствием, шерсть стала мягче и блестящей. Собака активная, аллергии нет. Рекомендую всем владельцам собак средних пород.",
    verified: true,
    helpful: 3,
    helpfulBy: ["user1", "user2", "user3"]
  },
  {
    id: 2,
    productId: 1,
    author: "Елена М.",
    rating: 4,
    date: "05.03.2025",
    text: "Хороший корм, но дороговат. Собака ест хорошо, пищеварение в норме, но хотелось бы больше вариантов вкусов. В целом, качество отличное и собаке нравится.",
    verified: true,
    helpful: 1,
    helpfulBy: ["user4"]
  },
  {
    id: 3,
    productId: 1,
    author: "Дмитрий И.",
    rating: 5,
    date: "27.02.2025",
    text: "Наконец-то нашли корм, который подходит нашему привередливому питомцу! Рекомендую всем владельцам собак средних пород. Качество на высоте, собака довольна, а это главное.",
    verified: false,
    helpful: 0,
    helpfulBy: []
  },
  {
    id: 4,
    productId: 2,
    author: "Марина С.",
    rating: 5,
    date: "15.03.2025",
    text: "Кошка просто обожает эту игрушку! Играет с ней каждый день, мята действительно работает. Качество хорошее, швы крепкие.",
    verified: true,
    helpful: 2,
    helpfulBy: ["user1", "user5"]
  },
  {
    id: 5,
    productId: 2,
    author: "Игорь П.",
    rating: 3,
    date: "02.02.2025",
    text: "Неплохая игрушка, но моя кошка быстро потеряла к ней интерес. Качество изготовления хорошее, но эффект от мяты быстро выветрился.",
    verified: true,
    helpful: 0,
    helpfulBy: []
  }
];

// Получение отзывов из localStorage или использование начальных данных
const getReviewsFromStorage = (): Review[] => {
    const storedReviews = localStorage.getItem("reviews");
    return storedReviews ? JSON.parse(storedReviews) : initialReviews;
};

// Сохранение отзывов в localStorage
const saveReviewsToStorage = (reviews: Review[]): void => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
};

// Инициализация отзывов при первом запуске
if (!localStorage.getItem("reviews")) {
  saveReviewsToStorage(initialReviews);
}

// Получение всех отзывов
export const getAllReviews = (): Review[] => {
    return getReviewsFromStorage();
};

// Получение отзывов для конкретного товара
export const getProductReviews = (productId: number): Review[] => {
    const allReviews = getAllReviews();
    return allReviews.filter(review => review.productId === productId);
};

// Альтернативное название для совместимости
export const getAllReviewsForProduct = getProductReviews;

// Добавление нового отзыва
export const addReview = (review: Omit<Review, "id" | "date" | "verified" | "helpful" | "helpfulBy">): Review => {
    const allReviews = getAllReviews();
    const newReview: Review = {
        ...review,
        id: allReviews.length > 0 ? Math.max(...allReviews.map(r => r.id)) + 1 : 1,
        date: new Date().toLocaleDateString("ru-RU"),
        verified: true,
        helpful: 0,
        helpfulBy: []
    };
    const updatedReviews = [...allReviews, newReview];
    saveReviewsToStorage(updatedReviews);
    return newReview;
};

// Отметить отзыв как полезный
export const markReviewAsHelpful = (reviewId: number, userId: string): boolean => {
    const allReviews = getAllReviews();
    const reviewIndex = allReviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex === -1) return false;
    
    const review = allReviews[reviewIndex];
    
    // Инициализируем поля, если они отсутствуют
    if (!review.helpfulBy) review.helpfulBy = [];
    if (review.helpful === undefined) review.helpful = 0;
    
    // Проверяем, не отметил ли пользователь уже этот отзыв
    if (review.helpfulBy.includes(userId)) {
        // Если уже отметил, убираем отметку
        review.helpfulBy = review.helpfulBy.filter(id => id !== userId);
        review.helpful = Math.max(0, review.helpful - 1);
    } else {
        // Если еще не отмечал, добавляем отметку
        review.helpfulBy.push(userId);
        review.helpful += 1;
    }
    
    allReviews[reviewIndex] = review;
    saveReviewsToStorage(allReviews);
    return true;
};

// Проверка, отметил ли пользователь отзыв как полезный
export const isReviewMarkedAsHelpful = (reviewId: number, userId: string): boolean => {
    const allReviews = getAllReviews();
    const review = allReviews.find(r => r.id === reviewId);
    return review && review.helpfulBy ? review.helpfulBy.includes(userId) : false;
};

// Получение имени пользователя для отзыва
export const getUserNameForReview = (): string => {
    const userData = getUserData();
    if (userData && userData.name) {
        return userData.name;
    }
    return "";
};

// Расчет средней оценки для товара
export const getAverageRating = (productId: number): number => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return 0;

    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / productReviews.length;
};

// Расчет количества отзывов по каждой оценке
export const getRatingCounts = (productId: number): { rating: number; count: number; percentage: number }[] => {
    const productReviews = getProductReviews(productId);

    return [5, 4, 3, 2, 1].map(ratingValue => {
        const count = productReviews.filter(review => review.rating === ratingValue).length;
        const percentage = productReviews.length > 0
            ? Math.round((count / productReviews.length) * 100)
            : 0;
        return { rating: ratingValue, count, percentage };
    });
};
