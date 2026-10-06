const fallbackOrders = [
  {
    _id: '65e000000000000000000101',
    orderId: 'ORD-892401',
    user: '65e000000000000000000002',
    userName: 'Test Customer',
    userEmail: 'test@foodova.com',
    userPhone: '+91 9123456789',
    status: 'cooking',
    items: [
      {
        product: 'burger-1',
        name: 'The Truffle Swiss Beast',
        thumbnail: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=800&fit=crop',
        price: 349,
        quantity: 1,
        itemTotal: 349
      },
      {
        product: 'snack-1',
        name: 'Peri-Peri Golden Crinkle Fries',
        thumbnail: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=800&fit=crop',
        price: 139,
        quantity: 1,
        itemTotal: 139
      }
    ],
    subtotal: 488,
    discount: 0,
    tax: 24,
    deliveryFee: 0,
    total: 512,
    address: {
      fullAddress: '123, Palm Grove Avenue, Indiranagar, Bangalore, Karnataka - 560038',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038'
    },
    paymentMethod: 'cod',
    estimatedDeliveryTime: new Date(Date.now() + 25 * 60 * 1000),
    createdAt: new Date(Date.now() - 10 * 60 * 1000)
  }
];

const getFallbackOrdersByUser = (userId) => {
  const strId = userId ? userId.toString() : '';
  return fallbackOrders.filter(o => !o.user || o.user.toString() === strId || strId === '65e000000000000000000002');
};

const getFallbackOrderById = (orderIdOrDbId) => {
  return fallbackOrders.find(o => o.orderId === orderIdOrDbId || o._id === orderIdOrDbId) || null;
};

const addFallbackOrder = (orderData) => {
  const newOrder = {
    _id: '65e0000000000000' + Date.now().toString(16).slice(-8),
    orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    status: 'confirmed',
    createdAt: new Date(),
    estimatedDeliveryTime: new Date(Date.now() + 35 * 60 * 1000),
    ...orderData
  };
  fallbackOrders.unshift(newOrder);
  return newOrder;
};

module.exports = {
  fallbackOrders,
  getFallbackOrdersByUser,
  getFallbackOrderById,
  addFallbackOrder
};
