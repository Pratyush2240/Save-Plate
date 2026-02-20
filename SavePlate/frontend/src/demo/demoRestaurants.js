export function getDemoRestaurants() {
  return [
    {
      id: 'r-1',
      name: 'Green Leaf Bistro',
      cuisine: 'Healthy • Salads',
      city: 'Bengaluru',
      offers: [
        { id: 'o-1', name: 'Surplus Salad Bowl', price: 100 },
        { id: 'o-2', name: 'Veg Wrap Combo', price: 120 }
      ]
    },
    {
      id: 'r-2',
      name: 'Spice Route Kitchen',
      cuisine: 'Indian • Thali',
      city: 'Mumbai',
      offers: [
        { id: 'o-3', name: 'Mini Thali (Surplus)', price: 100 },
        { id: 'o-4', name: 'Veg Biryani Box', price: 100 }
      ]
    },
    {
      id: 'r-3',
      name: 'Urban Slice',
      cuisine: 'Pizza • Italian',
      city: 'Delhi',
      offers: [
        { id: 'o-5', name: '2 Slices + Drink', price: 100 }
      ]
    }
  ];
}


