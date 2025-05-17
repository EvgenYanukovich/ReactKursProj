import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Интерфейс для статьи блога
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  date: string;
  author: string;
  tags?: string[];
}

// Компонент карточки статьи
const BlogCard: FC<{ post: BlogPost }> = ({ post }) => {
  return (
    <div className="bg-[var(--bg-primary)] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={post.imageUrl || "https://via.placeholder.com/400x250"}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-0 left-0 bg-[var(--accent-color)] text-white px-3 py-1 text-xs font-medium">
          {post.category}
        </div>
      </div>
      <div className="p-4">
        <div className="text-[var(--text-secondary)] text-xs mb-2">{post.date}</div>
        <h3 className="font-bold text-lg mb-2">{post.title}</h3>
        <p className="text-[var(--text-primary)] text-sm mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex justify-end">
          <Link
            to={`/blog/${post.id}`}
            className="text-[var(--accent-color)] hover:text-[var(--accent-hover)] font-medium text-sm"
          >
            Читать далее →
          </Link>
        </div>
      </div>
    </div>
  );
};

const BlogPage: FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Все");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const postsPerPage = 9;

  // Загрузка статей
  useEffect(() => {
    // В реальном приложении здесь был бы запрос к API
    const mockPosts: BlogPost[] = [
      {
        id: 1,
        title: "10 важных правил ухода за щенком",
        excerpt: "Узнайте о важных правилах ухода за щенком в первые месяцы его жизни. Советы ветеринаров и опытных заводчиков.",
        content: "Полный текст статьи о правилах ухода за щенком...",
        imageUrl: "/images/blog/puppy-care.jpg",
        category: "Собаки",
        date: "12 Мая, 2025",
        author: "Анна Петрова"
      },
      {
        id: 2,
        title: "Как правильно ухаживать за шерстью кошки",
        excerpt: "Советы по уходу за шерстью кошек разных пород. Какие инструменты использовать и как часто проводить груминг.",
        content: "Полный текст статьи об уходе за шерстью кошки...",
        imageUrl: "/images/blog/cat-grooming.jpg",
        category: "Кошки",
        date: "5 Мая, 2025",
        author: "Мария Сидорова"
      },
      {
        id: 3,
        title: "Оформление аквариума для начинающих",
        excerpt: "Подробная инструкция по созданию красивого и здорового аквариума. Выбор растений, грунта и декораций.",
        content: "Полный текст статьи об оформлении аквариума...",
        imageUrl: "/images/blog/aquarium.jpg",
        category: "Рыбки",
        date: "25 Апреля, 2025",
        author: "Игорь Волков"
      },
      {
        id: 4,
        title: "Как научить попугая говорить",
        excerpt: "Эффективные методики обучения попугая разговору. Какие породы лучше всего поддаются обучению и с чего начать.",
        content: "Полный текст статьи об обучении попугаев...",
        imageUrl: "/images/blog/parrot.jpg",
        category: "Птицы",
        date: "20 Апреля, 2025",
        author: "Елена Соколова"
      },
      {
        id: 5,
        title: "Обустройство клетки для хомяка",
        excerpt: "Как создать комфортное пространство для хомяка. Выбор клетки, наполнителя и аксессуаров для счастливой жизни питомца.",
        content: "Полный текст статьи об обустройстве клетки для хомяка...",
        imageUrl: "/images/blog/hamster.jpg",
        category: "Грызуны",
        date: "15 Апреля, 2025",
        author: "Дмитрий Кузнецов"
      },
      {
        id: 6,
        title: "Террариум для гекконов: основные требования",
        excerpt: "Как создать идеальные условия для гекконов: необходимый размер террариума, температурный режим, влажность и необходимое оборудование.",
        content: "Полный текст статьи о террариуме для гекконов...",
        imageUrl: "/images/blog/gecko.jpg",
        category: "Рептилии",
        date: "10 Апреля, 2025",
        author: "Алексей Морозов"
      },
      {
        id: 7,
        title: "Правильное питание собаки: что можно и что нельзя",
        excerpt: "Руководство по составлению сбалансированного рациона для собак разных пород и возрастов. Опасные продукты, которые нельзя давать собакам.",
        content: "Полный текст статьи о питании собак...",
        imageUrl: "/images/blog/dog-food.jpg",
        category: "Собаки",
        date: "5 Апреля, 2025",
        author: "Ольга Смирнова"
      },
      {
        id: 8,
        title: "Игрушки для кошек: как выбрать и использовать",
        excerpt: "Обзор игрушек для кошек разного возраста и характера. Как правильно организовать игры для физического и ментального развития.",
        content: "Полный текст статьи об игрушках для кошек...",
        imageUrl: "/images/blog/cat-toys.jpg",
        category: "Кошки",
        date: "25 Марта, 2025",
        author: "Наталья Иванова"
      },
      {
        id: 9,
        title: "Уход за кроликом весной",
        excerpt: "Все, что нужно знать о содержании кроликов в весенний период. Особенности ухода, питания и профилактика заболеваний.",
        content: "Полный текст статьи об уходе за кроликом весной...",
        imageUrl: "/images/blog/rabbit-spring.jpg",
        category: "Грызуны",
        date: "20 Марта, 2025",
        author: "Павел Зайцев"
      },
      {
        id: 10,
        title: "Выбор первого питомца для ребенка",
        excerpt: "Советы родителям по выбору подходящего первого питомца для детей разного возраста. Обязанности и ответственность.",
        content: "Полный текст статьи о выборе питомца для ребенка...",
        imageUrl: "/images/blog/kids-pet.jpg",
        category: "Советы",
        date: "15 Марта, 2025",
        author: "Екатерина Белова"
      },
      {
        id: 11,
        title: "Летний уход за домашними животными",
        excerpt: "Как помочь питомцам пережить жару. Советы по уходу, питанию и обеспечению комфорта в летний период.",
        content: "Полный текст статьи о летнем уходе за животными...",
        imageUrl: "/images/blog/summer-care.jpg",
        category: "Советы",
        date: "10 Марта, 2025",
        author: "Михаил Петров"
      },
      {
        id: 12,
        title: "Как подготовить питомца к переезду",
        excerpt: "Полезные советы, которые помогут сделать переезд менее стрессовым для ваших домашних животных.",
        content: "Полный текст статьи о подготовке питомца к переезду...",
        imageUrl: "/images/blog/moving-with-pets.jpg",
        category: "Советы",
        date: "5 Марта, 2025",
        author: "Анастасия Королева"
      }
    ];

    setPosts(mockPosts);
    setFilteredPosts(mockPosts);
    setTotalPages(Math.ceil(mockPosts.length / postsPerPage));
  }, []);

  // Фильтрация статей по категории
  const filterByCategory = (category: string) => {
    setActiveCategory(category);
    if (category === "Все") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => post.category === category);
      setFilteredPosts(filtered);
    }
    setCurrentPage(1);
    setTotalPages(Math.ceil((category === "Все" ? posts.length : posts.filter(post => post.category === category).length) / postsPerPage));
  };

  // Получение уникальных категорий из статей
  const getCategories = (): string[] => {
    const categories = ["Все", ...new Set(posts.map(post => post.category))];
    return categories;
  };

  // Получение статей для текущей страницы
  const getCurrentPagePosts = (): BlogPost[] => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  };

  // Обработчик изменения страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-[var(--bg-body)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Блог</h1>
        <p className="text-[var(--text-secondary)]">Полезные статьи о домашних животных, советы по уходу и интересные факты</p>
      </div>

      {/* Фильтр по категориям */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Категории животных:</h2>
        <div className="flex flex-wrap gap-2">
          {getCategories().map((category) => (
            <button
              key={category}
              onClick={() => filterByCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeCategory === category
                  ? "bg-[var(--accent-color)] text-[var(--text-primary)]"
                  : "bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Список статей */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {getCurrentPagePosts().map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 border-[var(--border-color)] rounded-md ${
                currentPage === 1
                  ? "text-[var(--text-secondary)] cursor-not-allowed"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 border-[var(--border-color)] rounded-md ${
                  currentPage === page
                    ? "bg-[var(--accent-color)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                currentPage < totalPages && handlePageChange(currentPage + 1)
              }
              disabled={currentPage === totalPages}
              className={`p-2 border-[var(--border-color)] rounded-md ${
                currentPage === totalPages
                  ? "text-[var(--text-secondary)] cursor-not-allowed"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
