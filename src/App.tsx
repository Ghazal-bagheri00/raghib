import React, { useState, useEffect, useContext, createContext, useRef, useCallback } from 'react';
import { Search, ChevronLeft, Package, Sparkles, AlertCircle, Eye, EyeOff, Settings, X, ExternalLink, Wrench, SlidersHorizontal, RotateCcw, BadgeCheck } from 'lucide-react';
import type { ShopData } from './types';
import { dummyShopData as initialDummyShopData } from './data/dummy';

// Loosely typed app context for speed; can be refined later
const AppContext = createContext<any>(null);

// Dummy data is imported from `src/data/dummy.ts` as `initialDummyShopData`

const formatPrice = (price: number) => `${price.toLocaleString()} تومان`;

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
  </div>
);

const Modal = ({ isOpen, onClose, title, message, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-emerald-500 text-white">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={24} />
          </button>
        </div>
        <div className="p-4 text-gray-700">
          {message && <p className="mb-4">{message}</p>}
          {children}
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

const DevTools = () => {
  const { dummyShopData, setDummyShopData } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jsonText, setJsonText] = useState(JSON.stringify(dummyShopData, null, 2));
  const [error, setError] = useState('');

  useEffect(() => {
    setJsonText(JSON.stringify(dummyShopData, null, 2));
  }, [dummyShopData]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(jsonText)
      .then(() => alert('JSON copied to clipboard!'))
      .catch((err) => alert('Failed to copy JSON: ' + err));
  };

  const handleModify = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setDummyShopData(parsed);
      setError('');
      setIsModalOpen(false);
      alert('Dummy data updated successfully!');
    } catch (e: any) {
      setError('Invalid JSON format: ' + e.message);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-4 right-4 bg-emerald-200 p-2 rounded-full shadow-lg opacity-20 hover:opacity-100 transition-opacity duration-200 z-50"
        title="Developer Tools"
      >
        <Settings size={20} className="text-emerald-800" />
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Developer Tools">
        <div className="flex flex-col space-y-4">
          <p className="text-sm text-gray-600">View and modify the dummy JSON data.</p>
          <textarea
            className="w-full h-80 p-2 border border-gray-300 rounded-md font-mono text-sm resize-y"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button onClick={handleCopy} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150 ease-in-out">
              کپی JSON
            </button>
            <button onClick={handleModify} className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition duration-150 ease-in-out">
              به روز رسانی JSON
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const Header = ({ title, onBack, compact = false }: any) => (
  <header className={`sticky top-0 bg-white shadow-sm ${compact ? 'p-2' : 'p-4'} flex items-center justify-between z-40 rounded-b-xl`}>
    {onBack && (
      <button onClick={onBack} className="text-gray-600 hover:text-emerald-600 transition-colors duration-200">
        <ChevronLeft size={24} />
      </button>
    )}
    <h1 className="text-lg font-bold text-gray-800 mx-auto">{title}</h1>
    <div className="w-6"></div>
  </header>
);

const MyProductCard = ({ product, onClick, onBasalamPageClick }: any) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer flex flex-col transition-all duration-300 ease-in-out hover:shadow-lg hover:border-emerald-500 border border-gray-200">
    <div className="relative w-full h-40 overflow-hidden" onClick={onClick}>
      <img
        src={product.photo_id}
        alt={product.title}
        className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        onError={(e: any) => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/200x200/cccccc/333333?text=No+Image';
        }}
      />
    </div>
    <div className="p-3 flex-grow flex flex-col" onClick={onClick}>
      <h3 className="text-sm font-semibold text-gray-800 mb-1 leading-tight line-clamp-2">{product.title}</h3>
      <p className="text-emerald-600 font-bold text-base mt-auto">{formatPrice(product.price)}</p>
    </div>
    <div className="p-3 border-t border-gray-100">
      <button onClick={onBasalamPageClick} className="w-full flex items-center justify-center py-2 px-3 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out shadow-sm">
        <Eye size={16} className="ml-2" />
        مشاهده در Basalam
      </button>
    </div>
  </div>
);

