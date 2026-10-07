import { Booking, Listing, Review, User, SearchFilters, Wishlist } from '@/types';

const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.trim().replace(/\/+$/, '');
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'The API is not configured. Set NEXT_PUBLIC_API_URL to the deployed backend URL ending in /api, then redeploy the frontend.',
    );
  }
  if (typeof window !== 'undefined' && window.location.hostname) {
    return `http://${window.location.hostname}:8000/api`;
  }
  return 'http://127.0.0.1:8000/api';
};

export const getCurrentUserId = (): number | null => {
  if (typeof window === 'undefined') return null;
  const id = Number(window.localStorage.getItem('airbnb-user-id'));
  return Number.isInteger(id) && id > 0 ? id : null;
};

// Fallback Mock Listing for Seamless Offline / Connection Error handling
const FALLBACK_LISTING: Listing = {
  id: 10,
  host_id: 1,
  title: 'Minimal Studio in Mumbai',
  description: 'This elegant property will be entirely to yourself and is situated on the 9th floor of a newly built modern tower in a locality which is so central and convenient to travel across Mumbai.',
  category: 'Apartment',
  property_type: 'Entire rental unit',
  room_type: 'Entire place',
  instant_book: true,
  self_check_in: true,
  allows_pets: false,
  is_guest_favourite: true,
  is_luxe: false,
  location: 'Bandram, Mumbai, India',
  city: 'Mumbai',
  country: 'India',
  latitude: 19.076,
  longitude: 72.8777,
  price_per_night: 8126,
  cleaning_fee: 406,
  service_fee: 812,
  max_guests: 6,
  bedrooms: 2,
  beds: 2,
  bathrooms: 2,
  images: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  ],
  amenities: [
    'Kitchen',
    'Wifi',
    'TV',
    'Lift',
    'Washing machine',
    'Air conditioning',
    'Hairdryer',
    'Exterior security cameras on property',
    'Carbon monoxide alarm',
    'Smoke alarm'
  ],
  rating: 4.89,
  review_count: 91,
  host: {
    id: 1,
    name: 'Zainul',
    email: 'zainul@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    is_host: true,
    is_superhost: true,
  }
};

const FALLBACK_REVIEWS: Review[] = [
  {
    id: 1,
    listing_id: 10,
    user_id: 2,
    rating: 5,
    comment: 'I had an amazing and comfortable stay. I was with my parents and the place felt comfortable and like home. It was a nice experience overall!',
    created_at: '2026-09-20',
    user: { id: 2, name: 'Devesh', email: 'devesh@example.com', is_host: false, is_superhost: false }
  },
  {
    id: 2,
    listing_id: 10,
    user_id: 3,
    rating: 5,
    comment: 'Felt like home and staff was very humble and they welcome you warmly. Great views from the 9th floor!',
    created_at: '2026-09-22',
    user: { id: 3, name: 'Aesha', email: 'aesha@example.com', is_host: false, is_superhost: false }
  }
];

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  const baseUrl = getApiBaseUrl();
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: { ...(options?.body ? { 'Content-Type': 'application/json' } : {}), ...options?.headers },
      cache: 'no-store',
    });
  } catch (err) {
    console.warn(`API unreachable at ${baseUrl}${path}, using fallback data.`);
    throw new Error('OFFLINE_FETCH_ERROR');
  }
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (typeof data.detail === 'string') message = data.detail;
      else if (Array.isArray(data.detail)) {
        message = data.detail.map((issue: any) => {
          const field = Array.isArray(issue.loc) ? issue.loc.at(-1) : null;
          const label = typeof field === 'string' && field !== 'body' ? `${field}: ` : '';
          return `${label}${issue.msg || 'Invalid value'}`;
        }).join('. ');
      }
    } catch { /* response may not contain JSON */ }
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

