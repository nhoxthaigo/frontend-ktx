import React from 'react';
import { FaMoneyBill, FaCalculator, FaCheck, FaUsers } from 'react-icons/fa';

const ElectricityStatisticsCards = ({ statistics }) => {
  if (!statistics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const cards = [
    {
      title: 'Tổng hóa đơn phòng',
      value: statistics.overview?.totalRoomBills || 0,
      icon: FaCalculator,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      valueColor: 'text-blue-900'
    },
    {
      title: 'Tổng hóa đơn sinh viên',
      value: statistics.overview?.totalStudentBills || 0,
      icon: FaUsers,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      valueColor: 'text-green-900'
    },
    {
      title: 'Tổng số tiền',
      value: formatCurrency(statistics.overview?.totalBillAmount || 0),
      icon: FaMoneyBill,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      valueColor: 'text-yellow-900'
    },
    {
      title: 'Tỷ lệ thanh toán',
      value: `${statistics.paymentRate || 0}%`,
      icon: FaCheck,
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-800',
      valueColor: 'text-purple-900'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div key={index} className={`${card.bgColor} ${card.borderColor} border rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`${card.textColor} text-sm font-medium mb-2`}>
                  {card.title}
                </h4>
                <p className={`${card.valueColor} text-2xl font-bold`}>
                  {card.value}
                </p>
              </div>
              <div className={`p-3 ${card.bgColor} rounded-lg`}>
                <IconComponent className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ElectricityStatisticsCards;
