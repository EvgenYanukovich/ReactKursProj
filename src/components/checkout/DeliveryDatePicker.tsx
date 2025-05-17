import { FC, useState, useEffect } from "react";

interface DeliveryDatePickerProps {
  onDateSelect: (date: string, time: string) => void;
  selectedDeliveryMethod: string;
}

const DeliveryDatePicker: FC<DeliveryDatePickerProps> = ({ onDateSelect, selectedDeliveryMethod }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("10:00 - 12:00");
  const [calendar, setCalendar] = useState<Date[][]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Временные интервалы для доставки
  const timeSlots = [
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
    "18:00 - 20:00"
  ];

  // Генерация календаря для текущего месяца
  useEffect(() => {
    const generateCalendar = () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      
      // Первый день месяца
      const firstDay = new Date(year, month, 1);
      // Последний день месяца
      const lastDay = new Date(year, month + 1, 0);
      
      // День недели первого дня (0 - воскресенье, 1 - понедельник, и т.д.)
      let firstDayOfWeek = firstDay.getDay();
      // Преобразуем, чтобы понедельник был первым днем недели
      firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
      
      const daysInMonth = lastDay.getDate();
      
      // Создаем массив для календаря
      const calendarArray: Date[][] = [];
      let week: Date[] = [];
      
      // Добавляем пустые ячейки для дней предыдущего месяца
      for (let i = 0; i < firstDayOfWeek; i++) {
        const prevMonthDay = new Date(year, month, -firstDayOfWeek + i + 1);
        week.push(prevMonthDay);
      }
      
      // Добавляем дни текущего месяца
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        week.push(date);
        
        // Если это конец недели или последний день месяца
        if (week.length === 7 || day === daysInMonth) {
          // Если неделя не полная, добавляем дни следующего месяца
          while (week.length < 7) {
            const nextMonthDay = new Date(year, month, day + week.length - 6);
            week.push(nextMonthDay);
          }
          
          calendarArray.push(week);
          week = [];
        }
      }
      
      setCalendar(calendarArray);
    };
    
    generateCalendar();
  }, [currentMonth]);

  // Обработчик выбора даты
  const handleDateSelect = (date: Date) => {
    // Проверяем, что дата не в прошлом
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
      return; // Не позволяем выбирать прошедшие даты
    }
    
    // Форматируем дату в строку
    const formattedDate = date.toLocaleDateString('ru-RU');
    setSelectedDate(formattedDate);
    
    // Вызываем колбэк с выбранной датой и временем
    onDateSelect(formattedDate, selectedTime);
  };

  // Обработчик выбора времени
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    
    // Если дата уже выбрана, вызываем колбэк
    if (selectedDate) {
      onDateSelect(selectedDate, time);
    }
  };

  // Переход к предыдущему месяцу
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Переход к следующему месяцу
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Проверка, является ли дата выбранной
  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    
    const formattedDate = date.toLocaleDateString('ru-RU');
    return formattedDate === selectedDate;
  };

  // Проверка, является ли дата сегодняшней
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Проверка, является ли дата в прошлом
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Проверка, является ли дата в текущем месяце
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  // Форматирование названия месяца
  const formatMonth = (date: Date) => {
    return date.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
  };

  // Дни недели
  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-4">Дата доставки</h2>
      
      {/* Если выбран самовывоз, не показываем календарь */}
      {selectedDeliveryMethod === "selfPickup" ? (
        <p className="text-[var(--text-secondary)]">При самовывозе вы можете забрать заказ в любое удобное время в часы работы магазина.</p>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm text-[var(--text-secondary)] mb-2">Выберите дату*</p>
            
            {/* Календарь */}
            <div className="border border-[var(--border-color)] rounded-md">
              {/* Заголовок календаря */}
              <div className="flex justify-between items-center p-3 border-b border-[var(--border-color)]">
                <button 
                  onClick={goToPreviousMonth}
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <h3 className="text-lg font-medium text-[var(--text-primary)] capitalize">
                  {formatMonth(currentMonth)}
                </h3>
                <button 
                  onClick={goToNextMonth}
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {/* Дни недели */}
              <div className="grid grid-cols-7 text-center py-2 border-b border-[var(--border-color)]">
                {weekdays.map((day, index) => (
                  <div key={index} className="text-sm font-medium text-[var(--text-secondary)]">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Дни месяца */}
              <div className="divide-y divide-gray-200">
                {calendar.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7">
                    {week.map((date, dateIndex) => (
                      <button
                        key={dateIndex}
                        onClick={() => handleDateSelect(date)}
                        disabled={isPastDate(date)}
                        className={`
                          py-3 text-center text-sm
                          ${isCurrentMonth(date) ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}
                          ${isPastDate(date) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--bg-hover)]'}
                          ${isDateSelected(date) ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)] font-medium' : ''}
                          ${isToday(date) && !isDateSelected(date) ? 'border border-[var(--accent-color)]' : ''}
                        `}
                      >
                        {date.getDate()}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Выбор времени */}
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-2">Выберите время*</p>
            <select
              value={selectedTime}
              onChange={(e) => handleTimeSelect(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default DeliveryDatePicker;