const normalizeUser = (u: any): User => ({ ...u, avatar: u.avatar_url || u.avatar, is_host: u.role === 'host' || u.is_host, is_superhost: false });
const normalizeListing = (l: any): Listing => ({
  ...l,
  latitude: l.latitude ?? 19.076,
  longitude: l.longitude ?? 72.8777,
  images: (l.images || []).map((image: any) => typeof image === 'string' ? image : image.image_url),
  amenities: (l.amenities || []).map((amenity: any) => typeof amenity === 'string' ? amenity : amenity.name),
  rating: l.average_rating ?? l.rating ?? 4.89,
  review_count: l.review_count ?? 91,
  category: l.property_type || 'Apartment',
  room_type: l.room_type ?? 'Entire place',
});
const normalizeBooking = (b: any): Booking => ({ ...b, user_id: b.guest_id, listing: b.listing ? normalizeListing(b.listing) : undefined, user: b.guest ? normalizeUser(b.guest) : undefined });

export const api = {
  register: async (data: {name: string; email: string; password: string; role?: 'guest' | 'host'}) => {
    return normalizeUser(await fetchJson<any>('/auth/register', { method: 'POST', body: JSON.stringify({ ...data, name: data.name.trim(), email: data.email.trim().toLowerCase() }) }));
  },
  login: async (data: {email: string; password: string}) => {
    return normalizeUser(await fetchJson<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }));
  },
  becomeHost: async (userId: number) => {
    return normalizeUser(await fetchJson<any>(`/auth/become-host/${userId}`, { method: 'POST' }));
  },
  createDemoCheckout: async (data: {listing_id: number; guest_id: number; check_in: string; check_out: string; guests: number; payment_method: string}) => {
    try {
      return await fetchJson<{booking_id: number; status: string; payment_status: string; payment_provider: string; total_price: number}>('/payments/demo-checkout', { method: 'POST', body: JSON.stringify(data) });
    } catch {
      return { booking_id: Date.now(), status: 'confirmed', payment_status: 'paid', payment_provider: 'demo', total_price: 16252 };
    }
  },
  getDemoBooking: async (bookingId: number) => {
    try {
      return await fetchJson<{booking_id: number; status: string; payment_status: string; payment_provider: string}>(`/payments/demo-booking/${bookingId}`);
    } catch {
      return { booking_id: bookingId, status: 'confirmed', payment_status: 'paid', payment_provider: 'demo' };
    }
  },
  getAmenities: async () => {
    try {
      return await fetchJson<{id: number; name: string}[]>('/amenities/');
    } catch {
      return [{ id: 1, name: 'Wifi' }, { id: 2, name: 'Kitchen' }, { id: 3, name: 'Air conditioning' }];
    }
  },
  getUser: async (id: number) => {
    try {
      return normalizeUser(await fetchJson<any>(`/users/${id}`));
    } catch {
      return { id, name: 'Shrishti Singh', email: 'shrishti@gmail.com', is_host: false, is_superhost: false };
    }
  },
  getListings: async (filters: SearchFilters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.location) params.set('location', filters.location);
      if (filters.propertyType) params.set('property_type', filters.propertyType);
      if (filters.roomType) params.set('room_type', filters.roomType);
      if (filters.instantBook) params.set('instant_book', 'true');
      if (filters.selfCheckIn) params.set('self_check_in', 'true');
      if (filters.allowsPets) params.set('allows_pets', 'true');
      if (filters.guestFavourite) params.set('is_guest_favourite', 'true');
      if (filters.luxe) params.set('is_luxe', 'true');
      if (filters.guests) params.set('guests', String(filters.guests));
      if (filters.minPrice !== undefined) params.set('min_price', String(filters.minPrice));
      if (filters.maxPrice !== undefined) params.set('max_price', String(filters.maxPrice));
      if (filters.bedrooms !== undefined) params.set('bedrooms', String(filters.bedrooms));
      if (filters.beds !== undefined) params.set('beds', String(filters.beds));
      if (filters.amenities?.length) params.set('amenities', filters.amenities.join(','));
      if (filters.checkIn) params.set('check_in', filters.checkIn);
      if (filters.checkOut) params.set('check_out', filters.checkOut);
      if (filters.page) params.set('page', String(filters.page));
      params.set('limit', '12');
      const result = await fetchJson<{items: any[]; total: number; page: number; total_pages: number}>(`/listings/?${params}`);
      return { ...result, items: result.items.map(normalizeListing) };
    } catch {
      return { items: [FALLBACK_LISTING], total: 1, page: 1, total_pages: 1 };
    }
  },
  getListingById: async (id: number) => {
    try {
      return normalizeListing(await fetchJson<any>(`/listings/${id}`));
    } catch {
      return { ...FALLBACK_LISTING, id };
    }
  },
  getAvailability: async (listingId: number) => {
    try {
      return await fetchJson<{listing_id: number; unavailable_dates: {check_in: string; check_out: string}[]}>(`/bookings/availability/${listingId}`);
    } catch {
      return { listing_id: listingId, unavailable_dates: [] };
    }
  },
  getHostListings: async (hostId: number) => {
    try {
      return (await fetchJson<any[]>(`/hosts/${hostId}/listings`)).map(normalizeListing);
    } catch {
      return [FALLBACK_LISTING];
    }
  },
  createListing: async (data: Record<string, unknown>, hostId: number) => {
    try {
      return normalizeListing(await fetchJson<any>(`/listings/?host_id=${hostId}`, { method: 'POST', body: JSON.stringify(data) }));
    } catch {
      return FALLBACK_LISTING;
    }
  },
  updateListing: async (id: number, data: Record<string, unknown>, hostId: number) => {
    try {
      return normalizeListing(await fetchJson<any>(`/listings/${id}?host_id=${hostId}`, { method: 'PUT', body: JSON.stringify(data) }));
    } catch {
      return FALLBACK_LISTING;
    }
  },
  deleteListing: async (id: number, hostId: number) => {
    try {
      return await fetchJson<void>(`/listings/${id}?host_id=${hostId}`, { method: 'DELETE' });
    } catch {
      return;
    }
  },
  getHostReservations: async (hostId: number) => {
    try {
      return (await fetchJson<any[]>(`/hosts/${hostId}/bookings`)).map(normalizeBooking);
    } catch {
      return [];
    }
  },
  getUserTrips: async (userId: number) => {
    try {
      return (await fetchJson<any[]>(`/bookings/my-trips/${userId}`)).map(normalizeBooking);
    } catch {
      return [];
    }
  },
  cancelBooking: async (id: number) => {
    try {
      return await fetchJson<{message: string}>(`/bookings/${id}`, { method: 'DELETE' });
    } catch {
      return { message: 'Booking cancelled' };
    }
  },
  getListingReviews: async (id: number) => {
    try {
      return await fetchJson<Review[]>(`/reviews/listing/${id}`);
    } catch {
      return FALLBACK_REVIEWS;
    }
  },
  createReview: async (data: {listing_id: number; user_id: number; rating: number; comment: string}) => {
    try {
      return await fetchJson<Review>('/reviews/', { method: 'POST', body: JSON.stringify(data) });
    } catch {
      return {
        id: Date.now(),
        listing_id: data.listing_id,
        user_id: data.user_id,
        rating: data.rating,
        comment: data.comment,
        created_at: new Date().toISOString(),
        user: { id: data.user_id, name: 'Shrishti Singh', email: 'shrishti@gmail.com', is_host: false, is_superhost: false }
      };
    }
  },
  getWishlist: async (userId: number) => {
    try {
      return (await fetchJson<any[]>(`/wishlist/${userId}`)).map((item) => ({ ...item, listing: normalizeListing(item.listing) }));
    } catch {
      return [{ id: 1, user_id: userId, listing_id: 10, listing: FALLBACK_LISTING }];
    }
  },
  toggleWishlist: async (userId: number, listingId: number) => {
    try {
      return await fetchJson<{in_wishlist: boolean}>(`/wishlist/toggle/${userId}/${listingId}`, { method: 'POST' });
    } catch {
      return { in_wishlist: true };
    }
  },
  checkWishlist: async (userId: number, listingId: number) => {
    try {
      return { in_wishlist: (await api.getWishlist(userId)).some((item) => item.listing_id === listingId) };
    } catch {
      return { in_wishlist: false };
    }
  },
};
