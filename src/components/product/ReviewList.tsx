import { FC, useState, useEffect } from "react";
import StarRating from "../common/StarRating";
import { Review } from "../../types/Review";
import { getProductReviews, addReview, getUserNameForReview, markReviewAsHelpful, isReviewMarkedAsHelpful } from "../../data/reviews";
import { useAuth } from "../../utils/AuthContext";

interface ReviewListProps {
  productId: number;
}

const ReviewList: FC<ReviewListProps> = ({ productId }) => {
  const { currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState<{ rating: number; count: number; percentage: number }[]>([]);

  // Загрузка отзывов при монтировании компонента
  useEffect(() => {
    loadReviews();
  }, [productId]);

  // Загрузка имени пользователя при открытии формы
  useEffect(() => {
    if (showForm) {
      const userName = getUserNameForReview();
      if (userName) {
        setAuthorName(userName);
      }
    }
  }, [showForm]);

  // Загрузка отзывов
  const loadReviews = () => {
    const productReviews = getProductReviews(productId);
    setReviews(productReviews);

    // Расчет среднего рейтинга на основе отзывов
    const avgRating = productReviews.length > 0
      ? parseFloat((productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length).toFixed(1))
      : 0;
    setAverageRating(avgRating);

    // Расчет количества отзывов по каждому рейтингу
    const counts = [5, 4, 3, 2, 1].map(rating => {
      const count = productReviews.filter(review => review.rating === rating).length;
      const percentage = productReviews.length > 0 ? Math.round((count / productReviews.length) * 100) : 0;
      return { rating, count, percentage };
    });
    setRatingCounts(counts);
  };

  // Обработчик отправки отзыва
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация формы
    const errors: Record<string, string> = {};
    if (!authorName.trim()) errors.authorName = "Введите ваше имя";
    if (!reviewText.trim()) errors.reviewText = "Введите текст отзыва";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Добавление нового отзыва
    addReview({
      productId,
      author: authorName,
      rating,
      text: reviewText
    });

    // Обновление списка отзывов
    loadReviews();

    // Сброс формы
    setShowForm(false);
    setReviewText("");
    setRating(5);
    setFormErrors({});

    // Отображаем уведомление об успешном добавлении отзыва
    alert("Спасибо за ваш отзыв! Он успешно добавлен.");
  };

  // Обработчик клика по кнопке "Полезный отзыв"
  const handleHelpfulClick = (reviewId: number) => {
    if (!currentUser) {
      alert("Для отметки отзыва как полезного необходимо авторизоваться");
      return;
    }

    markReviewAsHelpful(reviewId, currentUser.id);
    // Обновляем список отзывов
    setReviews(getProductReviews(productId));
  };

  // Проверка, отметил ли пользователь отзыв как полезный
  const isHelpful = (reviewId: number): boolean => {
    return currentUser && currentUser.id ? isReviewMarkedAsHelpful(reviewId, currentUser.id) : false;
  };

  return (
    <div>
      {/* Общая статистика отзывов */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-gray-800 mb-2">{averageRating.toFixed(1)}</div>
            <StarRating rating={averageRating} size="lg" />
            <div className="text-sm text-gray-600 mt-2">{reviews.length} отзывов</div>
          </div>

          <div className="md:w-3/4">
            {ratingCounts.map(({ rating: ratingValue, percentage }) => (
              <div key={ratingValue} className="flex items-center mb-2">
                <div className="w-12 text-sm text-gray-600">{ratingValue} звезд</div>
                <div className="flex-grow mx-3">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-8 text-sm text-gray-600">{percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Кнопка добавления отзыва */}
        {!showForm && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => {
                if (!currentUser) {
                  alert("Для добавления отзыва необходимо авторизоваться");
                  return;
                }
                setShowForm(true);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
            >
              Написать отзыв
            </button>
          </div>
        )}
      </div>

      {/* Форма для отзыва */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h3 className="text-xl font-bold mb-4">Оставить отзыв</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Ваше имя*</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className={`w-full px-4 py-2 border ${
                  formErrors.authorName ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
              />
              {formErrors.authorName && (
                <p className="text-red-500 text-sm mt-1">{formErrors.authorName}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Ваша оценка*</label>
              <div className="flex items-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-500 transition-colors`}
                    title={`Оценить на ${star}`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-gray-600">{rating} из 5</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Текст отзыва*</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                className={`w-full px-4 py-2 border ${
                  formErrors.reviewText ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
              ></textarea>
              {formErrors.reviewText && (
                <p className="text-red-500 text-sm mt-1">{formErrors.reviewText}</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
              >
                Отправить отзыв
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Список отзывов */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review: Review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-bold text-lg">{review.author}</h3>
                    {review.verified && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Проверенный покупатель
                      </span>
                    )}
                  </div>
                  <div className="flex items-center mt-1">
                    <StarRating rating={review.rating} />
                  </div>
                </div>
                <div className="text-sm text-gray-500">{review.date}</div>
              </div>
              <p className="text-gray-700 mt-3">{review.text}</p>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <button 
                  onClick={() => handleHelpfulClick(review.id)}
                  className={`flex items-center ${isHelpful(review.id) ? 'text-orange-500' : 'hover:text-orange-500'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill={isHelpful(review.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  Полезный отзыв ({review.helpful})
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-gray-600">У этого товара пока нет отзывов</p>
          <button 
            onClick={() => {
              if (!currentUser) {
                alert("Для добавления отзыва необходимо авторизоваться");
                return;
              }
              setShowForm(true);
            }} 
            className="mt-4 text-orange-500 hover:text-orange-600 font-medium"
          >
            Будьте первым, кто оставит отзыв
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