const MyProducts = () => {
  const { navigate, setSelectedProduct, dummyShopData } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [displayCount, setDisplayCount] = useState(6);
  const productsRef = useRef<HTMLDivElement | null>(null);

  const filteredAndSortedProducts = dummyShopData.my_products
    .filter((product: any) => product.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'newest' ? +dateB - +dateA : +dateA - +dateB;
    });

  const displayedProducts = filteredAndSortedProducts.slice(0, displayCount);

  const loadMoreProducts = useCallback(() => {
    setTimeout(() => {
      setDisplayCount((prevCount) => Math.min(prevCount + 6, filteredAndSortedProducts.length));
    }, 300);
  }, [filteredAndSortedProducts.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayCount < filteredAndSortedProducts.length) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (productsRef.current) {
      observer.observe(productsRef.current);
    }

    return () => {
      if (productsRef.current) {
        observer.unobserve(productsRef.current);
      }
    };
  }, [displayCount, filteredAndSortedProducts.length, loadMoreProducts]);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    navigate('product-detail');
  };

  const handleBasalamPageClick = (e: React.MouseEvent<HTMLButtonElement>, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="محصولات من" onBack={() => navigate('dashboard')} />
      <div className="p-4 flex flex-col space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="جستجوی محصول..."
            className="w-full p-3 pl-10 pr-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-700 justify-end">
          <span className="font-medium ml-2">مرتب سازی:</span>
          <button
            onClick={() => setSortOrder('newest')}
            className={`px-3 py-1 rounded-full transition-colors duration-200 ${
              sortOrder === 'newest' ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            جدیدترین
          </button>
          <button
            onClick={() => setSortOrder('oldest')}
            className={`px-3 py-1 rounded-full transition-colors duration-200 ${
              sortOrder === 'oldest' ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            قدیمی ترین
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-16">
          {displayedProducts.map((product: any) => (
            <MyProductCard
              key={product.id}
              product={product}
              onClick={() => handleProductClick(product)}
              onBasalamPageClick={(e: any) => handleBasalamPageClick(e, product.basalamUrl)}
            />
          ))}
          {displayCount < filteredAndSortedProducts.length && (
            <div ref={productsRef} className="col-span-full">
              <LoadingSpinner />
            </div>
          )}
        </div>
        {displayedProducts.length === 0 && <p className="text-center text-gray-500 mt-8">محصولی یافت نشد.</p>}
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { navigate, selectedProduct, dummyShopData, setDummyShopData } = useContext(AppContext);
  const [showOriginalProductFloating, setShowOriginalProductFloating] = useState(false);
  const [isFloatingExpanded, setIsFloatingExpanded] = useState(false);
  const [showSimilars, setShowSimilars] = useState(false);
  const [filterOnlyCheaper, setFilterOnlyCheaper] = useState(false);
  const [percentOverAllowance, setPercentOverAllowance] = useState(0); // 0..50
  const [isCompetitorsModalOpen, setIsCompetitorsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [isChangePriceOpen, setIsChangePriceOpen] = useState(false);
  const [priceInput, setPriceInput] = useState<string>('');
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempPercent, setTempPercent] = useState<number>(percentOverAllowance);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMoreSearchOpen, setIsMoreSearchOpen] = useState(false);
  const [searchMethod, setSearchMethod] = useState<'image' | 'image+title' | 'title'>('image+title');
  const [visibleSimilarsCount, setVisibleSimilarsCount] = useState(12);
  const similarsContainerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const [applyHidden, setApplyHidden] = useState(true);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [isEyeModalOpen, setIsEyeModalOpen] = useState(false);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  // Load hidden list per product from localStorage
  useEffect(() => {
    if (!selectedProduct) return;
    const raw = localStorage.getItem(`hiddenIds_${selectedProduct.id}`);
    if (raw) {
      try {
        const arr: string[] = JSON.parse(raw);
        setHiddenIds(new Set(arr));
      } catch {}
    } else {
      setHiddenIds(new Set());
    }
  }, [selectedProduct]);
  // Persist when hiddenIds changes
  useEffect(() => {
    if (!selectedProduct) return;
    localStorage.setItem(`hiddenIds_${selectedProduct.id}`, JSON.stringify(Array.from(hiddenIds)));
  }, [hiddenIds, selectedProduct]);

  useEffect(() => {
    if (!selectedProduct) {
      navigate('my-products');
    }
  }, [selectedProduct, navigate]);

  const productSimilars = selectedProduct ? dummyShopData.similars[selectedProduct.id] || [] : [];

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    setShowOriginalProductFloating(scrollPosition > 200);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Infinite scroll for similars
  useEffect(() => {
    if (!showSimilars) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleSimilarsCount((n) => n + 8);
      }
    }, { root: null, threshold: 0.1 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [showSimilars]);

  const addAsCompetitor = (similarProduct: any) => {
    setDummyShopData((prevData: any) => {
      const newSimilars = { ...prevData.similars };
      if (newSimilars[selectedProduct.id]) {
        newSimilars[selectedProduct.id] = newSimilars[selectedProduct.id].map((s: any) =>
          s.id === similarProduct.id ? { ...s, isCompetitor: !s.isCompetitor } : s
        );
      }
      return { ...prevData, similars: newSimilars };
    });
    setToast({ message: `وضعیت رقیب برای "${similarProduct.title}" تغییر کرد`, type: 'success' });
    setTimeout(() => setToast(null), 2000);
  };

  const sortedSimilars = productSimilars
    .filter((p: any) => {
      if (!filterOnlyCheaper) return true;
      if (!selectedProduct) return true;
      const maxAllowed = selectedProduct.price * (1 + percentOverAllowance / 100);
      return p.price <= maxAllowed;
    })
    .filter((p: any) => (applyHidden ? !hiddenIds.has(p.id) : true))
    .sort((a: any, b: any) => {
    if (a.price !== b.price) {
      return a.price - b.price;
    }
    return a.isCompetitor === b.isCompetitor ? 0 : a.isCompetitor ? 1 : -1;
    });

  // Press-and-hold to open lightbox
  const startHoldToZoom = (src: string, stopProp?: (e: any) => void) => (e: any) => {
    if (stopProp) stopProp(e);
    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    holdTimerRef.current = window.setTimeout(() => {
      setLightboxSrc(src);
      holdTimerRef.current = null;
    }, 450);
  };
  const cancelHoldToZoom = () => {
    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  if (!selectedProduct) {
    return <LoadingSpinner />;
  }

  const currentCompetitors = productSimilars.filter((s: any) => s.isCompetitor);
  const lowestPriceCompetitor = currentCompetitors.reduce(
    (min: any, p: any) => (p.price < min.price ? p : min),
    { price: Infinity, title: 'N/A' }
  );
  const averageCompetitorPrice = currentCompetitors.length > 0
    ? currentCompetitors.reduce((sum: number, p: any) => sum + p.price, 0) / currentCompetitors.length
    : 0;
  const priceDifference =
    lowestPriceCompetitor.price !== Infinity && selectedProduct ? selectedProduct.price - lowestPriceCompetitor.price : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="جزئیات محصول" compact />
      <button
        onClick={() => navigate('my-products')}
        className="fixed top-2 left-2 z-40 bg-white/90 border border-gray-200 p-2 rounded-full shadow hover:bg-white"
        aria-label="بازگشت"
      >
        <ChevronLeft size={20} className="text-gray-700" />
      </button>

      {showOriginalProductFloating && (
        <div
          className="fixed top-14 left-4 right-4 md:left-8 md:right-8 z-30 bg-white shadow-lg border border-gray-200 p-3 rounded-xl"
          onClick={() => setIsFloatingExpanded((v) => !v)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedProduct.photo_id}
                alt={selectedProduct.title}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div>
                <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-1">{selectedProduct.title}</h3>
                <p className="text-emerald-600 font-bold text-sm md:text-md">{formatPrice(selectedProduct.price)}</p>
              </div>
            </div>
            <span className="text-blue-600 text-xs select-none">{isFloatingExpanded ? 'نمایش کمتر' : 'مشاهده کامل'}</span>
          </div>
          {isFloatingExpanded && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="col-span-2">
                <p className="text-gray-700">{selectedProduct.description}</p>
              </div>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {selectedProduct.photos.map((p: string, i: number) => (
                  <img
                    key={i}
                    src={p}
                    alt={String(i)}
                    className="w-24 h-20 object-cover rounded-md border cursor-zoom-in"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxSrc(p);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-4 pt-0 md:p-6 pb-24 relative">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-4 right-4 z-40 px-4 py-2 rounded-md shadow-md border ${
            toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            {toast.message}
          </div>
        )}
        <div className="flex flex-nowrap overflow-x-auto gap-2 p-2 bg-white rounded-xl shadow-md mb-4 scrollbar-hide">
          {selectedProduct.photos.map((photo: string, index: number) => (
            <img
              key={index}
              src={photo}
              alt={`${selectedProduct.title} image ${index + 1}`}
              className="flex-shrink-0 w-40 h-32 object-cover rounded-lg shadow-sm border border-gray-100 cursor-zoom-in select-none"
              onPointerDown={startHoldToZoom(photo)}
              onPointerUp={cancelHoldToZoom}
              onPointerLeave={cancelHoldToZoom}
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/150x100/cccccc/333333?text=No+Image';
              }}
            />
          ))}
        </div>

        {/* Lightbox for images */}
        {lightboxSrc && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={() => setLightboxSrc(null)}>
            <img src={lightboxSrc} alt="full" className="max-w-[95vw] max-h-[95vh] object-contain" />
          </div>
        )}

        <div className="bg-white p-4 rounded-xl shadow-md mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedProduct.title}</h2>
          <p className="text-emerald-600 text-2xl font-bold mb-3">{formatPrice(selectedProduct.price)}</p>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">{selectedProduct.description}</p>

          <div className="border-t border-gray-200 pt-3">
            <h4 className="font-bold text-gray-800 text-md mb-2">اطلاعات قیمت رقبا:</h4>
            {currentCompetitors.length > 0 ? (
              <>
                <button
                  className="text-sm text-blue-700 hover:underline mb-1 text-right"
                  onClick={() => {
                    // if a competitor has a link, we could use it; for now open product page
                    window.open(selectedProduct.basalamUrl, '_blank');
                  }}
                  title="مشاهده در باسلام"
                >
                  <span className="font-semibold text-gray-800">پایین ترین قیمت رقیب:</span> {formatPrice(lowestPriceCompetitor.price)} ({
                    lowestPriceCompetitor.title !== 'N/A' ? lowestPriceCompetitor.title : 'نا مشخص'
                  })
                </button>
                {lowestPriceCompetitor.price !== Infinity && (
                  <div className="flex items-center gap-3 text-sm mb-1">
                    {selectedProduct.price < lowestPriceCompetitor.price ? (
                      <span className="px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200">−{Math.round(Math.abs(priceDifference) / selectedProduct.price * 100)}%</span>
                    ) : selectedProduct.price > lowestPriceCompetitor.price ? (
                      <span className="px-2 py-1 rounded bg-red-50 text-red-700 border border-red-200">+{Math.round(Math.abs(priceDifference) / lowestPriceCompetitor.price * 100)}%</span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">=</span>
                    )}
                    <span className="text-gray-700">شما</span>
                    <span className="font-bold">{formatPrice(selectedProduct.price)}</span>
                    <span className="text-gray-400">vs</span>
                    <span className="text-gray-700">کمترین</span>
                    <span className="font-bold">{formatPrice(lowestPriceCompetitor.price)}</span>
                  </div>
                )}
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">میانگین قیمت رقبا:</span> {formatPrice(averageCompetitorPrice)}
                </p>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setIsCompetitorsModalOpen(true)}
                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md border"
                  >
                    مشاهده رقبای فعلی شما
                  </button>
                  <button
                    onClick={() => {
                      setPriceInput(String(selectedProduct.price));
                      setIsChangePriceOpen(true);
                    }}
                    className="px-3 py-2 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                  >
                    تغییر قیمت
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-2 text-sm">هنوز رقیبی اضافه نشده است. برای مقایسه، ابتدا رقبا را اضافه کنید.</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mb-6">
          <button onClick={() => setShowSimilars((v) => !v)} className="flex-1 flex items-center justify-center p-4 bg-emerald-600 text-white rounded-xl shadow-md hover:bg-emerald-700 transition duration-300 ease-in-out">
            <Sparkles className="ml-3" />
            <span className="text-lg font-semibold">{showSimilars ? 'پنهان کردن رقبا' : 'نتایج بیشتر'}</span>
          </button>
          {/* Empty to keep layout; tools moved to sticky corner */}
          <div />
        </div>

        {/* Similar products can be toggled; competitors modal is independent */}
        {showSimilars && (
          <>
            <div ref={similarsContainerRef} className="bg-white p-4 rounded-xl shadow-md mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3">محصولات مشابه (از جستجو Basalam)</h3>
              {sortedSimilars.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {sortedSimilars.slice(0, visibleSimilarsCount).map((similar: any, idx: number) => (
                    <div
                      key={similar.id}
                      onClick={() => addAsCompetitor(similar)}
                      data-similar-id={similar.id}
                      className={`relative bg-gray-100 rounded-xl overflow-hidden flex flex-col items-center justify-between p-3 transition-all duration-300 ease-in-out cursor-pointer border ${
                        similar.isCompetitor ? 'border-2 border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.2),0_10px_25px_-5px_rgba(239,68,68,0.5)]' : 'border-gray-200 hover:shadow-md hover:scale-[1.02]'
                      }`}
                    >
                      <img
                        src={similar.photo_id}
                        alt={similar.title}
                        className="w-28 h-28 object-cover rounded-lg mb-2 border border-gray-200 cursor-zoom-in select-none"
                        onPointerDown={startHoldToZoom(similar.photo_id, (e) => e.stopPropagation())}
                        onPointerUp={cancelHoldToZoom}
                        onPointerLeave={cancelHoldToZoom}
                        onError={(e: any) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/120x120/cccccc/333333?text=Sim+Image';
                        }}
                      />
                      <button
                        className="absolute top-2 left-2 p-1 rounded-full bg-white/90 border hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(selectedProduct.basalamUrl, '_blank');
                        }}
                        title="مشاهده در باسلام"
                      >
                        <ExternalLink size={14} />
                      </button>
                      <h4 className="text-center text-sm font-semibold text-gray-800 mb-1 line-clamp-2">{similar.title}</h4>
                      <p className="text-emerald-600 font-bold text-base">{formatPrice(similar.price)}</p>
                      <button
                        className="mt-3 w-full py-2 px-3 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(selectedProduct.basalamUrl, '_blank');
                        }}
                      >
                        مشاهده در باسلام
                      </button>
                    </div>
                  ))}
                  <div ref={sentinelRef} className="col-span-full h-1"></div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">هیچ محصول مشابهی یافت نشد.</p>
              )}
            </div>

          </>
        )}

      {/* Sticky Tools (bottom-left) */}
      <div className="fixed bottom-4 left-4 z-40">
        <div className="relative">
          <button
            onClick={() => setIsToolsOpen((v) => !v)}
            className="p-3 rounded-full border shadow-lg bg-white hover:bg-gray-50"
            title="ابزارها"
          >
            {isToolsOpen ? <X size={18} /> : <Wrench size={18} />}
          </button>
          {isToolsOpen && (
            <div className="absolute bottom-12 left-0 bg-white border rounded-xl shadow-xl p-2 flex items-center gap-2">
              {/* Eye -> opens modal with reset/refresh */}
              <button
                onClick={() => setIsEyeModalOpen(true)}
                className="p-2 rounded-full border hover:bg-gray-50"
                title="چشم"
              >
                <Eye size={16} />
              </button>
              {/* New badge toggle */}
              <button
                onClick={() => setApplyHidden((v) => !v)}
                className={`p-2 rounded-full border ${applyHidden ? 'bg-emerald-100 text-emerald-700' : 'bg-white'}`}
                title="نمایش موارد جدید"
              >
                <BadgeCheck size={16} />
              </button>
              {/* Search (more search) */}
              <button
                onClick={() => setIsMoreSearchOpen(true)}
                className="p-2 rounded-full border bg-emerald-100 text-emerald-700"
                title="جستجو"
              >
                <Search size={16} />
              </button>
              {/* Dev settings (dummy data) */}
              <button
                onClick={() => setIsDevToolsOpen(true)}
                className="p-2 rounded-full border hover:bg-gray-50"
                title="تنظیمات توسعه"
              >
                <Settings size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Eye Modal: reset / refresh */}
      {isEyeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={() => setIsEyeModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b">
              <h3 className="font-bold text-gray-800">چشم (موارد پنهان)</h3>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <p>چه کاری می‌خواهید انجام دهید؟</p>
              <button
                className="w-full px-3 py-2 rounded-md border hover:bg-gray-50"
                onClick={() => {
                  // refresh = add newly viewed items
                  const elements = Array.from((similarsContainerRef.current || document.createElement('div')).querySelectorAll('[data-similar-id]')) as HTMLElement[];
                  let lastIdx = -1;
                  for (let i = 0; i < elements.length; i++) {
                    const rect = elements[i].getBoundingClientRect();
                    if (rect.top < (window.innerHeight - 80)) lastIdx = i; else break;
                  }
                  if (lastIdx >= 0) {
                    const toHide: string[] = [];
                    for (let i = 0; i <= lastIdx; i++) {
                      const id = elements[i].dataset.similarId;
                      if (id) toHide.push(id);
                    }
                    setHiddenIds(prev => new Set([...Array.from(prev), ...toHide]));
                    setToast({ message: `${toHide.length} مورد اضافه شد`, type: 'info' });
                    setTimeout(() => setToast(null), 1500);
                  }
                  setIsEyeModalOpen(false);
                }}
              >
                بروزرسانی چشم (اضافه کردن موارد دیده‌شده)
              </button>
              <button
                className="w-full px-3 py-2 rounded-md border hover:bg-red-50 text-red-700 border-red-200"
                onClick={() => {
                  if (confirm('لیست پنهان‌سازی ریست شود؟')) {
                    setHiddenIds(new Set());
                    setIsEyeModalOpen(false);
                    setToast({ message: 'ریست شد', type: 'info' });
                    setTimeout(() => setToast(null), 1500);
                  }
                }}
              >
                ریست چشم
              </button>
            </div>
            <div className="p-4 border-t text-right">
              <button className="px-3 py-2 text-sm rounded-md border" onClick={() => setIsEyeModalOpen(false)}>بستن</button>
            </div>
          </div>
        </div>
      )}

        {/* Competitors Modal (independent, always available via button) */}
        {isCompetitorsModalOpen && (
          <div className="fixed inset-0 z-40 bg-black/30 flex items-start justify-center p-4" onClick={() => setIsCompetitorsModalOpen(false)}>
            <div
              className="bg-white rounded-xl shadow-xl border border-gray-200 mt-16 max-h-[30vh] w-full max-w-md overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-3 border-b">
                <h3 className="font-bold text-gray-800 text-sm">رقبای فعلی شما</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsCompetitorsModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>
              <div className="p-3">
                {currentCompetitors.length > 0 ? (
                  <ul className="space-y-3">
                    {currentCompetitors.map((comp: any) => (
                      <li key={comp.id} className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-100">
                        <img
                          src={comp.photo_id}
                          alt={comp.title}
                          className="w-12 h-12 object-cover rounded-md ml-3"
                          onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/50x50/cccccc/333333?text=N/A';
                          }}
                        />
                        <div className="flex-grow">
                          <p className="font-semibold text-sm text-gray-700 line-clamp-1">{comp.title}</p>
                          <p className="text-red-500 font-bold text-base">{formatPrice(comp.price)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">هنوز رقیبی اضافه نشده است.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filter Modal */}
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={() => setIsFilterModalOpen(false)}>
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b">
                <h3 className="font-bold text-gray-800">فیلتر قیمت</h3>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-sm text-gray-600">حداکثر درصد بالاتر از قیمت شما که نمایش داده شود:</p>
                <div className="flex items-center gap-3">
                  <input type="range" min={0} max={50} step={1} value={tempPercent} onChange={(e) => setTempPercent(Number(e.target.value))} />
                  <span className="w-10 text-right">{tempPercent}%</span>
                </div>
                <div className="text-xs text-gray-500">حالت فعال: {filterOnlyCheaper ? `ارزان‌تر از ${percentOverAllowance}% +` : 'غیرفعال'}</div>
              </div>
              <div className="p-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {filterOnlyCheaper && (
                    <div className="flex items-center gap-2 text-xs bg-red-50 border border-red-200 text-red-700 px-2 py-1 rounded">
                      <span>Cheaper than {percentOverAllowance}% +</span>
                      <button
                        className="hover:underline"
                        onClick={() => {
                          setFilterOnlyCheaper(false);
                          setPercentOverAllowance(0);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button className="px-3 py-2 text-sm rounded-md border" onClick={() => setIsFilterModalOpen(false)}>انصراف</button>
                  <button
                    className="px-3 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => {
                      setPercentOverAllowance(tempPercent);
                      setFilterOnlyCheaper(true);
                      setIsFilterModalOpen(false);
                    }}
                  >
                    اعمال
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* More Search Modal */}
        {isMoreSearchOpen && (
          <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={() => setIsMoreSearchOpen(false)}>
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b">
                <h3 className="font-bold text-gray-800">جستجو</h3>
              </div>
              <div className="p-4 space-y-3">
                <button className="w-full px-3 py-2 text-sm rounded-md border hover:bg-gray-50" onClick={() => { setIsMoreSearchOpen(false); setToast({ message: 'موارد بیشتر (نمونه)', type: 'info' }); setTimeout(() => setToast(null), 2000);}}>موارد بیشتر</button>
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-700 mb-2">روش جستجو:</p>
                  {(['image', 'image+title', 'title'] as const).filter((m) => m !== searchMethod).map((m) => (
                    <button key={m} className="w-full px-3 py-2 text-sm rounded-md border hover:bg-gray-50 mb-2" onClick={() => { setSearchMethod(m); setIsMoreSearchOpen(false); setToast({ message: `روش جستجو: ${m}`, type: 'info' }); setTimeout(() => setToast(null), 2000);}}>
                      {m === 'image' ? 'image' : m === 'image+title' ? 'image + title' : 'title'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t text-right">
                <button className="px-3 py-2 text-sm rounded-md border" onClick={() => setIsMoreSearchOpen(false)}>بستن</button>
              </div>
            </div>
          </div>
        )}
        {/* Change Price Modal */}
        {isChangePriceOpen && (
          <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={() => setIsChangePriceOpen(false)}>
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b">
                <h3 className="font-bold text-gray-800">تغییر قیمت</h3>
              </div>
              <div className="p-4 space-y-3">
                <label className="text-sm text-gray-600">قیمت جدید (تومان)</label>
                <input
                  type="number"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  min={0}
                />
                <p className="text-xs text-gray-500">برای اعمال قیمت جدید روی دکمه تایید کلیک کنید.</p>
              </div>
              <div className="p-4 border-t flex items-center justify-end gap-2">
                <button className="px-3 py-2 text-sm rounded-md border" onClick={() => setIsChangePriceOpen(false)}>انصراف</button>
                <button
                  className="px-3 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() => {
                    const next = Number(priceInput);
                    if (!isNaN(next) && next > 0) {
                      setDummyShopData((prev: ShopData) => ({
                        ...prev,
                        my_products: prev.my_products.map((p: any) => (p.id === selectedProduct.id ? { ...p, price: next } : p)),
                      }));
                      setToast({ message: 'قیمت با موفقیت به‌روزرسانی شد', type: 'success' });
                      setTimeout(() => setToast(null), 2000);
                      setIsChangePriceOpen(false);
                    }
                  }}
                >
                  تایید
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'my-products' | 'product-detail' | 'not-best-price'>('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [basalamToken, setBasalamToken] = useState('');
  const [dummyShopData, setDummyShopData] = useState<ShopData>(initialDummyShopData);

  const navigate = (page: typeof currentPage) => {
    setCurrentPage(page);
    if (page === 'my-products') {
      setSelectedProduct(null);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'my-products':
        return <MyProducts />;
      case 'product-detail':
        return <ProductDetail />;
      case 'not-best-price':
        return (
          <div className="p-4 text-center min-h-screen bg-gray-50 flex flex-col">
            <Header title="محصولات با قیمت غیر رقابتی" onBack={() => navigate('dashboard')} />
            <p className="text-gray-600 mt-8">این صفحه هنوز در حال توسعه است. به زودی ویژگی‌های بیشتری اضافه خواهد شد!</p>
            <AlertCircle size={48} className="text-yellow-500 mx-auto mt-8" />
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppContext.Provider
      value={{
        navigate,
        selectedProduct,
        setSelectedProduct,
        basalamToken,
        setBasalamToken,
        dummyShopData,
        setDummyShopData,
      }}
    >
      <div className="font-['Inter'] antialiased bg-gray-50 text-gray-900 min-h-screen">
        {renderPage()}
        <DevTools />
      </div>
    </AppContext.Provider>
  );
};

const Dashboard = () => {
  const { navigate } = useContext(AppContext);
  return (
    <div className="p-4 max-w-md mx-auto h-screen flex flex-col justify-center">
      <div className="bg-emerald-100 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold text-emerald-800 mb-6">به پنل Basalam خوش آمدید!</h2>
        <div className="space-y-4 w-full">
          <button
            onClick={() => navigate('my-products')}
            className="w-full flex items-center justify-center p-4 bg-emerald-600 text-white rounded-xl shadow-md hover:bg-emerald-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <Package className="mr-3" />
            <span className="text-lg font-semibold">همه محصولات من</span>
          </button>
          <button
            onClick={() => navigate('not-best-price')}
            className="w-full flex items-center justify-center p-4 bg-yellow-500 text-white rounded-xl shadow-md hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <AlertCircle className="mr-3" />
            <span className="text-lg font-semibold">محصولات با قیمت غیر رقابتی</span>
          </button>
        </div>
        <p className="mt-6 text-sm text-gray-600">برای اتصال به Basalam، توکن خود را در قسمت تنظیمات وارد کنید.</p>
      </div>
    </div>
  );
};

export default App;


