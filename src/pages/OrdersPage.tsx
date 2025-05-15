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
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">История заказов</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-gray-600 mb-4">У вас пока нет заказов</p>
          <Link to="/catalog" className="btn-primary inline-block">
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-lg font-bold">Заказ #{order.id.substring(0, 8)}</h2>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    от {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className="font-bold text-lg">{order.totalPrice} ₽</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium mb-2">Товары в заказе:</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={item.product.imageUrl || "https://via.placeholder.com/100"}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-3">
                          <Link to={`/product/${item.product.id}`} className="text-sm font-medium text-gray-800 hover:text-orange-500">
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-gray-500">{item.quantity} шт. × {item.product.price} ₽</p>
                        </div>
                      </div>
                      <span className="font-medium text-gray-800">
                        {item.product.price * item.quantity} ₽
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Адрес доставки:</h3>
                    <p className="text-gray-600">
                      {order.shippingAddress.fullName}<br />
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                      {order.shippingAddress.phone}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Информация о доставке:</h3>
                    <p className="text-gray-600">
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
                <Link to={`/order-success/${order.id}`} className="text-orange-500 hover:text-orange-600 font-medium">
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
