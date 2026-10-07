# Airbnb-style Stays Marketplace

A responsive Airbnb-inspired stays marketplace built for the Airbnb Web App SDE assignment. It uses Next.js 14 with TypeScript and Tailwind CSS, a FastAPI backend, SQLAlchemy, and SQLite. It includes hashed-password accounts, seeded demo accounts, and a local demo payment flow.
<img width="1917" height="910" alt="image" src="https://github.com/user-attachments/assets/8eaa5cb7-0f1e-4635-b316-b9463e4368f8" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/7ed3fe8b-2415-4470-98a3-04bf9c4c7bef" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/49cfb784-18ba-4c7e-b057-8f211e2c36ae" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/acfa391b-2ed1-429e-8280-53432393498d" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/7890d441-fab6-4330-b646-1f34ebca3381" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/27f2bdb3-66c2-4d36-a54c-1c4df0e7c760" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3dabf090-3447-41aa-ba85-cc159ebe983b" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/cf50ab0a-91fa-487f-b220-7bb9ed3b637d" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/17d7b70d-bbb3-431e-9b08-7a3bcde545f3" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/5f063e12-8646-451a-a335-f8a84b46e9ae" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ff646c68-7456-4aeb-9091-456204ade479" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/82fedf45-afe8-43e7-98e4-f9c70b4b027d" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2093e0d7-2393-4711-9e55-2dc92db6feab" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/d1087ae0-1a72-4ef2-bab8-81128137eb85" />


## Run locally

### Backend

From the repository root, create and install a virtual environment, seed an empty demo database, and start the API:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload
```

No payment credentials or external payment account are required. Checkout is simulated locally and records the confirmed booking in SQLite:

```text
POST /api/payments/demo-checkout
```

The checkout form is a visual demo: no charge is made, and card/UPI details are never sent to or saved by the backend. Only the selected payment method and booking totals/status are stored.

The API is available at `http://127.0.0.1:8000`; interactive API docs are at `http://127.0.0.1:8000/docs`. SQLite always uses `backend/airbnb.db`, regardless of command working directory. The seed script inserts demo data only when the database is empty and refuses to replace existing records. To intentionally reset demo data, set `$env:AIRBNB_RESET_DATABASE='1'` before running `python -m app.seed`; this replaces current database content.

Seeded test accounts (startup adds them if absent and only sets a password when one is missing):

| Role | Email | Password |
|---|---|---|
| Guest | `ashi@example.com` | `Guest1234!` |
| Host | `aarav.host@example.com` | `Host1234!` |

New accounts can register as guests or hosts. The profile menu only shows the signed-in account; there is no persona switcher or automatic login. Guests can enable host tools from `/host`.

### Frontend

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. By default, the frontend calls `http://127.0.0.1:8000/api`. To use a different API host, create `frontend/.env.local` with:

```text
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

## Deploy to Vercel

Vercel deploys the Next.js frontend; the FastAPI backend must also be deployed to a Python-capable host. If only the frontend is deployed, features that call the API (accounts, listings, bookings, and wishlists) will not work.

1. In Vercel, set the project Root Directory to `frontend`, keep the build command as `npm run build`, and set the Output Directory to the default.
2. Deploy the FastAPI app separately from the `backend` directory with the start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
3. Set `NEXT_PUBLIC_API_URL` in Vercel to the public backend URL ending in `/api`, for example `https://your-api.example.com/api`. Set it for each Vercel environment you use, then redeploy.
4. Set `FRONTEND_ORIGINS` on the backend host to the exact frontend origin, for example `https://your-project.vercel.app`. For multiple origins, separate them with commas. Include your production custom domain and any Vercel preview domains you need.
5. Ensure the backend host uses persistent storage for the SQLite database. The default database file is local to the backend deployment and can be lost on hosts with ephemeral filesystems.

The `npm warn deprecated` messages during installation concern transitive packages and are warnings, not build failures. The `unrs-resolver` install-script notice is also separate from the API configuration; check the Vercel Build Logs for the actual `Build Completed` or error status if deployment still fails.

## Main flows

- Browse image-led stay cards, filter by destination, dates, guests, price, property type, bedrooms, beds, and amenities, and paginate the result list.
- Open a listing for its photo gallery, amenities, reviews, host details, date selection, availability checks, and a fee breakdown.
- Confirm a simulated card or UPI payment. The API recalculates the total, checks date availability, then stores a confirmed booking with `payment_status=paid` and `payment_provider=demo` in SQLite. Cancelled checkout creates no booking.
- Create an account or log in at `/register` and `/login`. Passwords are salted and hashed before storage. Test accounts are listed above; account details and role are stored in SQLite.
- Use responsive Homes, Experiences, and Services navigation; Experiences and Services contain curated demo landing pages, while home search, listing details, maps, and host tools use the assignment API.
- Save and remove listings from a per-user wishlist.
- Hosts can create, edit, and delete their own listings and inspect confirmed reservations. A listing with reservation history cannot be deleted, preserving those records.

## Architecture and data model

The Next.js app-router pages and reusable React components live under `frontend/src`. `frontend/src/services/api.ts` owns HTTP requests and adapts API payloads into UI types. The FastAPI app registers feature routers under `/api`; SQLAlchemy models and Pydantic schemas are separated into `backend/app/models` and `backend/app/schemas`.

SQLite tables: `users`, `listings`, `listing_images`, `amenities`, `listing_amenities`, `bookings`, `reviews`, and `wishlists`. Startup applies additive password/payment columns and indexes without clearing user data. Foreign keys are enabled; wishlist user/listing pairs are unique. Demo-paid bookings store `payment_status=paid`, `payment_provider=demo`, and the selected method; older seeded reservations remain marked as legacy demo records.

## API overview

- `GET /api/listings/` and `GET /api/listings/{id}`: search and listing details.
- `POST /api/listings/?host_id=...`, `PUT /api/listings/{id}?host_id=...`, `DELETE /api/listings/{id}?host_id=...`: host listing CRUD.
- `GET /api/amenities/`, `GET /api/users/{id}`, `GET /api/hosts/{id}/listings`, `GET /api/hosts/{id}/bookings`.
- `GET /api/bookings/my-trips/{user_id}`, `GET /api/bookings/availability/{listing_id}`, `DELETE /api/bookings/{id}`. `POST /api/bookings/` is disabled so unverified requests cannot create confirmed reservations.
- `GET /api/wishlist/{user_id}`, `POST /api/wishlist/toggle/{user_id}/{listing_id}`, `POST /api/wishlist/`, `DELETE /api/wishlist/{user_id}/{listing_id}`.
- `GET /api/reviews/listing/{listing_id}`, `POST /api/reviews/`.
- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/become-host/{user_id}`.
- `POST /api/payments/demo-checkout`, `GET /api/payments/demo-booking/{booking_id}`.

## Assumptions

- This assignment's profile/ID-based APIs are a local demo and are not a production authentication system. Do not use real personal information or deploy with demo credentials.
- The demo checkout does not process money. Listing and experience photos use image URLs; broken listing images fall back to a sample stay photo.
- Search, booking, reviews, and account IDs are backed by the local database; map tiles and user-provided image URLs require internet access.
