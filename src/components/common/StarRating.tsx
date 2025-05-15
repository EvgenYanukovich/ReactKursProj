import { FC } from "react";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

const StarRating: FC<StarRatingProps> = ({ rating, size = "md" }) => {
  // Определяем размер звезд в зависимости от параметра size
  const starSize = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  }[size];

  // Создаем массив из 5 элементов для отображения звезд
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;
    
    // Определяем, должна ли звезда быть заполненной, наполовину заполненной или пустой
    if (starValue <= rating) {
      return "full"; // Полная звезда
    } else if (starValue - 0.5 <= rating) {
      return "half"; // Наполовину заполненная звезда
    } else {
      return "empty"; // Пустая звезда
    }
  });

  return (
    <div className="flex items-center">
      {stars.map((type, index) => (
        <span key={index} className="text-yellow-400">
          {type === "full" && (
            <svg className={`${starSize} fill-current`} viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          )}
          {type === "half" && (
            <svg className={`${starSize} fill-current`} viewBox="0 0 20 20">
              <defs>
                <linearGradient id="halfGradient">
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="#E5E7EB" />
                </linearGradient>
              </defs>
              <path fill="url(#halfGradient)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          )}
          {type === "empty" && (
            <svg className={`${starSize} fill-current text-gray-300`} viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
