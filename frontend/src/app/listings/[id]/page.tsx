'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Star, 
  Heart, 
  Share2, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Calendar as CalendarIcon, 
  Check, 
  MapPin, 
  User as UserIcon, 
  X, 
  Grid,
  ChevronRight,
  ChevronLeft,
  Lock,
  Key,
  MessageSquare,
  SprayCan,
  Tag,
  CheckCircle,
  Home,
  Briefcase,
  GraduationCap,
  Flag,
  Wifi,
  Tv,
  Wind,
  Utensils,
  Camera,
  Ban,
  ArrowUpDown,
  Gift,
  ChevronDown,
  BedDouble,
  Keyboard,
  LogOut,
  Maximize2
} from 'lucide-react';
import { Listing, Review } from '@/types';
import { api, getCurrentUserId } from '@/services/api';
import toast from 'react-hot-toast';
import { FALLBACK_STAY_IMAGE, getListingImageUrl, useImageFallback } from '@/lib/images';
import { MapView } from '@/components/MapView';

const REGIONAL_DESTINATIONS = [
  { name: 'Lucknow', desc: 'Holiday rentals' },
  { name: 'Kathmandu', desc: 'Holiday rentals' },
  { name: 'Patna', desc: 'Holiday rentals' },
  { name: 'Pokhara', desc: 'Holiday rentals' },
  { name: 'Ranchi', desc: 'Holiday rentals' },
  { name: 'Allahabad', desc: 'Holiday rentals' },
  { name: 'Raipur', desc: 'Holiday rentals' },
  { name: 'Kanpur', desc: 'Holiday rentals' },
  { name: 'Faizabad', desc: 'Holiday rentals' },
];

