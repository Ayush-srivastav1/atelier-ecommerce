import { Link } from "react-router-dom";
import useProducts from "../hooks/useProducts.js";
import ProductGrid from "../components/ProductGrid.jsx";
import Newsletter from "../components/Newsletter.jsx";
const reviews = [
  ["Aarav", "The oversized tee fits exactly like the photos. Great fabric."],
  ["Meera", "Face wash is gentle and my skin feels balanced."],
  ["Rohan", "Fast delivery and the grooming kit made a perfect gift."],
];
function Section({ title, link, products, loading }) {
  return (
    <section className="mt-16 container-x">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl h-display sm:text-3xl">{title}</h2>
        {link && (
          <Link to={link} className="text-sm font-medium underline text-brand">
            View all
          </Link>
        )}
      </div>
      <ProductGrid products={products.slice(0, 4)} loading={loading} />
    </section>
  );
}
export default function Home() {
  const { products: all, loading } = useProducts();
  const pick = (f) => all.filter(f);
  return (
    <>
      <section className="grid items-center gap-8 py-12 container-x md:grid-cols-2">
        <div>
          <h1 className="text-4xl leading-tight h-display sm:text-6xl">
            Dress well. Look after yourself.
          </h1>
          <p className="max-w-md mt-4 text-ink/70">
            Everyday clothing and grooming essentials, chosen for quality you
            can feel.
          </p>
          <div className="flex gap-3 mt-6">
            <Link to="/clothing" className="btn-primary">
              Shop clothing
            </Link>
            <Link to="/self-grooming" className="btn-outline">
              Shop grooming
            </Link>
          </div>
        </div>
<div className="grid grid-cols-2 gap-4">
  <Link
    to="/clothing"
    className="group relative flex aspect-[3/4] items-end overflow-hidden rounded-3xl p-5 text-xl text-white h-display"
  >
    <img
      src="/images/categories/clothing.avif"
      alt="Clothing"
      className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
    />

    <div className="absolute inset-0 bg-black/25" />

    <span className="relative z-10">
      Clothing
    </span>
  </Link>

  <Link
    to="/self-grooming"
    className="group relative mt-8 flex aspect-[3/4] items-end overflow-hidden rounded-3xl p-5 text-xl text-white h-display"
  >
    <img
      src="/images/categories/grooming.webp"
      alt="Self Grooming"
      className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
    />

    <div className="absolute inset-0 bg-black/25" />

    <span className="relative z-10">
      Self Grooming
    </span>
  </Link>
</div>
      </section>
      <Section
        title="Featured clothing"
        link="/clothing"
        loading={loading}
        products={pick((p) => p.featured && p.category === "Clothing")}
      />
      <Section
        title="Featured self grooming"
        link="/self-grooming"
        loading={loading}
        products={pick((p) => p.featured && p.category === "Self Grooming")}
      />
      <Section
        title="Best sellers"
        link="/shop"
        loading={loading}
        products={pick((p) => p.bestseller)}
      />
      <Section
        title="New arrivals"
        link="/shop"
        loading={loading}
        products={pick((p) => p.newArrival)}
      />
      <section className="mt-16 container-x">
        <div className="p-10 text-center rounded-3xl bg-sand">
          <h2 className="text-3xl h-display">Free delivery over ₹999</h2>
          <p className="mt-1">Easy 7-day returns on every order.</p>
        </div>
      </section>
      <section className="mt-16 container-x">
        <h2 className="mb-6 text-2xl h-display sm:text-3xl">
          What customers say
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {reviews.map(([n, t]) => (
            <blockquote key={n} className="p-6 bg-white rounded-2xl">
              <p>{t}</p>
              <footer className="mt-3 text-sm font-medium">{n}</footer>
            </blockquote>
          ))}
        </div>
      </section>
      <Newsletter />
    </>
  );
}
