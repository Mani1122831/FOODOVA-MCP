// FOODOVA Authentic Master Culinary Dataset
// Powered by high-resolution food photography (Pizzas, Cool Drinks, Chips, Burgers)
const categories = [
  {
    "_id": "cat_burgers",
    "id": "cat_burgers",
    "name": "Burgers",
    "slug": "burgers",
    "icon": "🍔",
    "color": "#FF6B35",
    "sortOrder": 1,
    "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&h=120&fit=crop",
    "itemCount": 24
  },
  {
    "_id": "cat_recommended",
    "id": "cat_recommended",
    "name": "Recommended",
    "slug": "recommended",
    "icon": "⭐",
    "color": "#F59E0B",
    "sortOrder": 2,
    "image": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=120&h=120&fit=crop",
    "itemCount": 16
  },
  {
    "_id": "cat_combos",
    "id": "cat_combos",
    "name": "Combos & Meals",
    "slug": "combos",
    "icon": "🍟",
    "color": "#EC4899",
    "sortOrder": 3,
    "image": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=120&h=120&fit=crop",
    "itemCount": 8
  },
  {
    "_id": "cat_pizza",
    "id": "cat_pizza",
    "name": "Pizza",
    "slug": "pizza",
    "icon": "🍕",
    "color": "#EF4444",
    "sortOrder": 4,
    "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&h=120&fit=crop",
    "itemCount": 10
  },
  {
    "_id": "cat_chicken",
    "id": "cat_chicken",
    "name": "Fried Chicken",
    "slug": "fried-chicken",
    "icon": "🍗",
    "color": "#EA580C",
    "sortOrder": 5,
    "image": "https://images.unsplash.com/photo-1562967914-608f82629710?w=120&h=120&fit=crop",
    "itemCount": 8
  },
  {
    "_id": "cat_wraps",
    "id": "cat_wraps",
    "name": "Wraps & Rolls",
    "slug": "wraps",
    "icon": "🌯",
    "color": "#10B981",
    "sortOrder": 6,
    "image": "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=120&h=120&fit=crop",
    "itemCount": 6
  },
  {
    "_id": "cat_fries",
    "id": "cat_fries",
    "name": "Fries & Sides",
    "slug": "fries-sides",
    "icon": "🍟",
    "color": "#EAB308",
    "sortOrder": 7,
    "image": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=120&h=120&fit=crop",
    "itemCount": 8
  },
  {
    "_id": "cat_desserts",
    "id": "cat_desserts",
    "name": "Desserts & Shakes",
    "slug": "desserts",
    "icon": "🍦",
    "color": "#8B5CF6",
    "sortOrder": 8,
    "image": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=120&h=120&fit=crop",
    "itemCount": 8
  },
  {
    "_id": "cat_beverages",
    "id": "cat_beverages",
    "name": "Beverages",
    "slug": "beverages",
    "icon": "🥤",
    "color": "#06B6D4",
    "sortOrder": 9,
    "image": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=120&h=120&fit=crop",
    "itemCount": 6
  }
];

