

import images from './images';

const junkFood = [
  {
    title: 'Chicken Tikka Pizza',
    label: 'Popular Dish',
    tags: 'IN | Street Style | Fast Food',
  },
  {
    title: 'Burger',
    label: 'Must Try',
    tags: 'IN | Spicy | Fast Food',
  },
  {
    title: 'Fried Chicken',
    label: 'Crowd Favorite',
    tags: 'IN | Snack | Fast Food',
  },
  {
    title: 'Tandoori Paneer Pizza',
    label: 'Top Pick',
    tags: 'IN | Roll | Fast Food',
  },
  {
    title: 'Peppy Paneer Pizza',
    label: 'Popular Dish',
    tags: 'IN | Wrap | Fast Food',
  },
  {
    title: 'Chicken Lollipop',
    label: 'Popular Dish',
    tags: 'IN | Deep-Fried | Fast Food',
  },
];

const fastFood = [
  {
    title: 'Chicken Fried Rice',
    label: 'Must Try',
    tags: 'IN | Spicy | Tamil Nadu',
  },
  {
    title: 'Chicken Noodles',
    label: 'Top Pick',
    tags: 'IN | Rich Flavor | Tamil Nadu',
  },
  {
    title: 'Chilli Chicken',
    label: 'Popular Dish',
    tags: 'IN | Spicy | Indo-Chinese',
  },
  {
    title: 'Schezwan Fried Rice',
    label: 'Crowd Favorite',
    tags: 'IN | Extra Spicy | Indo-Chinese',
  },
  {
    title: 'Hakka Noodles',
    label: 'Top Pick',
    tags: 'IN | Smoky Flavor | Indo-Chinese',
  },
  {
    title: 'Spring Rolls',
    label: 'Must Try',
    tags: 'IN | Crispy | Indo-Chinese',
  },
];

const awards = [
  {
    imgUrl: images.award01,
    title: 'Most Trusted Food App',
    subtitle: 'Recognized for reliability and safety by over 1 million users.',
  },
  {
    imgUrl: images.award01,
    title: 'Fastest Delivery Network',
    subtitle: 'Awarded for consistently delivering food in record time.',
  },
  {
    imgUrl: images.award01,
    title: 'Best User Experience',
    subtitle: 'Rated top in ease of use, smooth UI, and customer satisfaction.',
  },
  {
    imgUrl: images.award01,
    title: 'Top Startup in FoodTech',
    subtitle: 'Honored for innovation in food delivery and logistics.',
  },
];

// Assigned to a variable before exporting
const data = { fastFood, junkFood, awards };
export default data;