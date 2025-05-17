import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
import { getUserOrders, Order } from "../utils/localStorage";

const OrdersPage: FC = () => {
  const { currentUser } = useContext(AuthContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      // Загружаем заказы пользователя
      const userOrders = getUserOrders(currentUser.id);
      // Сортируем заказы по дате (сначала новые)
      const sortedOrders = userOrders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
    }
    setIsLoading(false);
  }, [currentUser]);

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Получение статуса заказа на русском
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает обработки';
      case 'processing':
        return 'В обработке';
      case 'shipped':
        return 'Отправлен';
      case 'delivered':
        return 'Доставлен';
      case 'cancelled':
        return 'Отменен';
      default:
        return 'Неизвестный статус';
    }
  };

  // Получение цвета статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/20 text-yellow-300';
      case 'processing':
        return 'bg-blue-900/20 text-blue-300';
      case 'shipped':
        return 'bg-purple-900/20 text-purple-300';
      case 'delivered':
        return 'bg-green-900/20 text-[var(--text-primary)]';
      case 'cancelled':
        return 'bg-red-900/20 text-red-300';
      default:
        return 'bg-[var(--bg-secondary)] text-[var(--text-primary)]';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-[var(--bg-body)]">
      <h1 className="text-3xl font-bold mb-4">История заказов</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-color)]"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-sm border border-[var(--border-color)] text-center">
          <p className="text-[var(--text-secondary)] mb-4">У вас пока нет заказов</p>
          <Link to="/catalog" className="btn-primary inline-block">
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-sm border border-[var(--border-color)]">
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-lg font-bold">Заказ #{order.id.substring(0, 8)}</h2>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary)]">
                    от {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className="font-bold text-lg">{order.totalPrice} ₽</span>
                </div>
              </div>
              
              <div className="border-t border-[var(--border-color)] pt-4">
                <h3 className="font-medium mb-2">Товары в заказе:</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 flex-shrink-0 bg-[var(--bg-secondary)] rounded-md overflow-hidden">
                          <img
                            src={item.product.imageUrl || "https://via.placeholder.com/100"}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-3">
                          <Link to={`/product/${item.product.id}`} className="text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent-color)]">
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-[var(--text-secondary)]">{item.quantity} шт. × {item.product.price} ₽</p>
                        </div>
                      </div>
                      <span className="font-medium text-[var(--text-primary)]">
                        {item.product.price * item.quantity} ₽
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-[var(--border-color)] pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Адрес доставки:</h3>
                    <p className="text-[var(--text-secondary)]">
                      {order.shippingAddress.fullName}<br />
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                      {order.shippingAddress.phone}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Информация о доставке:</h3>
                    <p className="text-[var(--text-secondary)]">
                      Способ доставки: {order.deliveryMethod === 'courier' ? 'Курьер' : 
                                        order.deliveryMethod === 'pickup' ? 'Почта России' : 
                                        'Самовывоз'}
                      <br />
                      {order.deliveryDate && order.deliveryTime && order.deliveryMethod !== 'selfPickup' && (
                        <>
                          Дата доставки: {order.deliveryDate}<br />
                          Время доставки: {order.deliveryTime}
                        </>
                      )}
                      <br />
                      Способ оплаты: {order.paymentMethod === 'card' ? 'Банковская карта' : 
                                     order.paymentMethod === 'sbp' ? 'Система быстрых платежей' : 
                                     'Оплата при получении'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Link to={`/order-success/${order.id}`} className="text-[var(--accent-color)] hover:text-[var(--accent-hover)] font-medium">
                  Подробнее о заказе
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
