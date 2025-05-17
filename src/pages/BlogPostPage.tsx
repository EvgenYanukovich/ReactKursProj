import { FC, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

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

const BlogPostPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // В реальном приложении здесь был бы запрос к API
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        // Имитация загрузки данных
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Моковые данные для статей
        const mockPosts: BlogPost[] = [
          {
            id: 1,
            title: "10 важных правил ухода за щенком",
            excerpt: "Узнайте о важных правилах ухода за щенком в первые месяцы его жизни. Советы ветеринаров и опытных заводчиков.",
            content: `<p>Появление щенка в доме – это радостное событие, но оно также требует ответственности и знаний о правильном уходе. В первые месяцы жизни щенка закладывается основа его здоровья и поведения в будущем.</p>
            <h2>1. Правильное питание</h2>
            <p>Щенки нуждаются в специальном питании, богатом белками, витаминами и минералами. Кормите щенка 3-4 раза в день небольшими порциями. Выбирайте корм, соответствующий возрасту, размеру и породе вашего питомца.</p>
            <h2>2. Регулярные посещения ветеринара</h2>
            <p>В первый год жизни щенок должен регулярно посещать ветеринара для вакцинации, дегельминтизации и профилактических осмотров. Составьте график прививок вместе с ветеринаром.</p>
            <h2>3. Социализация</h2>
            <p>Знакомьте щенка с разными людьми, животными и ситуациями с раннего возраста. Это поможет ему вырасти уравновешенной и дружелюбной собакой.</p>
            <h2>4. Дрессировка с раннего возраста</h2>
            <p>Начинайте обучение базовым командам с 2-3 месяцев. Используйте позитивное подкрепление – лакомства и похвалу за правильное выполнение команд.</p>
            <h2>5. Физическая активность</h2>
            <p>Щенки полны энергии и нуждаются в регулярных прогулках и играх. Однако не перегружайте молодой организм – длительность и интенсивность нагрузок должны соответствовать возрасту.</p>
            <h2>6. Уход за шерстью</h2>
            <p>Приучайте щенка к регулярному расчесыванию с раннего возраста. Частота процедур зависит от типа шерсти вашей собаки.</p>
            <h2>7. Уход за зубами</h2>
            <p>Начинайте чистить зубы щенку специальной щеткой и пастой для собак, чтобы предотвратить образование зубного камня и проблемы с деснами в будущем.</p>
            <h2>8. Безопасность дома</h2>
            <p>Щенки очень любопытны и могут попасть в опасную ситуацию. Уберите все потенциально опасные предметы, химические вещества и растения, которые могут быть токсичны для собак.</p>
            <h2>9. Режим сна</h2>
            <p>Щенки нуждаются в большом количестве сна – до 18-20 часов в сутки. Обеспечьте питомцу удобное и тихое место для отдыха.</p>
            <h2>10. Любовь и внимание</h2>
            <p>Щенку необходимо ваше внимание, забота и ласка. Проводите с ним время, играйте и общайтесь – это поможет сформировать крепкую связь между вами и вашим питомцем.</p>
            <p>Следуя этим простым правилам, вы обеспечите своему щенку здоровое и счастливое детство, а себе – верного и воспитанного друга на долгие годы.</p>`,
            imageUrl: "/images/blog/puppy-care.jpg",
            category: "Собаки",
            date: "12 Мая, 2025",
            author: "Анна Петрова",
            tags: ["щенки", "уход", "советы", "здоровье"]
          },
          {
            id: 2,
            title: "Как правильно ухаживать за шерстью кошки",
            excerpt: "Советы по уходу за шерстью кошек разных пород. Какие инструменты использовать и как часто проводить груминг.",
            content: "Полный текст статьи об уходе за шерстью кошки...",
            imageUrl: "/images/blog/cat-grooming.jpg",
            category: "Кошки",
            date: "5 Мая, 2025",
            author: "Мария Сидорова",
            tags: ["кошки", "груминг", "шерсть", "уход"]
          },
          {
            id: 3,
            title: "Оформление аквариума для начинающих",
            excerpt: "Подробная инструкция по созданию красивого и здорового аквариума. Выбор растений, грунта и декораций.",
            content: "Полный текст статьи об оформлении аквариума...",
            imageUrl: "/images/blog/aquarium.jpg",
            category: "Рыбки",
            date: "25 Апреля, 2025",
            author: "Игорь Волков",
            tags: ["аквариум", "рыбки", "оформление", "начинающим"]
          },
          // Другие статьи...
        ];
        
        const postId = parseInt(id || "0");
        const foundPost = mockPosts.find(p => p.id === postId);
        
        if (foundPost) {
          setPost(foundPost);
          
          // Находим связанные статьи той же категории
          const related = mockPosts
            .filter(p => p.id !== postId && p.category === foundPost.category)
            .slice(0, 3);
          setRelatedPosts(related);
        }
      } catch (error) {
        console.error("Ошибка при загрузке статьи:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t border-[var(--border-color)]-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Статья не найдена</h1>
        <p className="mb-4">К сожалению, запрашиваемая статья не существует или была удалена.</p>
        <Link to="/blog" className="text-orange-500 hover:text-[var(--accent-hover)]">
          Вернуться к блогу
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[var(--bg-body)]">
      {/* Хлебные крошки */}
      <div className="flex items-center mb-6 text-sm">
        <Link to="/" className="text-[var(--text-secondary)] hover:text-[var(--accent-color)]">
          Главная
        </Link>
        <span className="mx-2 text-[var(--text-secondary)]">&gt;</span>
        <Link to="/blog" className="text-[var(--text-secondary)] hover:text-[var(--accent-color)]">
          Блог
        </Link>
        <span className="mx-2 text-[var(--text-secondary)]">&gt;</span>
        <Link 
          to={`/blog?category=${post.category}`} 
          className="text-[var(--text-secondary)] hover:text-[var(--accent-color)]"
        >
          {post.category}
        </Link>
        <span className="mx-2 text-[var(--text-secondary)]">&gt;</span>
        <span className="text-[var(--text-primary)]">{post.title}</span>
      </div>

      {/* Заголовок и метаданные */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-[var(--text-secondary)] text-sm">
          <span>{post.date}</span>
          <span className="mx-2">•</span>
          <span>Автор: {post.author}</span>
          <span className="mx-2">•</span>
          <Link to={`/blog?category=${post.category}`} className="text-orange-500 hover:text-[var(--accent-hover)]">
            {post.category}
          </Link>
        </div>
      </div>

      {/* Изображение статьи */}
      <div className="mb-8">
        <img
          src={post.imageUrl || "https://via.placeholder.com/1200x600"}
          alt={post.title}
          className="w-full h-auto rounded-lg"
        />
      </div>

      {/* Содержимое статьи */}
      <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* Теги */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-2">Теги:</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/blog?tag=${tag}`}
                className="px-3 py-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-full text-sm hover:bg-[var(--bg-hover)]"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Связанные статьи */}
      {relatedPosts.length > 0 && (
        <div className="border-t border-[var(--border-color)] pt-8">
          <h2 className="text-2xl font-bold mb-6">Похожие статьи</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <div key={relatedPost.id} className="bg-[var(--bg-primary)] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <Link to={`/blog/${relatedPost.id}`}>
                  <img
                    src={relatedPost.imageUrl || "https://via.placeholder.com/400x250"}
                    alt={relatedPost.title}
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <div className="text-[var(--text-secondary)] text-xs mb-2">{relatedPost.date}</div>
                  <h3 className="font-bold text-lg mb-2">
                    <Link to={`/blog/${relatedPost.id}`} className="hover:text-[var(--accent-color)]">
                      {relatedPost.title}
                    </Link>
                  </h3>
                  <p className="text-[var(--text-primary)] text-sm mb-4 line-clamp-2">{relatedPost.excerpt}</p>
                  <div className="flex justify-end">
                    <Link
                      to={`/blog/${relatedPost.id}`}
                      className="text-orange-500 hover:text-[var(--accent-hover)] font-medium text-sm"
                    >
                      Читать далее →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostPage;