const products = [
  {
    "_id": "burger_01",
    "id": "burger_01",
    "name": "Premium Veg Royale Burger",
    "slug": "premium-veg-royale-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "A towering stack of fresh crispy vegetables, premium melted cheddar cheese, and signature secret sauce on a toasted artisan brioche bun.",
    "price": 329,
    "discountPrice": 249,
    "discountPercentage": 24,
    "isVeg": true,
    "spiceLevel": "mild",
    "thumbnail": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Toasted Brioche Bun",
      "Crispy Veggie Patty",
      "Aged Cheddar",
      "Romaine Lettuce",
      "Heirloom Tomato",
      "Signature Royale Sauce"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 480,
      "protein": 14,
      "carbs": 52,
      "fat": 22
    },
    "rating": {
      "average": 4.8,
      "count": 542
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 12,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_02",
    "id": "burger_02",
    "name": "Classic American Cheeseburger",
    "slug": "classic-american-cheeseburger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Tender juicy grilled patty, double melted American cheddar, crispy iceberg lettuce, sliced tomatoes, dill pickles, and house burger sauce.",
    "price": 249,
    "discountPrice": 199,
    "discountPercentage": 20,
    "isVeg": false,
    "spiceLevel": "mild",
    "thumbnail": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Grilled Beef-Style Patty",
      "American Cheddar",
      "Dill Pickles",
      "Sliced Tomato",
      "Mustard Mayo",
      "Sesame Bun"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 520,
      "protein": 28,
      "carbs": 44,
      "fat": 26
    },
    "rating": {
      "average": 4.7,
      "count": 689
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 10,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_03",
    "id": "burger_03",
    "name": "Spicy Fiesta Chicken Burger",
    "slug": "spicy-fiesta-chicken-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Crispy fried chicken breast fillet, pickled jalapeños, fiery habanero mayo, and crunchy slaw on a butter-toasted sesame seed bun.",
    "price": 349,
    "discountPrice": 279,
    "discountPercentage": 20,
    "isVeg": false,
    "spiceLevel": "spicy",
    "thumbnail": "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Crispy Chicken Fillet",
      "Spicy Jalapeños",
      "Habanero Slaw",
      "Chipotle Sauce",
      "Sesame Bun"
    ],
    "allergens": [
      "Gluten",
      "Dairy",
      "Eggs"
    ],
    "nutrition": {
      "calories": 580,
      "protein": 32,
      "carbs": 48,
      "fat": 29
    },
    "rating": {
      "average": 4.9,
      "count": 820
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 14,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_04",
    "id": "burger_04",
    "name": "Double Decker Supreme Burger",
    "slug": "double-decker-supreme-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Two seasoned patties, double melted cheese, special secret recipe relish, caramelized onions, and crunchy pickles on a sesame brioche.",
    "price": 399,
    "discountPrice": 319,
    "discountPercentage": 20,
    "isVeg": false,
    "spiceLevel": "medium",
    "thumbnail": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Double Patty",
      "Double Cheddar",
      "Caramelized Onions",
      "Dill Pickles",
      "House Secret Dressing"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 740,
      "protein": 44,
      "carbs": 52,
      "fat": 38
    },
    "rating": {
      "average": 4.8,
      "count": 412
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 15,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_05",
    "id": "burger_05",
    "name": "Crispy Paneer Burst Burger",
    "slug": "crispy-paneer-burst-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Thick golden-fried cottage cheese patty marinated in aromatic tandoori herbs, loaded with fresh mint mayo and crunchy red onions.",
    "price": 279,
    "discountPrice": 229,
    "discountPercentage": 18,
    "isVeg": true,
    "spiceLevel": "medium",
    "thumbnail": "https://images.unsplash.com/photo-1586816001966-79b736744398?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1586816001966-79b736744398?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1586816001966-79b736744398?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Tandoori Paneer Patty",
      "Mint Aioli",
      "Crunchy Onions",
      "Crispy Lettuce",
      "Whole Wheat Brioche"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 460,
      "protein": 22,
      "carbs": 44,
      "fat": 20
    },
    "rating": {
      "average": 4.6,
      "count": 390
    },
    "isFeatured": false,
    "isNewLaunch": true,
    "preparationTime": 12,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_06",
    "id": "burger_06",
    "name": "BBQ Smoked Bacon Burger",
    "slug": "bbq-smoked-bacon-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Flame-grilled patty brushed with Hickory smoked BBQ glaze, crispy savory bacon, melted pepper jack cheese, and crispy onion strings.",
    "price": 359,
    "discountPrice": 289,
    "discountPercentage": 19,
    "isVeg": false,
    "spiceLevel": "medium",
    "thumbnail": "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Grilled Patty",
      "Hickory BBQ Glaze",
      "Crispy Bacon",
      "Pepper Jack Cheese",
      "Crispy Onion Strings"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 640,
      "protein": 36,
      "carbs": 46,
      "fat": 34
    },
    "rating": {
      "average": 4.7,
      "count": 512
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 14,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_07",
    "id": "burger_07",
    "name": "Mushroom Truffle Swiss Burger",
    "slug": "mushroom-truffle-swiss-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Sautéed wild button mushrooms, rich aromatic white truffle aioli, melted Swiss cheese, and baby arugula on a warm potato bun.",
    "price": 369,
    "discountPrice": 299,
    "discountPercentage": 19,
    "isVeg": true,
    "spiceLevel": "none",
    "thumbnail": "https://images.unsplash.com/photo-1583032015879-c5531d0ebcdb?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1583032015879-c5531d0ebcdb?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1583032015879-c5531d0ebcdb?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Wild Mushrooms",
      "Swiss Cheese",
      "White Truffle Aioli",
      "Arugula",
      "Artisan Potato Bun"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 490,
      "protein": 18,
      "carbs": 46,
      "fat": 24
    },
    "rating": {
      "average": 4.8,
      "count": 284
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 15,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_08",
    "id": "burger_08",
    "name": "Maharaja Mac Double Patty",
    "slug": "maharaja-mac-double-patty",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Iconic two-tier burger with double spiced patties, thousand island dressing, crisp shredded lettuce, and three toasted sesame buns.",
    "price": 399,
    "discountPrice": 339,
    "discountPercentage": 15,
    "isVeg": false,
    "spiceLevel": "medium",
    "thumbnail": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Double Spiced Patties",
      "3-Tier Bun",
      "Thousand Island Relish",
      "Shredded Lettuce",
      "Melty Cheese"
    ],
    "allergens": [
      "Gluten",
      "Dairy",
      "Eggs"
    ],
    "nutrition": {
      "calories": 710,
      "protein": 38,
      "carbs": 62,
      "fat": 36
    },
    "rating": {
      "average": 4.9,
      "count": 940
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 16,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_09",
    "id": "burger_09",
    "name": "Crispy Fish Fillet & Tartar Burger",
    "slug": "crispy-fish-fillet-tartar-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Golden flaky wild ocean whitefish fillet coated in panko crumbs, topped with zesty herb tartar sauce and a slice of cheddar cheese.",
    "price": 319,
    "discountPrice": 269,
    "discountPercentage": 16,
    "isVeg": false,
    "spiceLevel": "none",
    "thumbnail": "https://images.unsplash.com/photo-1582196016295-f8c8bd4b3e99?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1582196016295-f8c8bd4b3e99?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1582196016295-f8c8bd4b3e99?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Flaky Whitefish Fillet",
      "Panko Breading",
      "Dill Tartar Sauce",
      "Cheddar Cheese",
      "Steamed Bun"
    ],
    "allergens": [
      "Gluten",
      "Dairy",
      "Fish",
      "Eggs"
    ],
    "nutrition": {
      "calories": 470,
      "protein": 24,
      "carbs": 46,
      "fat": 21
    },
    "rating": {
      "average": 4.5,
      "count": 320
    },
    "isFeatured": false,
    "isNewLaunch": false,
    "preparationTime": 12,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_10",
    "id": "burger_10",
    "name": "Jalapeño Popper Crunch Burger",
    "slug": "jalapeno-popper-crunch-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Crispy patty stuffed with warm melted cream cheese and diced jalapeños, topped with crunchy onion rings and spicy chipotle aioli.",
    "price": 319,
    "discountPrice": 259,
    "discountPercentage": 19,
    "isVeg": true,
    "spiceLevel": "spicy",
    "thumbnail": "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Cream Cheese & Jalapeño Patty",
      "Crispy Onion Rings",
      "Chipotle Aioli",
      "Lettuce",
      "Brioche Bun"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 510,
      "protein": 16,
      "carbs": 54,
      "fat": 26
    },
    "rating": {
      "average": 4.7,
      "count": 410
    },
    "isFeatured": false,
    "isNewLaunch": true,
    "preparationTime": 13,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_11",
    "id": "burger_11",
    "name": "Fiery Peri-Peri Chicken Burger",
    "slug": "fiery-peri-peri-chicken-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "African bird’s eye chili marinated chicken breast, charred to perfection with garlic peri-peri emulsion and crispy pickled red onions.",
    "price": 349,
    "discountPrice": 289,
    "discountPercentage": 17,
    "isVeg": false,
    "spiceLevel": "extra-spicy",
    "thumbnail": "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Peri-Peri Charred Chicken",
      "Garlic Peri-Peri Sauce",
      "Pickled Onions",
      "Crisp Iceberg",
      "Toasted Bun"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 540,
      "protein": 34,
      "carbs": 42,
      "fat": 25
    },
    "rating": {
      "average": 4.8,
      "count": 620
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 14,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_12",
    "id": "burger_12",
    "name": "Spicy Aloo Tikki Royale Burger",
    "slug": "spicy-aloo-tikki-royale-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Crispy golden potato and tender green pea patty infused with authentic roasted chaat spices, sweet tamarind drizzle, and crunchy onions.",
    "price": 189,
    "discountPrice": 149,
    "discountPercentage": 21,
    "isVeg": true,
    "spiceLevel": "medium",
    "thumbnail": "https://images.unsplash.com/photo-1550317138-10000687a72b?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1550317138-10000687a72b?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1550317138-10000687a72b?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Golden Spiced Potato Patty",
      "Tamarind Chutney",
      "Mint Aioli",
      "Sliced Onions",
      "Toasted Bun"
    ],
    "allergens": [
      "Gluten"
    ],
    "nutrition": {
      "calories": 380,
      "protein": 10,
      "carbs": 54,
      "fat": 14
    },
    "rating": {
      "average": 4.6,
      "count": 1120
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 9,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_13",
    "id": "burger_13",
    "name": "Cheesy Lava Molten Crunch Burger",
    "slug": "cheesy-lava-molten-crunch-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Crispy herb-crusted patty stuffed with molten mozzarella and cheddar that oozes warm cheese with every bite, topped with spicy tomato relish.",
    "price": 369,
    "discountPrice": 299,
    "discountPercentage": 19,
    "isVeg": true,
    "spiceLevel": "mild",
    "thumbnail": "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Molten Cheese Patty",
      "Warm Cheddar Drizzle",
      "Spicy Relish",
      "Lettuce",
      "Brioche Bun"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 620,
      "protein": 22,
      "carbs": 48,
      "fat": 34
    },
    "rating": {
      "average": 4.9,
      "count": 570
    },
    "isFeatured": true,
    "isNewLaunch": true,
    "preparationTime": 13,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_14",
    "id": "burger_14",
    "name": "Bacon & Cheddar Deluxe Burger",
    "slug": "bacon-cheddar-deluxe-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Thick grilled gourmet patty topped with double crispy smoked bacon strips, aged Wisconsin cheddar, roasted garlic aioli, and caramelized onions.",
    "price": 399,
    "discountPrice": 329,
    "discountPercentage": 18,
    "isVeg": false,
    "spiceLevel": "mild",
    "thumbnail": "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Grilled Beef Patty",
      "Crispy Smoked Bacon",
      "Aged Cheddar",
      "Garlic Aioli",
      "Brioche Bun"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 680,
      "protein": 42,
      "carbs": 44,
      "fat": 36
    },
    "rating": {
      "average": 4.8,
      "count": 710
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 15,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_15",
    "id": "burger_15",
    "name": "Korean Gochujang Crispy Burger",
    "slug": "korean-gochujang-crispy-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Double fried crunchy chicken dipped in sweet and spicy fermented Gochujang chili glaze, tangy kimchi slaw, and toasted black sesame seeds.",
    "price": 349,
    "discountPrice": 289,
    "discountPercentage": 17,
    "isVeg": false,
    "spiceLevel": "spicy",
    "thumbnail": "https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Korean Fried Chicken",
      "Gochujang Glaze",
      "Kimchi Slaw",
      "Kewpie Mayo",
      "Sesame Bun"
    ],
    "allergens": [
      "Gluten",
      "Soy",
      "Eggs"
    ],
    "nutrition": {
      "calories": 590,
      "protein": 32,
      "carbs": 54,
      "fat": 28
    },
    "rating": {
      "average": 4.9,
      "count": 480
    },
    "isFeatured": false,
    "isNewLaunch": true,
    "preparationTime": 14,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_16",
    "id": "burger_16",
    "name": "Teriyaki Glazed Chicken Burger",
    "slug": "teriyaki-glazed-chicken-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Sweet and savory teriyaki-glazed grilled chicken fillet, caramelized pineapple ring, fresh crisp lettuce, and Japanese Kewpie mayonnaise.",
    "price": 329,
    "discountPrice": 269,
    "discountPercentage": 18,
    "isVeg": false,
    "spiceLevel": "none",
    "thumbnail": "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Teriyaki Chicken Fillet",
      "Grilled Pineapple",
      "Kewpie Mayo",
      "Romaine Lettuce",
      "Sesame Bun"
    ],
    "allergens": [
      "Gluten",
      "Soy",
      "Eggs"
    ],
    "nutrition": {
      "calories": 510,
      "protein": 30,
      "carbs": 52,
      "fat": 20
    },
    "rating": {
      "average": 4.7,
      "count": 340
    },
    "isFeatured": false,
    "isNewLaunch": false,
    "preparationTime": 13,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_17",
    "id": "burger_17",
    "name": "Triple Smash Monster Burger",
    "slug": "triple-smash-monster-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Three ultra-thin smashed patties with lacy crispy caramelized edges, triple melted cheddar cheese slices, grilled onions, and house smash sauce.",
    "price": 479,
    "discountPrice": 399,
    "discountPercentage": 17,
    "isVeg": false,
    "spiceLevel": "medium",
    "thumbnail": "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Triple Smashed Patties",
      "Triple Cheddar",
      "Grilled Onions",
      "Smash Burger Sauce",
      "Brioche Bun"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 880,
      "protein": 56,
      "carbs": 46,
      "fat": 52
    },
    "rating": {
      "average": 4.9,
      "count": 780
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 16,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_18",
    "id": "burger_18",
    "name": "Gourmet Black Angus Style Burger",
    "slug": "gourmet-black-angus-style-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Prime seasoned gourmet patty with coarse cracked black pepper, slow-cooked balsamic onion jam, smoked gouda cheese, and grain dijon mustard.",
    "price": 429,
    "discountPrice": 359,
    "discountPercentage": 16,
    "isVeg": false,
    "spiceLevel": "mild",
    "thumbnail": "https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Angus Style Patty",
      "Smoked Gouda",
      "Balsamic Onion Jam",
      "Dijon Mustard",
      "Brioche"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 690,
      "protein": 44,
      "carbs": 42,
      "fat": 38
    },
    "rating": {
      "average": 4.8,
      "count": 430
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 15,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_19",
    "id": "burger_19",
    "name": "Garden Fresh Guacamole Veggie Burger",
    "slug": "garden-fresh-guacamole-veggie-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Savory black bean, roasted sweet potato, and organic quinoa patty crowned with freshly mashed Haas avocado guacamole and spicy pico de gallo.",
    "price": 299,
    "discountPrice": 249,
    "discountPercentage": 17,
    "isVeg": true,
    "spiceLevel": "mild",
    "thumbnail": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Black Bean Quinoa Patty",
      "Fresh Guacamole",
      "Pico de Gallo",
      "Arugula",
      "Whole Grain Bun"
    ],
    "allergens": [
      "Gluten"
    ],
    "nutrition": {
      "calories": 430,
      "protein": 16,
      "carbs": 56,
      "fat": 16
    },
    "rating": {
      "average": 4.7,
      "count": 310
    },
    "isFeatured": false,
    "isNewLaunch": true,
    "preparationTime": 12,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_20",
    "id": "burger_20",
    "name": "Smoky Pulled Chicken Burger",
    "slug": "smoky-pulled-chicken-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Slow-cooked succulent shredded chicken tossed in sweet molasses BBQ sauce, topped with creamy apple cider coleslaw on a buttered brioche bun.",
    "price": 339,
    "discountPrice": 279,
    "discountPercentage": 18,
    "isVeg": false,
    "spiceLevel": "medium",
    "thumbnail": "https://images.unsplash.com/photo-1549611016-3a70d82b5040?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1549611016-3a70d82b5040?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1549611016-3a70d82b5040?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Pulled Tender Chicken",
      "Molasses BBQ Sauce",
      "Apple Cider Slaw",
      "Pickled Jalapeños",
      "Brioche Bun"
    ],
    "allergens": [
      "Gluten",
      "Dairy",
      "Eggs"
    ],
    "nutrition": {
      "calories": 530,
      "protein": 36,
      "carbs": 48,
      "fat": 22
    },
    "rating": {
      "average": 4.8,
      "count": 520
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 11,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_21",
    "id": "burger_21",
    "name": "Chipotle Southwestern Veggie Burger",
    "slug": "chipotle-southwestern-veggie-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Fire-roasted sweet corn, black bean, and bell pepper patty with smoky chipotle crema, melted pepper jack cheese, and crispy tortilla crisps.",
    "price": 289,
    "discountPrice": 239,
    "discountPercentage": 17,
    "isVeg": true,
    "spiceLevel": "medium",
    "thumbnail": "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Roasted Corn & Bean Patty",
      "Pepper Jack Cheese",
      "Chipotle Crema",
      "Tortilla Strips",
      "Brioche Bun"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 470,
      "protein": 15,
      "carbs": 54,
      "fat": 21
    },
    "rating": {
      "average": 4.6,
      "count": 260
    },
    "isFeatured": false,
    "isNewLaunch": false,
    "preparationTime": 12,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_22",
    "id": "burger_22",
    "name": "Caramelized Onion & Brie Brioche Burger",
    "slug": "caramelized-onion-brie-brioche-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Thick grilled patty topped with creamy French brie cheese, slow-caramelized sweet Vidalia onions, and rosemary garlic herb mayonnaise.",
    "price": 389,
    "discountPrice": 319,
    "discountPercentage": 18,
    "isVeg": false,
    "spiceLevel": "none",
    "thumbnail": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Gourmet Patty",
      "French Brie",
      "Caramelized Vidalia Onions",
      "Rosemary Garlic Mayo",
      "Brioche"
    ],
    "allergens": [
      "Gluten",
      "Dairy",
      "Eggs"
    ],
    "nutrition": {
      "calories": 650,
      "protein": 38,
      "carbs": 44,
      "fat": 36
    },
    "rating": {
      "average": 4.9,
      "count": 390
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 15,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_23",
    "id": "burger_23",
    "name": "Crispy Sriracha Tofu Burger",
    "slug": "crispy-sriracha-tofu-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Panko-crusted organic tofu steak brushed with tangy spicy sriracha glaze, sweet pickled cucumber ribbons, fresh cilantro, and vegan mayo.",
    "price": 259,
    "discountPrice": 219,
    "discountPercentage": 15,
    "isVeg": true,
    "spiceLevel": "spicy",
    "thumbnail": "https://images.unsplash.com/photo-1521305916504-4a1121188589?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1521305916504-4a1121188589?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1521305916504-4a1121188589?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Crispy Panko Tofu",
      "Sriracha Honey Glaze",
      "Pickled Cucumber",
      "Cilantro",
      "Toasted Bun"
    ],
    "allergens": [
      "Gluten",
      "Soy"
    ],
    "nutrition": {
      "calories": 410,
      "protein": 18,
      "carbs": 50,
      "fat": 16
    },
    "rating": {
      "average": 4.5,
      "count": 210
    },
    "isFeatured": false,
    "isNewLaunch": true,
    "preparationTime": 11,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "burger_24",
    "id": "burger_24",
    "name": "Supreme Cheese Melt Crunch Burger",
    "slug": "supreme-cheese-melt-crunch-burger",
    "category": {
      "_id": "cat_burgers",
      "id": "cat_burgers",
      "name": "Burgers",
      "slug": "burgers"
    },
    "categoryName": "Burgers",
    "description": "Golden crunchy cornflake-crumbed patty layered with cheddar melt, mozzarella slice, and warm rich nacho cheese sauce drizzle.",
    "price": 339,
    "discountPrice": 279,
    "discountPercentage": 18,
    "isVeg": true,
    "spiceLevel": "mild",
    "thumbnail": "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&h=600&fit=crop",
    "image": "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Cornflake Crunch Patty",
      "Warm Nacho Cheese",
      "Mozzarella Slice",
      "Lettuce",
      "Sesame Bun"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 590,
      "protein": 20,
      "carbs": 52,
      "fat": 32
    },
    "rating": {
      "average": 4.8,
      "count": 640
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 12,
    "serves": 1,
    "categorySlug": "burgers",
    "isAvailable": true
  },
  {
    "_id": "pizza_01",
    "id": "pizza_01",
    "name": "Farmhouse Loaded Supreme Pizza",
    "slug": "farmhouse-loaded-supreme-pizza",
    "category": {
      "_id": "cat_pizza",
      "id": "cat_pizza",
      "name": "Pizza",
      "slug": "pizza"
    },
    "categorySlug": "pizza",
    "categoryName": "Pizza",
    "description": "Hand-tossed artisan crust loaded with sliced button mushrooms, crisp bell peppers, black kalamata olives, sweet golden corn, and melting 100% mozzarella cheese.",
    "price": 399,
    "discountPrice": 329,
    "discountPercentage": 18,
    "isVeg": true,
    "spiceLevel": "mild",
    "thumbnail": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Hand-Tossed Dough",
      "San Marzano Sauce",
      "Mozzarella",
      "Button Mushrooms",
      "Bell Peppers",
      "Olives",
      "Sweet Corn"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 740,
      "protein": 28,
      "carbs": 86,
      "fat": 32
    },
    "rating": {
      "average": 4.8,
      "count": 540
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 18,
    "serves": 2,
    "isAvailable": true
  },
  {
    "_id": "pizza_02",
    "id": "pizza_02",
    "name": "Classic Italian Margherita Basil Pizza",
    "slug": "classic-italian-margherita-basil-pizza",
    "category": {
      "_id": "cat_pizza",
      "id": "cat_pizza",
      "name": "Pizza",
      "slug": "pizza"
    },
    "categorySlug": "pizza",
    "categoryName": "Pizza",
    "description": "Authentic Neapolitan thin-crust pizza topped with crushed San Marzano plum tomatoes, fresh Buffalo mozzarella pearls, fragrant sweet basil leaves, and extra virgin olive oil.",
    "price": 329,
    "discountPrice": 269,
    "discountPercentage": 18,
    "isVeg": true,
    "spiceLevel": "none",
    "thumbnail": "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Neapolitan Crust",
      "San Marzano Tomatoes",
      "Buffalo Mozzarella",
      "Fresh Basil Leaves",
      "Cold-Pressed Olive Oil"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 620,
      "protein": 24,
      "carbs": 74,
      "fat": 26
    },
    "rating": {
      "average": 4.9,
      "count": 680
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 15,
    "serves": 2,
    "isAvailable": true
  },
  {
    "_id": "pizza_03",
    "id": "pizza_03",
    "name": "Fiery Pepperoni Double Mozzarella Pizza",
    "slug": "fiery-pepperoni-double-mozzarella-pizza",
    "category": {
      "_id": "cat_pizza",
      "id": "cat_pizza",
      "name": "Pizza",
      "slug": "pizza"
    },
    "categorySlug": "pizza",
    "categoryName": "Pizza",
    "description": "Generously loaded with spicy cured beef/chicken pepperoni slices with crispy curled edges, double shredded mozzarella, and hot chili honey drizzle.",
    "price": 459,
    "discountPrice": 389,
    "discountPercentage": 15,
    "isVeg": false,
    "spiceLevel": "spicy",
    "thumbnail": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Crispy Crust",
      "Spicy Pepperoni Slices",
      "Double Mozzarella",
      "Chili Flakes",
      "Hot Honey"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 860,
      "protein": 42,
      "carbs": 72,
      "fat": 44
    },
    "rating": {
      "average": 4.9,
      "count": 910
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 18,
    "serves": 2,
    "isAvailable": true
  },
  {
    "_id": "pizza_04",
    "id": "pizza_04",
    "name": "Smoky BBQ Chicken & Jalapeño Pizza",
    "slug": "smoky-bbq-chicken-jalapeno-pizza",
    "category": {
      "_id": "cat_pizza",
      "id": "cat_pizza",
      "name": "Pizza",
      "slug": "pizza"
    },
    "categorySlug": "pizza",
    "categoryName": "Pizza",
    "description": "Tender grilled chicken chunks tossed in hickory smoked BBQ sauce, sliced fiery jalapeños, sweet red onions, and melted smoked gouda and mozzarella cheese blend.",
    "price": 449,
    "discountPrice": 379,
    "discountPercentage": 16,
    "isVeg": false,
    "spiceLevel": "medium",
    "thumbnail": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "BBQ Chicken Chunks",
      "Hickory Sauce",
      "Jalapeños",
      "Red Onions",
      "Smoked Gouda",
      "Mozzarella"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 810,
      "protein": 44,
      "carbs": 76,
      "fat": 36
    },
    "rating": {
      "average": 4.8,
      "count": 490
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 17,
    "serves": 2,
    "isAvailable": true
  },
  {
    "_id": "pizza_05",
    "id": "pizza_05",
    "name": "Quattro Formaggi 4-Cheese Gourmet Pizza",
    "slug": "quattro-formaggi-4-cheese-gourmet-pizza",
    "category": {
      "_id": "cat_pizza",
      "id": "cat_pizza",
      "name": "Pizza",
      "slug": "pizza"
    },
    "categorySlug": "pizza",
    "categoryName": "Pizza",
    "description": "A decadent white-sauce pizza featuring a harmonious four-cheese blend of fresh Mozzarella, aged Gorgonzola, creamy Ricotta, and nutty Parmesan shavings with roasted garlic oil.",
    "price": 469,
    "discountPrice": 399,
    "discountPercentage": 15,
    "isVeg": true,
    "spiceLevel": "none",
    "thumbnail": "https://images.unsplash.com/photo-1573821663912-569905455b1c?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1573821663912-569905455b1c?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1573821663912-569905455b1c?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "White Garlic Sauce",
      "Mozzarella",
      "Gorgonzola",
      "Ricotta",
      "Aged Parmesan",
      "Thyme"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 890,
      "protein": 36,
      "carbs": 68,
      "fat": 52
    },
    "rating": {
      "average": 4.7,
      "count": 320
    },
    "isFeatured": false,
    "isNewLaunch": true,
    "preparationTime": 16,
    "serves": 2,
    "isAvailable": true
  },
  {
    "_id": "pizza_06",
    "id": "pizza_06",
    "name": "Wild Truffle Forest Mushroom Pizza",
    "slug": "wild-truffle-forest-mushroom-pizza",
    "category": {
      "_id": "cat_pizza",
      "id": "cat_pizza",
      "name": "Pizza",
      "slug": "pizza"
    },
    "categorySlug": "pizza",
    "categoryName": "Pizza",
    "description": "Earthy sautéed cremini, shiitake, and oyster mushrooms on a garlic herb cream base, finished with black winter truffle oil and fresh cracked pepper.",
    "price": 459,
    "discountPrice": 389,
    "discountPercentage": 15,
    "isVeg": true,
    "spiceLevel": "none",
    "thumbnail": "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Wild Cremini & Shiitake",
      "Garlic Herb Cream",
      "Mozzarella",
      "Black Truffle Oil",
      "Fresh Thyme"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 710,
      "protein": 26,
      "carbs": 70,
      "fat": 34
    },
    "rating": {
      "average": 4.8,
      "count": 280
    },
    "isFeatured": false,
    "isNewLaunch": true,
    "preparationTime": 16,
    "serves": 2,
    "isAvailable": true
  },
  {
    "_id": "pizza_07",
    "id": "pizza_07",
    "name": "Paneer Tikka Makhani Artisan Pizza",
    "slug": "paneer-tikka-makhani-artisan-pizza",
    "category": {
      "_id": "cat_pizza",
      "id": "cat_pizza",
      "name": "Pizza",
      "slug": "pizza"
    },
    "categorySlug": "pizza",
    "categoryName": "Pizza",
    "description": "Clay-oven charred spiced paneer cubes, vibrant capsicum, caramelized red onions on a rich velvety makhani sauce base with melted cheese and fresh coriander.",
    "price": 389,
    "discountPrice": 329,
    "discountPercentage": 15,
    "isVeg": true,
    "spiceLevel": "medium",
    "thumbnail": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Tandoori Spiced Paneer",
      "Makhani Sauce",
      "Capsicum",
      "Onions",
      "Mozzarella",
      "Kasuri Methi"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 780,
      "protein": 32,
      "carbs": 80,
      "fat": 36
    },
    "rating": {
      "average": 4.9,
      "count": 720
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 17,
    "serves": 2,
    "isAvailable": true
  },
  {
    "_id": "pizza_08",
    "id": "pizza_08",
    "name": "Rustic Pesto & Sun-Dried Tomato Pizza",
    "slug": "rustic-pesto-sundried-tomato-pizza",
    "category": {
      "_id": "cat_pizza",
      "id": "cat_pizza",
      "name": "Pizza",
      "slug": "pizza"
    },
    "categorySlug": "pizza",
    "categoryName": "Pizza",
    "description": "Bright Genovese basil pine-nut pesto base, sweet Italian sun-dried tomatoes, roasted baby artichoke hearts, melted fior di latte mozzarella, and balsamic reduction glaze.",
    "price": 399,
    "discountPrice": 339,
    "discountPercentage": 15,
    "isVeg": true,
    "spiceLevel": "none",
    "thumbnail": "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Genovese Basil Pesto",
      "Sun-Dried Tomatoes",
      "Artichoke Hearts",
      "Fior di Latte",
      "Balsamic Glaze"
    ],
    "allergens": [
      "Gluten",
      "Dairy",
      "Tree Nuts"
    ],
    "nutrition": {
      "calories": 690,
      "protein": 22,
      "carbs": 72,
      "fat": 34
    },
    "rating": {
      "average": 4.7,
      "count": 210
    },
    "isFeatured": false,
    "isNewLaunch": false,
    "preparationTime": 15,
    "serves": 2,
    "isAvailable": true
  },
  {
    "_id": "drink_01",
    "id": "drink_01",
    "name": "Sparkling Mint Lime Mojito Cooler",
    "slug": "sparkling-mint-lime-mojito-cooler",
    "category": {
      "_id": "cat_beverages",
      "id": "cat_beverages",
      "name": "Beverages",
      "slug": "beverages"
    },
    "categorySlug": "beverages",
    "categoryName": "Beverages",
    "description": "Ultra-crisp muddled organic spearmint, freshly squeezed Tahitian lime juice, cane sugar syrup, and fizzy club soda served over crystal crushed ice with a lime wheel garnish.",
    "price": 189,
    "discountPrice": 149,
    "discountPercentage": 21,
    "isVeg": true,
    "spiceLevel": "none",
    "thumbnail": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Fresh Spearmint",
      "Tahitian Lime",
      "Cane Sugar",
      "Fizzy Soda",
      "Crushed Ice"
    ],
    "allergens": [],
    "nutrition": {
      "calories": 110,
      "protein": 0,
      "carbs": 28,
      "fat": 0
    },
    "rating": {
      "average": 4.9,
      "count": 1120
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 5,
    "serves": 1,
    "isAvailable": true
  },
  {
    "_id": "drink_02",
    "id": "drink_02",
    "name": "Alphonso Mango & Passionfruit Slush",
    "slug": "alphonso-mango-passionfruit-slush",
    "category": {
      "_id": "cat_beverages",
      "id": "cat_beverages",
      "name": "Beverages",
      "slug": "beverages"
    },
    "categorySlug": "beverages",
    "categoryName": "Beverages",
    "description": "Chilled Ratnagiri Alphonso mango pulp blended with tangy tropical passionfruit seeds, crushed ice, and a dash of sweet citrus syrup for the ultimate summer refreshment.",
    "price": 219,
    "discountPrice": 169,
    "discountPercentage": 23,
    "isVeg": true,
    "spiceLevel": "none",
    "thumbnail": "https://images.unsplash.com/photo-1546173159-315724a31696?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1546173159-315724a31696?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1546173159-315724a31696?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Alphonso Mango Pulp",
      "Passionfruit Puree",
      "Tropical Citrus",
      "Ice Frost"
    ],
    "allergens": [],
    "nutrition": {
      "calories": 160,
      "protein": 1,
      "carbs": 39,
      "fat": 0
    },
    "rating": {
      "average": 4.8,
      "count": 870
    },
    "isFeatured": true,
    "isNewLaunch": true,
    "preparationTime": 6,
    "serves": 1,
    "isAvailable": true
  },
  {
    "_id": "drink_03",
    "id": "drink_03",
    "name": "Colombian Cold Brew Caramel Frappé",
    "slug": "colombian-cold-brew-caramel-frappe",
    "category": {
      "_id": "cat_beverages",
      "id": "cat_beverages",
      "name": "Beverages",
      "slug": "beverages"
    },
    "categorySlug": "beverages",
    "categoryName": "Beverages",
    "description": "18-hour slow steeped Colombian Arabica cold brew coffee blended with creamy milk, buttery salted caramel drizzle, and crowned with whipped vanilla cream.",
    "price": 239,
    "discountPrice": 189,
    "discountPercentage": 21,
    "isVeg": true,
    "spiceLevel": "none",
    "thumbnail": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Colombian Cold Brew",
      "Whole Milk",
      "Salted Caramel",
      "Whipped Cream"
    ],
    "allergens": [
      "Dairy"
    ],
    "nutrition": {
      "calories": 240,
      "protein": 6,
      "carbs": 38,
      "fat": 8
    },
    "rating": {
      "average": 4.9,
      "count": 650
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 7,
    "serves": 1,
    "isAvailable": true
  },
  {
    "_id": "drink_04",
    "id": "drink_04",
    "name": "Fresh Wild Berry & Mint Pink Lemonade",
    "slug": "fresh-wild-berry-mint-pink-lemonade",
    "category": {
      "_id": "cat_beverages",
      "id": "cat_beverages",
      "name": "Beverages",
      "slug": "beverages"
    },
    "categorySlug": "beverages",
    "categoryName": "Beverages",
    "description": "A vibrant blend of crushed raspberries, blackberries, and strawberries steeped with freshly squeezed Meyer lemon juice and crisp ice cubes.",
    "price": 179,
    "discountPrice": 139,
    "discountPercentage": 22,
    "isVeg": true,
    "spiceLevel": "none",
    "thumbnail": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Wild Raspberry Puree",
      "Blackberries",
      "Fresh Lemon Juice",
      "Mint Leaves"
    ],
    "allergens": [],
    "nutrition": {
      "calories": 125,
      "protein": 0,
      "carbs": 31,
      "fat": 0
    },
    "rating": {
      "average": 4.8,
      "count": 480
    },
    "isFeatured": false,
    "isNewLaunch": true,
    "preparationTime": 5,
    "serves": 1,
    "isAvailable": true
  },
  {
    "_id": "drink_05",
    "id": "drink_05",
    "name": "Iced Georgia Peach Infused Tea Cooler",
    "slug": "iced-georgia-peach-infused-tea-cooler",
    "category": {
      "_id": "cat_beverages",
      "id": "cat_beverages",
      "name": "Beverages",
      "slug": "beverages"
    },
    "categorySlug": "beverages",
    "categoryName": "Beverages",
    "description": "Fragrant Darjeeling black tea cold-infused with ripe sweet Georgia peach nectar, aromatic lemongrass, and sliced peach fruit slices over ice.",
    "price": 169,
    "discountPrice": 129,
    "discountPercentage": 24,
    "isVeg": true,
    "spiceLevel": "none",
    "thumbnail": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Darjeeling Black Tea",
      "Ripe Peach Nectar",
      "Lemongrass",
      "Peach Slices"
    ],
    "allergens": [],
    "nutrition": {
      "calories": 95,
      "protein": 0,
      "carbs": 24,
      "fat": 0
    },
    "rating": {
      "average": 4.7,
      "count": 390
    },
    "isFeatured": false,
    "isNewLaunch": false,
    "preparationTime": 5,
    "serves": 1,
    "isAvailable": true
  },
  {
    "_id": "drink_06",
    "id": "drink_06",
    "name": "Thick Belgian Dark Chocolate Milkshake",
    "slug": "thick-belgian-dark-chocolate-milkshake",
    "category": {
      "_id": "cat_beverages",
      "id": "cat_beverages",
      "name": "Beverages",
      "slug": "beverages"
    },
    "categorySlug": "beverages",
    "categoryName": "Beverages",
    "description": "Thick and luscious shake spun with 70% dark Belgian cocoa ganache, artisanal chocolate gelato, whole cream, and chocolate fudge curls.",
    "price": 249,
    "discountPrice": 199,
    "discountPercentage": 20,
    "isVeg": true,
    "spiceLevel": "none",
    "thumbnail": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "70% Belgian Chocolate",
      "Chocolate Gelato",
      "Fresh Milk",
      "Dark Fudge Curls"
    ],
    "allergens": [
      "Dairy"
    ],
    "nutrition": {
      "calories": 380,
      "protein": 8,
      "carbs": 52,
      "fat": 16
    },
    "rating": {
      "average": 4.9,
      "count": 1240
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 8,
    "serves": 1,
    "isAvailable": true
  },
  {
    "_id": "drink_07",
    "id": "drink_07",
    "name": "Blue Lagoon Sparkling Citrus Mocktail",
    "slug": "blue-lagoon-sparkling-citrus-mocktail",
    "category": {
      "_id": "cat_beverages",
      "id": "cat_beverages",
      "name": "Beverages",
      "slug": "beverages"
    },
    "categorySlug": "beverages",
    "categoryName": "Beverages",
    "description": "Electric blue non-alcoholic curacao essence, tart Meyer lemon juice, sparkling tonic water, and a maraschino cherry over luminous backlit ice.",
    "price": 199,
    "discountPrice": 159,
    "discountPercentage": 20,
    "isVeg": true,
    "spiceLevel": "none",
    "thumbnail": "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Blue Curacao Syrup",
      "Meyer Lemon",
      "Sparkling Tonic",
      "Maraschino Cherry"
    ],
    "allergens": [],
    "nutrition": {
      "calories": 130,
      "protein": 0,
      "carbs": 32,
      "fat": 0
    },
    "rating": {
      "average": 4.8,
      "count": 580
    },
    "isFeatured": false,
    "isNewLaunch": true,
    "preparationTime": 5,
    "serves": 1,
    "isAvailable": true
  },
  {
    "_id": "drink_08",
    "id": "drink_08",
    "name": "Crisp Sparkling Citrus Ice Soda",
    "slug": "crisp-sparkling-citrus-ice-soda",
    "category": {
      "_id": "cat_beverages",
      "id": "cat_beverages",
      "name": "Beverages",
      "slug": "beverages"
    },
    "categorySlug": "beverages",
    "categoryName": "Beverages",
    "description": "Thirst-quenching blend of sparkling carbonated mountain spring water infused with sun-ripened Florida oranges, limes, and botanical extracts.",
    "price": 149,
    "discountPrice": 119,
    "discountPercentage": 20,
    "isVeg": true,
    "spiceLevel": "none",
    "thumbnail": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Carbonated Spring Water",
      "Florida Orange Essence",
      "Lime Zest",
      "Natural Cane Sugar"
    ],
    "allergens": [],
    "nutrition": {
      "calories": 90,
      "protein": 0,
      "carbs": 22,
      "fat": 0
    },
    "rating": {
      "average": 4.6,
      "count": 310
    },
    "isFeatured": false,
    "isNewLaunch": false,
    "preparationTime": 4,
    "serves": 1,
    "isAvailable": true
  },
  {
    "_id": "fries_01",
    "id": "fries_01",
    "name": "Peri-Peri Golden Crinkle Cut Fries",
    "slug": "peri-peri-golden-crinkle-cut-fries",
    "category": {
      "_id": "cat_fries",
      "id": "cat_fries",
      "name": "Fries & Sides",
      "slug": "fries-sides"
    },
    "categorySlug": "fries-sides",
    "categoryName": "Fries & Sides",
    "description": "Crispy deep-ridged golden potato crinkles tossed in zesty fiery African bird’s eye peri-peri seasoning with creamy garlic dip.",
    "price": 169,
    "discountPrice": 129,
    "discountPercentage": 24,
    "isVeg": true,
    "spiceLevel": "spicy",
    "thumbnail": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Crinkle Cut Potatoes",
      "African Peri-Peri Spices",
      "Garlic Aioli"
    ],
    "allergens": [],
    "nutrition": {
      "calories": 340,
      "protein": 4,
      "carbs": 46,
      "fat": 16
    },
    "rating": {
      "average": 4.8,
      "count": 1420
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 10,
    "serves": 1,
    "isAvailable": true
  },
  {
    "_id": "snack_01",
    "id": "snack_01",
    "name": "Loaded Cheesy Queso Tortilla Nachos",
    "slug": "loaded-cheesy-queso-tortilla-nachos",
    "category": {
      "_id": "cat_snacks",
      "id": "cat_snacks",
      "name": "Chips & Snacks",
      "slug": "snacks"
    },
    "categorySlug": "snacks",
    "categoryName": "Chips & Snacks",
    "description": "Crunchy golden stone-ground corn tortilla chips piled high with warm melted cheddar queso, black beans, pico de gallo, pickled jalapeños, and guacamole.",
    "price": 279,
    "discountPrice": 219,
    "discountPercentage": 22,
    "isVeg": true,
    "spiceLevel": "medium",
    "thumbnail": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Corn Tortilla Chips",
      "Warm Cheddar Queso",
      "Black Beans",
      "Pico de Gallo",
      "Guacamole",
      "Sour Cream"
    ],
    "allergens": [
      "Dairy"
    ],
    "nutrition": {
      "calories": 580,
      "protein": 14,
      "carbs": 64,
      "fat": 32
    },
    "rating": {
      "average": 4.9,
      "count": 980
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 12,
    "serves": 2,
    "isAvailable": true
  },
  {
    "_id": "snack_02",
    "id": "snack_02",
    "name": "Gourmet Kettle Cooked Sea Salt Chips",
    "slug": "gourmet-kettle-cooked-sea-salt-chips",
    "category": {
      "_id": "cat_snacks",
      "id": "cat_snacks",
      "name": "Chips & Snacks",
      "slug": "snacks"
    },
    "categorySlug": "snacks",
    "categoryName": "Chips & Snacks",
    "description": "Thick-cut batch-fried potato crisps with maximum crunch, dusted with Pacific sea salt and freshly cracked black peppercorns in a basket.",
    "price": 149,
    "discountPrice": 119,
    "discountPercentage": 20,
    "isVeg": true,
    "spiceLevel": "none",
    "thumbnail": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Russet Potatoes",
      "Sunflower Oil",
      "Pacific Sea Salt",
      "Black Pepper"
    ],
    "allergens": [],
    "nutrition": {
      "calories": 290,
      "protein": 3,
      "carbs": 36,
      "fat": 15
    },
    "rating": {
      "average": 4.7,
      "count": 620
    },
    "isFeatured": false,
    "isNewLaunch": false,
    "preparationTime": 6,
    "serves": 1,
    "isAvailable": true
  },
  {
    "_id": "fries_02",
    "id": "fries_02",
    "name": "Truffle Oil & Aged Parmesan Steak Wedges",
    "slug": "truffle-oil-aged-parmesan-steak-wedges",
    "category": {
      "_id": "cat_fries",
      "id": "cat_fries",
      "name": "Fries & Sides",
      "slug": "fries-sides"
    },
    "categorySlug": "fries-sides",
    "categoryName": "Fries & Sides",
    "description": "Hand-cut thick skin-on potato steak wedges tossed in Italian white truffle oil, finely grated 24-month aged Parmigiano Reggiano, and chopped rosemary.",
    "price": 239,
    "discountPrice": 189,
    "discountPercentage": 21,
    "isVeg": true,
    "spiceLevel": "none",
    "thumbnail": "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Skin-On Potato Wedges",
      "White Truffle Oil",
      "Aged Parmigiano Reggiano",
      "Rosemary"
    ],
    "allergens": [
      "Dairy"
    ],
    "nutrition": {
      "calories": 390,
      "protein": 8,
      "carbs": 48,
      "fat": 19
    },
    "rating": {
      "average": 4.9,
      "count": 770
    },
    "isFeatured": true,
    "isNewLaunch": true,
    "preparationTime": 12,
    "serves": 1,
    "isAvailable": true
  },
  {
    "_id": "snack_03",
    "id": "snack_03",
    "name": "Golden Beer-Battered Crunchy Onion Rings",
    "slug": "golden-beer-battered-crunchy-onion-rings",
    "category": {
      "_id": "cat_snacks",
      "id": "cat_snacks",
      "name": "Chips & Snacks",
      "slug": "snacks"
    },
    "categorySlug": "snacks",
    "categoryName": "Chips & Snacks",
    "description": "Thick sweet yellow onion rings dipped in crisp craft beer batter and panko breadcrumbs, fried golden brown and served with smoked paprika dip.",
    "price": 189,
    "discountPrice": 149,
    "discountPercentage": 21,
    "isVeg": true,
    "spiceLevel": "mild",
    "thumbnail": "https://images.unsplash.com/photo-1639024471285-0af5075b6dbd?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1639024471285-0af5075b6dbd?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1639024471285-0af5075b6dbd?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Sweet Yellow Onions",
      "Beer Batter",
      "Panko Crumbs",
      "Smoked Paprika Mayo"
    ],
    "allergens": [
      "Gluten"
    ],
    "nutrition": {
      "calories": 360,
      "protein": 4,
      "carbs": 42,
      "fat": 20
    },
    "rating": {
      "average": 4.7,
      "count": 510
    },
    "isFeatured": false,
    "isNewLaunch": false,
    "preparationTime": 10,
    "serves": 1,
    "isAvailable": true
  },
  {
    "_id": "snack_04",
    "id": "snack_04",
    "name": "Fiery Cheddar Jalapeño Poppers (6 Pcs)",
    "slug": "fiery-cheddar-jalapeno-poppers",
    "category": {
      "_id": "cat_snacks",
      "id": "cat_snacks",
      "name": "Chips & Snacks",
      "slug": "snacks"
    },
    "categorySlug": "snacks",
    "categoryName": "Chips & Snacks",
    "description": "Halved green jalapeño peppers stuffed with rich molten sharp cheddar and cream cheese, breaded and fried to crispy golden perfection.",
    "price": 219,
    "discountPrice": 169,
    "discountPercentage": 23,
    "isVeg": true,
    "spiceLevel": "spicy",
    "thumbnail": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Fresh Jalapeños",
      "Sharp Cheddar",
      "Cream Cheese",
      "Herb Crumb Coating"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 420,
      "protein": 12,
      "carbs": 32,
      "fat": 28
    },
    "rating": {
      "average": 4.8,
      "count": 680
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 11,
    "serves": 1,
    "isAvailable": true
  },
  {
    "_id": "fries_03",
    "id": "fries_03",
    "name": "Masala Spiced Hand-Cut Potato Wedges",
    "slug": "masala-spiced-hand-cut-potato-wedges",
    "category": {
      "_id": "cat_fries",
      "id": "cat_fries",
      "name": "Fries & Sides",
      "slug": "fries-sides"
    },
    "categorySlug": "fries-sides",
    "categoryName": "Fries & Sides",
    "description": "Chunky roasted potato wedges tossed in aromatic Indian chaat masala, toasted cumin, fresh chopped coriander, and spicy mint chutney.",
    "price": 179,
    "discountPrice": 139,
    "discountPercentage": 22,
    "isVeg": true,
    "spiceLevel": "medium",
    "thumbnail": "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "Hand-Cut Wedges",
      "Roasted Cumin",
      "Chaat Masala",
      "Mint Chutney"
    ],
    "allergens": [],
    "nutrition": {
      "calories": 310,
      "protein": 5,
      "carbs": 48,
      "fat": 12
    },
    "rating": {
      "average": 4.7,
      "count": 430
    },
    "isFeatured": false,
    "isNewLaunch": false,
    "preparationTime": 10,
    "serves": 1,
    "isAvailable": true
  },
  {
    "_id": "snack_05",
    "id": "snack_05",
    "name": "Stuffed Mozzarella Cheese Sticks with Marinara",
    "slug": "stuffed-mozzarella-cheese-sticks-marinara",
    "category": {
      "_id": "cat_snacks",
      "id": "cat_snacks",
      "name": "Chips & Snacks",
      "slug": "snacks"
    },
    "categorySlug": "snacks",
    "categoryName": "Chips & Snacks",
    "description": "Golden Italian herb crusted mozzarella sticks with glorious cheese pull on every bite, served with warm slow-simmered basil marinara sauce.",
    "price": 229,
    "discountPrice": 179,
    "discountPercentage": 22,
    "isVeg": true,
    "spiceLevel": "none",
    "thumbnail": "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "ingredients": [
      "100% Mozzarella Sticks",
      "Italian Herb Panko",
      "Basil Marinara Dip"
    ],
    "allergens": [
      "Gluten",
      "Dairy"
    ],
    "nutrition": {
      "calories": 450,
      "protein": 18,
      "carbs": 36,
      "fat": 27
    },
    "rating": {
      "average": 4.9,
      "count": 860
    },
    "isFeatured": true,
    "isNewLaunch": false,
    "preparationTime": 11,
    "serves": 1,
    "isAvailable": true
  },
  {
    "_id": "combo_01",
    "id": "combo_01",
    "name": "Grand Family Burger Feast (4 Burgers + 2 Fries + 4 Drinks)",
    "slug": "grand-family-burger-feast",
    "category": {
      "_id": "cat_combos",
      "id": "cat_combos",
      "name": "Combos & Meals",
      "slug": "combos"
    },
    "categorySlug": "combos",
    "categoryName": "Combos & Meals",
    "description": "4 Gourmet Burgers of your choice (2 Veg + 2 Non-Veg), 2 Large Peri-Peri Fries, 4 Cool Drinks, and 4 Choco Lava Cakes.",
    "price": 1299,
    "discountPrice": 949,
    "discountPercentage": 27,
    "isVeg": false,
    "thumbnail": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "rating": {
      "average": 4.9,
      "count": 890
    },
    "isFeatured": true,
    "nutrition": {
      "calories": 2400
    },
    "preparationTime": 22,
    "serves": 4,
    "isAvailable": true
  },
  {
    "_id": "combo_02",
    "id": "combo_02",
    "name": "Pizza & Wings Mega Party Box",
    "slug": "pizza-wings-mega-party-box",
    "category": {
      "_id": "cat_combos",
      "id": "cat_combos",
      "name": "Combos & Meals",
      "slug": "combos"
    },
    "categorySlug": "combos",
    "categoryName": "Combos & Meals",
    "description": "1 Large Farmhouse or Pepperoni Pizza + 8 Pc Crispy Wings + 1 Loaded Nachos Platter + 2 Iced Mojitos.",
    "price": 1199,
    "discountPrice": 899,
    "discountPercentage": 25,
    "isVeg": false,
    "thumbnail": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "rating": {
      "average": 4.8,
      "count": 640
    },
    "isFeatured": true,
    "nutrition": {
      "calories": 2100
    },
    "preparationTime": 20,
    "serves": 3,
    "isAvailable": true
  },
  {
    "_id": "chicken_01",
    "id": "chicken_01",
    "name": "Crunchy Golden Fried Chicken (6 Pc Bucket)",
    "slug": "crunchy-golden-fried-chicken-6pc",
    "category": {
      "_id": "cat_chicken",
      "id": "cat_chicken",
      "name": "Fried Chicken",
      "slug": "fried-chicken"
    },
    "categorySlug": "fried-chicken",
    "categoryName": "Fried Chicken",
    "description": "Crispy bone-in chicken marinated in secret 11 herbs & spices, fried to golden perfection with garlic dip.",
    "price": 499,
    "discountPrice": 399,
    "discountPercentage": 20,
    "isVeg": false,
    "thumbnail": "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "rating": {
      "average": 4.8,
      "count": 760
    },
    "isFeatured": true,
    "nutrition": {
      "calories": 890
    },
    "preparationTime": 16,
    "serves": 2,
    "isAvailable": true
  },
  {
    "_id": "wrap_01",
    "id": "wrap_01",
    "name": "Smoky Tandoori Paneer Tikka Kathi Roll",
    "slug": "smoky-tandoori-paneer-tikka-kathi-roll",
    "category": {
      "_id": "cat_wraps",
      "id": "cat_wraps",
      "name": "Wraps & Rolls",
      "slug": "wraps"
    },
    "categorySlug": "wraps",
    "categoryName": "Wraps & Rolls",
    "description": "Char-grilled cottage cheese cubes tossed in spicy tandoori marinade with mint chutney, pickled onions rolled in flakey paratha.",
    "price": 269,
    "discountPrice": 219,
    "discountPercentage": 19,
    "isVeg": true,
    "thumbnail": "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "rating": {
      "average": 4.8,
      "count": 590
    },
    "isFeatured": true,
    "nutrition": {
      "calories": 480
    },
    "preparationTime": 12,
    "serves": 1,
    "isAvailable": true
  },
  {
    "_id": "dessert_01",
    "id": "dessert_01",
    "name": "Warm Molten Belgian Choco Lava Cake",
    "slug": "warm-molten-belgian-choco-lava-cake",
    "category": {
      "_id": "cat_desserts",
      "id": "cat_desserts",
      "name": "Desserts & Shakes",
      "slug": "desserts"
    },
    "categorySlug": "desserts",
    "categoryName": "Desserts & Shakes",
    "description": "Rich dark chocolate cake filled with warm liquid Belgian chocolate center that flows upon cutting.",
    "price": 149,
    "discountPrice": 119,
    "discountPercentage": 20,
    "isVeg": true,
    "thumbnail": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=800&fit=crop",
    "image": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=800&fit=crop",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=800&fit=crop",
        "isPrimary": true
      }
    ],
    "rating": {
      "average": 4.9,
      "count": 1420
    },
    "isFeatured": true,
    "nutrition": {
      "calories": 380
    },
    "preparationTime": 8,
    "serves": 1,
    "isAvailable": true
  }
];

module.exports = { categories, products };
