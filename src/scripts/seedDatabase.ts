import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ffsnagxvkwhcjxscrrlc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmc25hZ3h2a3doY2p4c2NycmxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQwOTY0NiwiZXhwIjoyMDk1OTg1NjQ2fQ.XwaeN9-9Y24p9T03hvwkHJyisHMq651yGcplmL6vrYs", // use service role here, not anon key
);

async function seed() {
  console.log("Seeding categories...");

  // Step 1: insert categories
  const { data: categories } = await supabase
    .from("categories")
    .insert([
      {
        name: "Electronics",
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80", // Modern headphones
        slug: "electronics",
      },
      {
        name: "Clothing",
        image:
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80", // Clean folded clothes
        slug: "clothing",
      },
      {
        name: "Furniture",
        image:
          "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80", // Aesthetic modern chair/desk
        slug: "furniture",
      },
      {
        name: "Beauty",
        image:
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80", // Skincare / Cosmetics
        slug: "beauty",
      },
      {
        name: "Sports",
        image:
          "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80", // Running shoes / fitness setup
        slug: "sports",
      },
      {
        name: "Groceries",
        image:
          "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80", // Fresh vegetables and market items
        slug: "groceries",
      },
      {
        name: "Shoes",
        image:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80", // Premium sneaker
        slug: "shoes",
      },
      {
        name: "Accessories",
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80", // Watch / Minimalist gear
        slug: "accessories",
      },
    ])
    .select();

  console.log("Fetching products from DummyJSON...");

  // Step 2: fetch 200 real products
  const response = await fetch(
    "https://dummyjson.com/products?limit=200&skip=0",
  );
  const { products } = await response.json();

  // Step 3: map DummyJSON categories to your category IDs
  const categoryMap: Record<string, number> = {
    smartphones: categories![0].id,
    laptops: categories![0].id,
    tablets: categories![0].id,
    "mens-shirts": categories![1].id,
    "womens-dresses": categories![1].id,
    "mens-shoes": categories![6].id,
    "womens-shoes": categories![6].id,
    furniture: categories![2].id,
    beauty: categories![3].id,
    fragrances: categories![3].id,
    sports: categories![4].id,
    groceries: categories![5].id,
    sunglasses: categories![7].id,
    "mens-watches": categories![7].id,
    "womens-watches": categories![7].id,
    "womens-bags": categories![7].id,
  };

  type Product = {
    title: string;
    description: string;
    price: number;
    stock: number;
    thumbnail: string;
    category: string;
  };

  // Step 4: insert all products into Supabase
  const formattedProducts = products.map((p: Product) => ({
    name: p.title,
    description: p.description,
    price: p.price,
    stock: p.stock,
    image: p.thumbnail,
    // rating: p.rating,
    category_id: categoryMap[p.category] ?? categories![0].id,
  }));

  const { error } = await supabase.from("products").insert(formattedProducts);

  if (error) {
    console.error("Error seeding products:", error);
  } else {
    console.log(`✅ Seeded ${formattedProducts.length} products successfully!`);
  }
}

seed();