const GUEST_MENTION_TAGS = [
  { label: 'Cleanliness', count: 49, icon: SprayCan },
  { label: 'Accuracy', count: 26, icon: CheckCircle },
  { label: 'Check-in', count: 17, icon: Key },
  { label: 'Checkout', count: 9, icon: LogOut },
  { label: 'Comfort', count: 22, icon: BedDouble },
  { label: 'Hospitality', count: 39, icon: Gift },
  { label: 'Amenities', count: 13, icon: Sparkles },
];

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = Number(params?.id);

  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [nearbyListings, setNearbyListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [listingLoadError, setListingLoadError] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState<{check_in: string; check_out: string}[]>([]);

  // Sticky header visibility on scroll
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [activeTab, setActiveTab] = useState<'photos' | 'amenities' | 'reviews' | 'location'>('photos');

  // Booking dates state (default check-in: 2026-10-23, check-out: 2026-10-25 or dynamic)
  const [checkIn, setCheckIn] = useState(() => { 
    const d = new Date(); 
    d.setDate(d.getDate() + 7); 
    return d.toISOString().slice(0, 10); 
  });
  const [checkOut, setCheckOut] = useState(() => { 
    const d = new Date(); 
    d.setDate(d.getDate() + 9); 
    return d.toISOString().slice(0, 10); 
  });
  const [guests, setGuests] = useState(1);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');

  // Modals & Expanders
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showAllAmenitiesModal, setShowAllAmenitiesModal] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  // Calendar month state
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(9); // 0-indexed: 9 = October

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyNav(window.scrollY > 400);

      const photosEl = document.getElementById('photos');
      const amenitiesEl = document.getElementById('amenities');
      const reviewsEl = document.getElementById('reviews');
      const locationEl = document.getElementById('location');

      const scrollPos = window.scrollY + 150;
      if (locationEl && scrollPos >= locationEl.offsetTop) {
        setActiveTab('location');
      } else if (reviewsEl && scrollPos >= reviewsEl.offsetTop) {
        setActiveTab('reviews');
      } else if (amenitiesEl && scrollPos >= amenitiesEl.offsetTop) {
        setActiveTab('amenities');
      } else if (photosEl) {
        setActiveTab('photos');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!listingId) return;

    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('checkIn')) setCheckIn(queryParams.get('checkIn')!);
    if (queryParams.get('checkOut')) setCheckOut(queryParams.get('checkOut')!);
    if (queryParams.get('guests')) setGuests(Math.max(1, Number(queryParams.get('guests')) || 1));

    setLoading(true);
    api.getListingById(listingId)
      .then(async (listingData) => {
        setListing(listingData);
        const [reviewData, wishlistData, allListings, availability] = await Promise.all([
          api.getListingReviews(listingId).catch(() => []),
          getCurrentUserId() ? api.checkWishlist(getCurrentUserId()!, listingId).catch(() => ({ in_wishlist: false })) : Promise.resolve({ in_wishlist: false }),
          api.getListings().catch(() => ({ items: [] })),
          api.getAvailability(listingId).catch(() => ({ unavailable_dates: [] })),
        ]);
        setReviews(reviewData);
        setIsWishlist(wishlistData.in_wishlist);
        setNearbyListings(allListings.items.filter((l) => l.id !== listingId));
        setUnavailableDates(availability.unavailable_dates);
      })
      .catch((err) => {
        toast.error(err.message || 'Could not load this stay');
        setListingLoadError(true);
        setListing(null);
      })
      .finally(() => setLoading(false));
  }, [listingId]);

  const handleToggleWishlist = async () => {
    if (!listing) return;
    const userId = getCurrentUserId();
    if (!userId) { router.push(`/login?next=/listings/${listing.id}`); return; }
    try {
      const res = await api.toggleWishlist(userId, listing.id);
      setIsWishlist(res.in_wishlist);
      toast.success(res.in_wishlist ? 'Saved to wishlist' : 'Removed from wishlist');
    } catch {
      toast.error('Could not update wishlist');
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 2;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 2;
  };

  const nights = calculateNights();
  const nightlySubtotal = listing ? listing.price_per_night * nights : 0;
  const cleaningFee = Math.round(nightlySubtotal * 0.05 * 100) / 100;
  const serviceFee = Math.round(nightlySubtotal * 0.10 * 100) / 100;
  const totalDue = nightlySubtotal + cleaningFee + serviceFee;

  const handleReserveClick = () => {
    if (!getCurrentUserId()) {
      router.push(`/login?next=/listings/${listing?.id}`);
      return;
    }
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      toast.error('Choose a check-out date after check-in');
      return;
    }
    if (unavailableDates.some((range) => checkIn < range.check_out && checkOut > range.check_in)) {
      toast.error('Those dates overlap an existing reservation. Choose different dates.');
      return;
    }
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!listing) return;
    const guestId = getCurrentUserId();
    if (!guestId) { router.push(`/login?next=/listings/${listing.id}`); return; }
    setIsSubmittingBooking(true);
    try {
      const booking = await api.createDemoCheckout({ 
        listing_id: listing.id, 
        guest_id: guestId, 
        check_in: checkIn, 
        check_out: checkOut, 
        guests, 
        payment_method: paymentMethod 
      });
      router.push(`/payment/success?booking_id=${booking.booking_id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not complete demo payment');
      setIsSubmittingBooking(false);
    }
  };

  const handleAddReview = async () => {
    if (!listing || !newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    const userId = getCurrentUserId();
    if (!userId) { router.push(`/login?next=/listings/${listing.id}`); return; }
    try {
      const createdReview = await api.createReview({
        listing_id: listing.id,
        user_id: userId,
        rating: newRating,
        comment: newComment,
      });
      toast.success('Review posted!');
      setReviews([createdReview, ...reviews]);
      setIsReviewModalOpen(false);
      setNewComment('');
    } catch (err: any) {
      toast.error(err.message || 'Could not submit review');
    }
  };

  // Calendar Day click handler
  const handleDateClick = (dateStr: string) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr);
      setCheckOut('');
    } else if (checkIn && !checkOut) {
      if (dateStr > checkIn) {
        setCheckOut(dateStr);
      } else {
        setCheckIn(dateStr);
        setCheckOut('');
      }
    }
  };

  const renderMonthCalendar = (year: number, monthIndex: number) => {
    const monthDate = new Date(year, monthIndex, 1);
    const monthName = monthDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const firstDay = monthDate.getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const gridCells = [];
    for (let i = 0; i < firstDay; i++) {
      gridCells.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDay = day < 10 ? `0${day}` : `${day}`;
      const formattedMonth = monthIndex + 1 < 10 ? `0${monthIndex + 1}` : `${monthIndex + 1}`;
      const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

      const isSelectedStart = dateStr === checkIn;
      const isSelectedEnd = dateStr === checkOut;
      const isInRange = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut;

      let cellStyle = "h-10 w-10 text-xs font-semibold flex items-center justify-center rounded-full transition-all cursor-pointer hover:border hover:border-black ";
      if (isSelectedStart || isSelectedEnd) {
        cellStyle += "bg-[#222222] text-white font-bold shadow-sm ";
      } else if (isInRange) {
        cellStyle += "bg-gray-100 text-gray-900 rounded-none ";
      } else {
        cellStyle += "text-gray-900 hover:bg-gray-100 ";
      }

      gridCells.push(
        <button
          key={dateStr}
          onClick={() => handleDateClick(dateStr)}
          className={cellStyle}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="w-full">
        <h4 className="text-sm font-bold text-gray-900 text-center mb-4">{monthName}</h4>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((wd, i) => (
            <span key={i} className="text-[11px] font-bold text-gray-500">{wd}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 place-items-center">
          {gridCells}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-96 bg-gray-200 rounded-3xl w-full mb-8" />
      </div>
    );
  }

  if (!listing) {
    return (
      <main className="mx-auto grid min-h-[50vh] max-w-xl place-items-center px-5 py-16 text-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{listingLoadError ? 'This stay could not be loaded' : 'Stay not found'}</h1>
          <p className="mt-2 text-sm text-gray-600">The listing may have been removed. Browse available stays and try another one.</p>
          <Link href="/" className="mt-6 inline-flex rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white">Browse stays</Link>
        </div>
      </main>
    );
  }

  const photos = listing.images && listing.images.length > 0 ? listing.images : [FALLBACK_STAY_IMAGE];
  const hostName = listing.host?.name || 'Zainul';
  const ratingVal = listing.rating || 4.89;
  const reviewCount = listing.review_count || 91;

  const defaultAmenitiesList = [
    { label: 'Kitchen', icon: Utensils },
    { label: 'Wifi', icon: Wifi },
    { label: 'TV', icon: Tv },
    { label: 'Lift', icon: ArrowUpDown },
    { label: 'Washing machine', icon: Sparkles },
    { label: 'Air conditioning', icon: Wind },
    { label: 'Hairdryer', icon: Wind },
    { label: 'Exterior security cameras on property', icon: Camera },
    { label: 'Carbon monoxide alarm', icon: Ban, strikethrough: true },
    { label: 'Smoke alarm', icon: Ban, strikethrough: true },
  ];

  const displayedReviews = selectedTag 
    ? reviews.filter((r) => r.comment.toLowerCase().includes(selectedTag.toLowerCase()))
    : reviews;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* Sticky Secondary Top Navbar (Photos, Amenities, Reviews, Location) */}
      {showStickyNav && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-md py-3.5 px-6 transition-all duration-200 animate-in slide-in-from-top-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-8 text-xs font-bold text-gray-900">
              <a 
                href="#photos" 
                className={`py-1 border-b-2 transition ${activeTab === 'photos' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                Photos
              </a>
              <a 
                href="#amenities" 
                className={`py-1 border-b-2 transition ${activeTab === 'amenities' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                Amenities
              </a>
              <a 
                href="#reviews" 
                className={`py-1 border-b-2 transition ${activeTab === 'reviews' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                Reviews
              </a>
              <a 
                href="#location" 
                className={`py-1 border-b-2 transition ${activeTab === 'location' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                Location
              </a>
            </div>

            <div className="flex items-center gap-5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-extrabold text-gray-900">
                  ₹{nightlySubtotal.toLocaleString('en-IN')} <span className="text-xs font-normal text-gray-600">for {nights} nights</span>
                </p>
                <p className="text-[11px] text-gray-600 font-medium">★ {ratingVal.toFixed(2)} · <span className="underline">{reviewCount} reviews</span></p>
              </div>
              <button
                onClick={handleReserveClick}
                className="bg-[#E81948] hover:bg-[#D90B60] text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-md transition duration-200"
              >
                Reserve
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Title Header (Image 1) */}
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {listing.title || `${listing.property_type} in ${listing.city}, ${listing.country}`}
          </h1>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-gray-800 font-semibold">
            <span>{listing.max_guests} guests</span>
            <span>·</span>
            <span>{listing.bedrooms} bedrooms</span>
            <span>·</span>
            <span>{listing.beds} beds</span>
            <span>·</span>
            <span>{listing.bathrooms} bathrooms</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-gray-900">
            <button className="flex items-center gap-1.5 hover:bg-gray-100 py-1.5 px-3 rounded-lg transition">
              <Share2 size={15} /> <span className="underline">Share</span>
            </button>
            <button
              onClick={handleToggleWishlist}
              className="flex items-center gap-1.5 hover:bg-gray-100 py-1.5 px-3 rounded-lg transition"
            >
              <Heart size={15} className={isWishlist ? 'fill-[#FF385C] text-[#FF385C]' : ''} />
              <span className="underline">{isWishlist ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Rating line & Free cancellation pill badge */}
        <div className="flex items-center gap-3 mb-6 text-xs font-bold text-gray-900">
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-gray-900 text-gray-900" />
            <span>{ratingVal.toFixed(2)}</span>
            <span>·</span>
            <a href="#reviews" className="underline font-bold text-gray-900">{reviewCount} reviews</a>
          </div>
          <span className="bg-gray-100 text-gray-800 text-[11px] font-semibold px-2.5 py-1 rounded-md">
            Free cancellation
          </span>
        </div>

        {/* 5 Photo Grid Gallery (Image 1) */}
        <div id="photos" className="relative rounded-3xl overflow-hidden mb-10 shadow-xs border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 aspect-[4/3] md:aspect-[2/1] max-h-[480px]">
            <div className="md:col-span-2 h-full overflow-hidden">
              <img
                src={getListingImageUrl(photos[0], 1400)}
                alt={listing.title}
                onError={useImageFallback}
                className="w-full h-full object-cover hover:scale-105 transition duration-300 cursor-pointer"
                onClick={() => setIsPhotoModalOpen(true)}
              />
            </div>
            <div className="hidden md:grid col-span-2 grid-cols-2 gap-2 h-full">
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="h-full overflow-hidden">
                  <img
                    src={getListingImageUrl(photos[idx] || photos[0], 900)}
                    alt={`${listing.title} photo ${idx}`}
                    onError={useImageFallback}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300 cursor-pointer"
                    onClick={() => setIsPhotoModalOpen(true)}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsPhotoModalOpen(true)}
            className="absolute bottom-4 right-4 bg-white/95 hover:bg-white text-gray-900 border border-gray-900 font-semibold text-xs py-2 px-4 rounded-xl flex items-center gap-2 shadow-md transition"
          >
            <Grid size={14} /> Show all photos
          </button>
        </div>

        {/* Main 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Main Details Column */}
          <div className="lg:col-span-2 space-y-8 divide-y divide-gray-200">
            
            {/* Host overview line */}
            <div className="pb-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 shrink-0 border border-gray-200">
                <img
                  src={listing.host?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80'}
                  alt={hostName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Hosted by {hostName}</h2>
                <p className="text-xs text-gray-500 font-medium">5 years hosting</p>
              </div>
            </div>

            {/* Property Feature Highlights List (Image 1) */}
            <div className="pt-6 space-y-6">
              <div className="flex items-start gap-4">
                <Wind size={24} className="text-gray-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Designed for staying cool</h4>
                  <p className="text-xs text-gray-500">Beat the heat with the A/C and ceiling fan.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Key size={24} className="text-gray-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Self check-in</h4>
                  <p className="text-xs text-gray-500">Check yourself in with the lockbox.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Home size={24} className="text-gray-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Extra spacious</h4>
                  <p className="text-xs text-gray-500">Guests love this home's spaciousness for a comfortable stay.</p>
                </div>
              </div>
            </div>

            {/* Description & "The space" Section (Image 2) */}
            <div className="pt-6 space-y-4">
              <p className="text-xs text-gray-800 leading-relaxed">
                This is another addition to our list of properties where you can kick back and relax with family & friends at this Couple Friendly apartment in a centrally located place. This property is now ready after refurbishment .You can check the calendar to book the available dates for your accommodation.
              </p>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">The space</h3>
                <p className={`text-xs text-gray-700 leading-relaxed ${!showFullDescription ? 'line-clamp-2' : ''}`}>
                  {listing.description || `This elegant property will be entirely to yourself and is situated on the 9th floor of a newly built modern tower in a locality which is so central and convenient to travel across...`}
                </p>
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-3 bg-[#F7F7F7] hover:bg-gray-200 text-gray-900 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition border border-gray-200"
                >
                  {showFullDescription ? 'Show less' : 'Show more'} <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Amenities Section ("What this place offers") (Image 2 & 3) */}
            <div id="amenities" className="pt-6">
              <h3 className="text-base font-bold text-gray-900 mb-6">What this place offers</h3>
              
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8">
                {defaultAmenitiesList.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-4 text-xs text-gray-800">
                      <IconComp size={20} className="text-gray-700 shrink-0" />
                      <span className={item.strikethrough ? 'line-through text-gray-500' : 'font-medium'}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setShowAllAmenitiesModal(true)}
                className="border border-gray-900 bg-white hover:bg-gray-50 text-gray-900 font-bold px-6 py-3 rounded-xl text-xs transition"
              >
                Show all 37 amenities
              </button>
            </div>

            {/* Dual-Month Interactive Calendar Picker Section (Image 3) */}
            <div className="pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{nights} nights in {listing.city}</h3>
              <p className="text-xs text-gray-500 mb-6">{checkIn} - {checkOut}</p>

              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs">
                
                {/* Month navigation arrows */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => {
                      if (calendarMonth === 0) {
                        setCalendarMonth(11);
                        setCalendarYear(calendarYear - 1);
                      } else {
                        setCalendarMonth(calendarMonth - 1);
                      }
                    }}
                    className="p-2 border border-gray-200 rounded-full hover:border-black transition text-gray-700"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    onClick={() => {
                      if (calendarMonth === 11) {
                        setCalendarMonth(0);
                        setCalendarYear(calendarYear + 1);
                      } else {
                        setCalendarMonth(calendarMonth + 1);
                      }
                    }}
                    className="p-2 border border-gray-200 rounded-full hover:border-black transition text-gray-700"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Side-by-Side Dual Month View */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {renderMonthCalendar(calendarYear, calendarMonth)}
                  {renderMonthCalendar(calendarMonth === 11 ? calendarYear + 1 : calendarYear, calendarMonth === 11 ? 0 : calendarMonth + 1)}
                </div>

                {/* Calendar Bottom Bar */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 text-xs">
                  <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Keyboard size={18} />
                  </button>
                  <button
                    onClick={() => { setCheckIn(''); setCheckOut(''); }}
                    className="font-bold text-gray-900 underline hover:text-black"
                  >
                    Clear dates
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* Right Sticky Booking Widget (Image 1, 2, 3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-4">
              
              {/* Pink Banner Header Callout */}
              <div className="bg-rose-50/80 border border-rose-100 text-gray-900 p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold shadow-xs">
                <Tag size={16} className="text-[#FF385C] fill-[#FF385C]" />
                <span>Prices include all fees</span>
              </div>

              {/* Booking Card Box */}
              <div className="bg-white border border-gray-300 rounded-3xl p-6 shadow-xl space-y-5">
                
                {/* Price Display */}
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900 underline decoration-gray-900 underline-offset-4">
                      ₹{nightlySubtotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-medium text-gray-700">for {nights} nights</span>
                  </div>
                </div>

                {/* Date & Guest Input Box */}
                <div className="border border-gray-400 rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-2 border-b border-gray-400">
                    <div className="p-3 border-r border-gray-400">
                      <label className="text-[9px] uppercase font-extrabold tracking-wider text-gray-800 block mb-0.5">CHECK-IN</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full text-xs font-semibold text-gray-900 focus:outline-none bg-transparent cursor-pointer"
                      />
                    </div>
                    <div className="p-3">
                      <label className="text-[9px] uppercase font-extrabold tracking-wider text-gray-800 block mb-0.5">CHECKOUT</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full text-xs font-semibold text-gray-900 focus:outline-none bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="p-3 relative flex items-center justify-between cursor-pointer">
                    <div className="w-full">
                      <label className="text-[9px] uppercase font-extrabold tracking-wider text-gray-800 block mb-0.5">GUESTS</label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full text-xs font-semibold text-gray-900 bg-transparent focus:outline-none appearance-none cursor-pointer pr-6"
                      >
                        {[...Array(listing.max_guests)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1} guest{i + 1 > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <ChevronDown size={16} className="text-gray-700 pointer-events-none absolute right-3 top-4" />
                  </div>
                </div>

                {/* Free Cancellation Notice Pill */}
                <div className="bg-[#F7F7F7] p-3 rounded-xl text-center text-xs text-gray-800 font-semibold">
                  Free cancellation before 18 October
                </div>

                {/* Primary Magenta Reserve Button */}
                <button
                  onClick={handleReserveClick}
                  className="w-full bg-[#E81948] hover:bg-[#D90B60] text-white font-bold py-3.5 rounded-2xl shadow-md transition duration-200 text-base"
                >
                  Reserve
                </button>

                <p className="text-xs text-center text-gray-600 font-medium">You won't be charged yet</p>

                <div className="flex justify-center pt-2">
                  <button className="flex items-center gap-2 text-xs text-gray-600 font-semibold underline hover:text-gray-900">
                    <Flag size={14} /> Report this listing
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Guest Favourite Wreath Graphic Banner (Image 4) */}
        <div id="reviews" className="mt-16 py-12 border-t border-b border-gray-200 text-center space-y-3">
          <div className="flex items-center justify-center gap-3 text-gray-900">
            <span className="text-3xl">🌿</span>
            <span className="text-5xl font-extrabold tracking-tighter">5.0</span>
            <span className="text-3xl">🌿</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Guest favourite</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto font-medium">
            One of the most loved homes on Airbnb based on ratings, reviews, and reliability
          </p>
        </div>

        {/* Reviews Score Breakdown Row (Image 4) */}
        <div className="py-10 border-b border-gray-200">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                ★ {ratingVal.toFixed(2)} · {reviewCount} reviews
              </h2>
              <button className="text-xs font-semibold text-gray-700 underline mt-1">How reviews work</button>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="border border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 font-bold text-xs py-2.5 px-4 rounded-xl transition"
            >
              Write a review
            </button>
          </div>

          {/* 6 Category Rating Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 text-left divide-x divide-gray-100">
            
            {/* Overall Rating Distribution Bar Chart */}
            <div className="space-y-1 pr-2">
              <p className="text-xs font-bold text-gray-900">Overall rating</p>
              <div className="space-y-1 pt-1">
                {[5, 4, 3, 2, 1].map((num) => (
                  <div key={num} className="flex items-center gap-1.5 text-[10px] text-gray-600">
                    <span>{num}</span>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gray-900 rounded-full" 
                        style={{ width: num === 5 ? '92%' : num === 4 ? '8%' : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1 pl-4">
              <p className="text-xs font-bold text-gray-900">Cleanliness</p>
              <p className="text-base font-bold text-gray-900">4.9</p>
              <SprayCan size={20} className="text-gray-800 pt-1" />
            </div>

            <div className="space-y-1 pl-4">
              <p className="text-xs font-bold text-gray-900">Accuracy</p>
              <p className="text-base font-bold text-gray-900">4.9</p>
              <CheckCircle size={20} className="text-gray-800 pt-1" />
            </div>

            <div className="space-y-1 pl-4">
              <p className="text-xs font-bold text-gray-900">Check-in</p>
              <p className="text-base font-bold text-gray-900">4.9</p>
              <Key size={20} className="text-gray-800 pt-1" />
            </div>

            <div className="space-y-1 pl-4">
              <p className="text-xs font-bold text-gray-900">Communication</p>
              <p className="text-base font-bold text-gray-900">4.8</p>
              <MessageSquare size={20} className="text-gray-800 pt-1" />
            </div>

            <div className="space-y-1 pl-4">
              <p className="text-xs font-bold text-gray-900">Location</p>
              <p className="text-base font-bold text-gray-900">4.5</p>
              <MapPin size={20} className="text-gray-800 pt-1" />
            </div>

            <div className="space-y-1 pl-4">
              <p className="text-xs font-bold text-gray-900">Value</p>
              <p className="text-base font-bold text-gray-900">4.8</p>
              <Tag size={20} className="text-gray-800 pt-1" />
            </div>

          </div>
        </div>

        {/* "Guests mention" Category Filter Pills Carousel (Image 4) */}
        <div className="py-6 border-b border-gray-200">
          <h4 className="text-xs font-bold text-gray-900 mb-3">Guests mention</h4>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {GUEST_MENTION_TAGS.map((tag) => {
              const TagIcon = tag.icon;
              const isSelected = selectedTag === tag.label;
              return (
                <button
                  key={tag.label}
                  onClick={() => setSelectedTag(isSelected ? null : tag.label)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-semibold shrink-0 transition ${
                    isSelected 
                      ? 'border-gray-900 bg-gray-900 text-white' 
                      : 'border-gray-200 bg-white hover:border-gray-400 text-gray-800'
                  }`}
                >
                  <TagIcon size={14} />
                  <span>{tag.label}</span>
                  <span className="text-[11px] text-gray-500 font-normal">{tag.count}</span>
                </button>
              );
            })}
            <button className="p-2 border border-gray-200 rounded-full hover:border-black shrink-0 text-gray-700">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Guest Reviews Grid (Image 4) */}
        <div className="py-10 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedReviews.map((rev) => (
              <div key={rev.id} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-sm shrink-0">
                    {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : 'G'}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">{rev.user?.name || 'Guest'}</h5>
                    <p className="text-[11px] text-gray-500 font-medium">5 years on Airbnb</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center text-gray-900">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className={i < Math.floor(rev.rating) ? 'fill-gray-900 text-gray-900' : 'text-gray-300'} />
                    ))}
                  </div>
                  <span className="text-gray-500">· 2 weeks ago</span>
                </div>

                <p className="text-xs text-gray-800 leading-relaxed font-normal">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* "Meet your host" Section (Image 5) */}
        <div className="py-12 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Meet your host</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            
            {/* Left White Host Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-md text-center space-y-4">
              <div className="relative w-24 h-24 mx-auto">
                <img
                  src={listing.host?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80'}
                  alt={hostName}
                  className="w-full h-full rounded-full object-cover shadow-sm border border-gray-200"
                />
                <div className="absolute bottom-0 right-0 bg-[#E81948] text-white p-1 rounded-full border-2 border-white shadow-xs">
                  <Check size={12} />
                </div>
              </div>

              <div>
                <h4 className="text-2xl font-extrabold text-gray-900">{hostName}</h4>
                <p className="text-xs text-gray-500 font-semibold">Host</p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100 text-center">
                <div>
                  <p className="text-sm font-bold text-gray-900">1929</p>
                  <p className="text-[10px] text-gray-500 font-medium">Reviews</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">4.75 ★</p>
                  <p className="text-[10px] text-gray-500 font-medium">Rating</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">5</p>
                  <p className="text-[10px] text-gray-500 font-medium">Years hosting</p>
                </div>
              </div>

              {/* Information bullet points */}
              <div className="space-y-2 text-left text-xs text-gray-800 pt-2">
                <p className="flex items-center gap-2.5"><UserIcon size={16} className="text-gray-700" /> Born in the 90s</p>
                <p className="flex items-center gap-2.5"><Briefcase size={16} className="text-gray-700" /> My work: Float & Ace Homes</p>
              </div>
            </div>

            {/* Right Host Details Column */}
            <div className="md:col-span-2 space-y-6 pt-2">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Co-Hosts</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-400 text-white font-bold flex items-center justify-center text-xs">S</div>
                    <span className="text-xs font-bold text-gray-900">Sahil</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">A</div>
                    <span className="text-xs font-bold text-gray-900">Anand</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Host details</h4>
                <p className="text-xs text-gray-700">Response rate: 72%</p>
                <p className="text-xs text-gray-700">Responds within a few hours</p>
              </div>

              <button className="bg-[#F7F7F7] hover:bg-gray-200 text-gray-900 font-bold text-xs py-3 px-6 rounded-xl transition border border-gray-300">
                Message host
              </button>

              <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-100 text-xs text-gray-700 flex items-start gap-3 mt-4">
                <Lock size={16} className="text-[#FF385C] shrink-0 mt-0.5" />
                <p>To help protect your payment, always use Airbnb to send money and communicate with hosts.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Map Location Section (Image 5) */}
        <div id="location" className="py-12 border-b border-gray-200 space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Where you'll be</h3>
          <p className="text-xs font-semibold text-gray-900">{listing.location || `${listing.city}, ${listing.country}`}</p>

          <div className="h-96 w-full rounded-3xl overflow-hidden border border-gray-200 relative shadow-xs">
            <MapView listings={[listing]} />
          </div>

          <p className="text-xs text-gray-500 font-medium pt-1">Exact location will be provided after booking.</p>
        </div>

        {/* Things to know */}
        <div className="py-12 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Things to know</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
            
            <div className="space-y-2">
              <p className="font-bold text-gray-900 flex items-center gap-2"><CalendarIcon size={16} /> Cancellation policy</p>
              <p className="text-gray-600 leading-relaxed">Free cancellation before 18 October. Cancel before check-in for a partial refund.</p>
              <button className="font-semibold text-gray-900 underline">Learn more</button>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-gray-900 flex items-center gap-2"><Key size={16} /> House rules</p>
              <p className="text-gray-600">Check-in after 12:00 pm</p>
              <p className="text-gray-600">Checkout before 10:00 am</p>
              <p className="text-gray-600">{listing.max_guests} guests maximum</p>
              <button className="font-semibold text-gray-900 underline">Learn more</button>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-gray-900 flex items-center gap-2"><ShieldCheck size={16} /> Safety & property</p>
              <p className="text-gray-600">Carbon monoxide alarm not reported</p>
              <p className="text-gray-600">Smoke alarm not reported</p>
              <p className="text-gray-600">Exterior security cameras on property</p>
              <button className="font-semibold text-gray-900 underline">Learn more</button>
            </div>

          </div>
        </div>

        {/* Regional Destinations Footer Grid */}
        <div className="py-12">
          <h4 className="text-sm font-bold text-gray-900 mb-4">Explore other options in and around {listing.city}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            {REGIONAL_DESTINATIONS.map((dest) => (
              <div key={dest.name}>
                <p className="font-bold text-gray-900 hover:underline cursor-pointer">{dest.name}</p>
                <p className="text-[11px] text-gray-500">{dest.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Amenities Modal */}
      {showAllAmenitiesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white max-w-lg w-full max-h-[85vh] rounded-3xl shadow-2xl p-6 overflow-y-auto space-y-6 border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">What this place offers</h3>
              <button onClick={() => setShowAllAmenitiesModal(false)} aria-label="Close amenities modal"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              {listing.amenities?.map((amenity) => (
                <div key={amenity} className="flex items-center gap-3 text-xs text-gray-900 py-2 border-b border-gray-100">
                  <Check size={16} className="text-[#FF385C]" />
                  <span className="font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/55 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white max-w-2xl w-full max-h-[92vh] rounded-3xl shadow-2xl overflow-y-auto border border-gray-100">
            <div className="sticky top-0 z-10 bg-white flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-7">
              <button onClick={() => setIsCheckoutModalOpen(false)} aria-label="Close checkout summary" className="p-2 -ml-2 rounded-full hover:bg-gray-100"><X size={18} /></button>
              <h3 className="text-base font-bold text-gray-900">Confirm and pay</h3>
              <span className="w-9" />
            </div>
            <div className="grid md:grid-cols-[1.1fr_.9fr]">
              <div className="p-5 sm:p-7 space-y-5">
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 p-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Lock size={16}/></span>
                  <div><p className="text-sm font-bold">Demo checkout</p><p className="mt-0.5 text-xs text-gray-500">Secure preview · no real charge</p></div>
                </div>
                <section className="space-y-3">
                  <h4 className="text-lg font-bold">Payment details</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setPaymentMethod('card')} className={`rounded-xl border p-3 text-sm font-semibold ${paymentMethod === 'card' ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}>▣ Credit or debit card</button>
                    <button type="button" onClick={() => setPaymentMethod('upi')} className={`rounded-xl border p-3 text-sm font-semibold ${paymentMethod === 'upi' ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}>◉ UPI</button>
                  </div>
                  {paymentMethod === 'card' ? <div className="space-y-3">
                    <input aria-label="Cardholder name" placeholder="Name on card" autoComplete="cc-name" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
                    <input aria-label="Card number" placeholder="1234  5678  9012  3456" inputMode="numeric" autoComplete="cc-number" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />
                    <div className="grid grid-cols-2 gap-3"><input aria-label="Expiry date" placeholder="MM / YY" autoComplete="cc-exp" className="min-w-0 rounded-xl border border-gray-300 px-4 py-3 text-sm" /><input aria-label="Security code" placeholder="CVV" inputMode="numeric" autoComplete="cc-csc" className="min-w-0 rounded-xl border border-gray-300 px-4 py-3 text-sm" /></div>
                  </div> : <input aria-label="UPI ID" placeholder="yourname@bank" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm" />}
                  <div className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">This is a demo payment. No payment is processed.</div>
                </section>
              </div>
              <div className="bg-gray-50 p-5 sm:p-7 md:border-l md:border-gray-200">
                <div className="space-y-4 text-xs">
                  <div className="flex gap-4 items-center bg-white p-3 rounded-2xl border border-gray-200">
                    <img src={getListingImageUrl(photos[0], 400)} onError={useImageFallback} alt={listing.title} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{listing.title}</p>
                      <p className="text-gray-500">{listing.property_type} · {listing.city}</p>
                    </div>
                  </div>

                  <div className="space-y-2 border-b border-gray-200 pb-4">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Dates:</span>
                      <span className="font-bold text-gray-900">{checkIn} to {checkOut} ({nights} nights)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Guests:</span>
                      <span className="font-bold text-gray-900">{guests} guest(s)</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between"><span>Nightly total</span><span>₹{nightlySubtotal.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span>Cleaning fee</span><span>₹{cleaningFee.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span>Service fee</span><span>₹{serviceFee.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-200">
                      <span>Total Due</span><span>₹{totalDue.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmPayment}
                    disabled={isSubmittingBooking}
                    className="w-full bg-[#E81948] hover:bg-[#D90B60] text-white font-bold py-3.5 rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-xs"
                  >
                    {isSubmittingBooking ? 'Confirming demo payment…' : `Confirm demo payment · ₹${totalDue.toLocaleString('en-IN')}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-6 space-y-4 border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Leave a Review</h3>
              <button onClick={() => setIsReviewModalOpen(false)} aria-label="Close review form"><X size={18} /></button>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setNewRating(star)} className="p-1 text-amber-500 hover:scale-110 transition">
                    <Star size={24} className={star <= newRating ? 'fill-amber-500' : 'text-gray-300'} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <textarea
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="How was your stay?"
                className="w-full border border-gray-300 rounded-xl p-3 text-xs focus:outline-none focus:border-black"
              />
            </div>

            <button onClick={handleAddReview} className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition text-xs">
              Post Review
            </button>
          </div>
        </div>
      )}

      {/* Full Photo Lightbox */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black text-white p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between sticky top-0 bg-black/80 py-4 backdrop-blur-md z-10">
              <span className="font-bold text-sm">{listing.title} Gallery</span>
              <button onClick={() => setIsPhotoModalOpen(false)} aria-label="Close photo gallery" className="p-2 bg-white/20 rounded-full hover:bg-white/40"><X size={20} /></button>
            </div>
            <div className="space-y-6">
              {photos.map((src, i) => (
                <img key={i} src={getListingImageUrl(src, 1400)} onError={useImageFallback} alt={`Photo ${i + 1}`} className="w-full rounded-2xl object-cover max-h-[80vh] mx-auto shadow-2xl" />
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
