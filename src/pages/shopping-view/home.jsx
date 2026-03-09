import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import {
  Airplay,
  ArrowRight,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

const fallbackSlides = [
  {
    image: bannerThree,
    eyebrow: "New season drop",
    title: "MOVE FAST. LOOK SHARP.",
    description:
      "Performance layers, street-ready sneakers, and everyday essentials built for momentum.",
    ctaLabel: "Shop Footwear",
    ctaTarget: { id: "footwear", section: "category" },
  },
  {
    image: bannerOne,
    eyebrow: "Weekend offer",
    title: "UP TO 40% OFF SELECT STYLES",
    description:
      "Refresh your cart with bestselling sportswear, accessories, and training staples.",
    ctaLabel: "Shop Men",
    ctaTarget: { id: "men", section: "category" },
  },
  {
    image: bannerTwo,
    eyebrow: "Fresh arrival",
    title: "CITY SPORT EDIT",
    description:
      "Minimal silhouettes, premium textures, and fast-moving fits for every day of the week.",
    ctaLabel: "Shop Women",
    ctaTarget: { id: "women", section: "category" },
  },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const heroSlides = useMemo(() => {
    if (featureImageList && featureImageList.length > 0) {
      return featureImageList.map((slide, index) => ({
        image: slide.image,
        eyebrow: fallbackSlides[index % fallbackSlides.length].eyebrow,
        title: fallbackSlides[index % fallbackSlides.length].title,
        description: fallbackSlides[index % fallbackSlides.length].description,
        ctaLabel: fallbackSlides[index % fallbackSlides.length].ctaLabel,
        ctaTarget: fallbackSlides[index % fallbackSlides.length].ctaTarget,
      }));
    }

    return fallbackSlides;
  }, [featureImageList]);

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    if (!heroSlides.length) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [heroSlides]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  const activeSlide = heroSlides[currentSlide] || fallbackSlides[0];

  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(180deg,#ece8df_0%,#f7f3eb_24%,#ffffff_55%,#efede7_100%)] text-slate-950">
      <section className="border-b border-black/10 bg-[#ede8df] px-4 pb-10 pt-4 md:px-6 md:pb-14">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.45fr_0.75fr]">
          <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-black text-white shadow-[0_30px_80px_rgba(0,0,0,0.24)]">
            {heroSlides.map((slide, index) => (
              <img
                src={slide.image}
                key={slide.image + index}
                className={`${
                  index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
                } absolute inset-0 h-full w-full object-cover transition-all duration-1000`}
                alt={slide.title}
              />
            ))}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.46)_48%,rgba(0,0,0,0.08)_100%)]" />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(120deg,transparent_0,transparent_42px,rgba(255,255,255,0.08)_42px,rgba(255,255,255,0.08)_54px)] opacity-30" />
            <div className="relative z-10 flex h-full max-w-2xl flex-col justify-between p-8 md:p-12">
              <div className="space-y-5">
                <span className="inline-flex w-fit rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/85 backdrop-blur-sm">
                  {activeSlide.eyebrow}
                </span>
                <div className="space-y-4">
                  <h1 className="max-w-xl text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-7xl">
                    {activeSlide.title}
                  </h1>
                  <p className="max-w-lg text-sm leading-6 text-white/78 md:text-base">
                    {activeSlide.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() =>
                      handleNavigateToListingPage(
                        { id: activeSlide.ctaTarget.id },
                        activeSlide.ctaTarget.section
                      )
                    }
                    className="h-12 rounded-full bg-white px-6 text-sm font-bold uppercase tracking-[0.2em] text-black hover:bg-white/90"
                  >
                    {activeSlide.ctaLabel}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/shop/listing")}
                    className="h-12 rounded-full border-white/40 bg-transparent px-6 text-sm font-bold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black"
                  >
                    View Collection
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentSlide(
                        (prevSlide) =>
                          (prevSlide - 1 + heroSlides.length) % heroSlides.length
                      )
                    }
                    className="h-11 w-11 rounded-full border-white/30 bg-white/10 text-white hover:bg-white hover:text-black"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentSlide(
                        (prevSlide) => (prevSlide + 1) % heroSlides.length
                      )
                    }
                    className="h-11 w-11 rounded-full border-white/30 bg-white/10 text-white hover:bg-white hover:text-black"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[2rem] bg-[#111111] p-8 text-white shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/55">
                Member deal
              </p>
              <h2 className="mt-4 text-3xl font-black uppercase leading-tight">
                Buy 2 essentials. Get the 3rd at 30% off.
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/70">
                Stack tees, shorts, socks, and training accessories for a full cart test with realistic discount pricing.
              </p>
              <Button
                onClick={() => handleNavigateToListingPage({ id: "accessories" }, "category")}
                className="mt-8 rounded-full bg-white px-5 text-sm font-bold uppercase tracking-[0.18em] text-black hover:bg-[#e8e2d7]"
              >
                Grab Offers
              </Button>
            </div>

            <div className="rounded-[2rem] border border-black/10 bg-[#f8f5ee] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.08)]">
              <div className="mb-6 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-black" />
                <span className="h-2.5 w-2.5 rounded-full bg-black/45" />
                <span className="h-2.5 w-2.5 rounded-full bg-black/20" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-black/45">
                This week only
              </p>
              <h3 className="mt-4 text-4xl font-black uppercase leading-none text-black">
                STRIDE
                <br />
                FASTER
              </h3>
              <p className="mt-4 max-w-xs text-sm leading-6 text-black/65">
                Lightweight runners, clean street pairs, and women’s activewear built for fast checkout testing.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3 text-center text-black">
                <div className="rounded-2xl bg-white px-3 py-4">
                  <p className="text-2xl font-black">12</p>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-black/50">Products</p>
                </div>
                <div className="rounded-2xl bg-white px-3 py-4">
                  <p className="text-2xl font-black">40%</p>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-black/50">Offers</p>
                </div>
                <div className="rounded-2xl bg-white px-3 py-4">
                  <p className="text-2xl font-black">Fast</p>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-black/50">Checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-transparent py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-black/45">
                Browse faster
              </p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-black">
                Shop by category
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="group cursor-pointer overflow-hidden rounded-[1.75rem] border border-black/8 bg-white/80 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-black hover:bg-black hover:text-white hover:shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
              >
                <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
                  <categoryItem.icon className="h-12 w-12 text-black transition-colors duration-300 group-hover:text-white" />
                  <span className="font-bold uppercase tracking-[0.18em]">
                    {categoryItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f3efe7] py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-black/45">
                Trusted labels
              </p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-black">
                Shop by brand
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {brandsWithIcon.map((brandItem) => (
              <Card
                key={brandItem.id}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="group cursor-pointer rounded-[1.75rem] border border-black/8 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.12)]"
              >
                <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
                  <brandItem.icon className="h-12 w-12 text-black/75 transition-colors duration-300 group-hover:text-black" />
                  <span className="font-bold uppercase tracking-[0.18em] text-black">
                    {brandItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-black/45">
                Best picks
              </p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-black">
                Featured products
              </h2>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/shop/listing")}
              className="rounded-full border-black px-5 text-xs font-bold uppercase tracking-[0.2em]"
            >
              See all products
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
