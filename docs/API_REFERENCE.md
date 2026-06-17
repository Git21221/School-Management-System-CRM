# API Reference — Postman & Front-end

**Base URL:** `http://localhost:5000/api`  
**Auth:** `Authorization: Bearer <accessToken>` on protected routes  
**Refresh:** HttpOnly cookie `refreshToken` (set on login; use `credentials: 'include'` in fetch)

---

## Quick start (Postman)

1. Import **`backend/postman/School-CRM-API.postman_collection.json`**
2. Import **`backend/postman/School-CRM-Local.postman_environment.json`**
3. Set environment variables:
   - `adminEmail` — your admin email (e.g. `admin@triton.local`)
   - `adminPassword` — your admin password
4. Run **Auth → Login** (saves `accessToken` automatically)
5. Call any other request in the collection

> Enable **cookies** in Postman for **Auth → Refresh Token** to work.

---

## Response format

### Success

```json
{
  "success": true,
  "data": { }
}
```

List endpoints may include pagination:

```json
{
  "success": true,
  "data": { "students": [], "pagination": { "page": 1, "limit": 10, "total": 50 } }
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [{ "field": "email", "message": "Required" }]
  }
}
```

---

## Auth flow (front-end)

```typescript
// 1. Login
POST /api/auth/login
Body: { "email": "...", "password": "..." }
Response: { data: { accessToken, user } }
Cookie: refreshToken (HttpOnly)

// 2. Authenticated requests
GET /api/students
Headers: Authorization: Bearer <accessToken>

// 3. On 401 — refresh
POST /api/auth/refresh
credentials: 'include'  // sends cookie
Response: { data: { accessToken } }

// 4. Logout
POST /api/auth/logout
```

---

## Full endpoint list

| # | Method | Endpoint | Roles | Description |
|---|--------|----------|-------|-------------|
| | **Health** | | | |
| 1 | GET | `/health` | public | Server + DB status |
| | **Auth** | | | |
| 2 | POST | `/auth/login` | public | Login |
| 3 | POST | `/auth/refresh` | cookie | New access token |
| 4 | POST | `/auth/logout` | any | End session |
| 5 | GET | `/auth/me` | any | Current user |
| 6 | PATCH | `/auth/password` | any | Change password |
| | **Dashboard** | | | |
| 7 | GET | `/dashboard/stats` | any | KPI counts |
| 8 | GET | `/dashboard/enrollment-trend` | any | Chart data |
| 9 | GET | `/dashboard/fee-trend` | any | Chart data |
| 10 | GET | `/dashboard/today-classes` | any | Today's schedule |
| | **Courses** | | | |
| 11 | GET | `/courses` | admin, staff | List all |
| 12 | GET | `/courses/:id` | admin, staff | Detail + stats |
| 13 | POST | `/courses` | admin | Create |
| 14 | PATCH | `/courses/:id` | admin | Update |
| 15 | DELETE | `/courses/:id` | admin | Delete |
| | **Batches** | | | |
| 16 | GET | `/batches` | admin, staff | List |
| 17 | GET | `/batches/:id` | admin, staff | Detail |
| 18 | GET | `/batches/:id/students` | admin, staff | Roster |
| 19 | POST | `/batches` | admin | Create |
| 20 | PATCH | `/batches/:id` | admin | Update |
| 21 | DELETE | `/batches/:id` | admin | Delete |
| | **Students** | | | |
| 22 | GET | `/students` | admin, staff | List (query below) |
| 23 | GET | `/students/:id` | admin, staff | Profile |
| 24 | POST | `/students` | admin, staff | Admit |
| 25 | PATCH | `/students/:id` | admin, staff | Update |
| 26 | DELETE | `/students/:id` | admin | Soft delete |
| 27 | POST | `/students/:id/photo` | admin, staff | Multipart `photo` |
| | **Attendance** | | | |
| 28 | GET | `/attendance` | admin, staff, faculty | `?batchId=&date=` |
| 29 | PUT | `/attendance` | admin, staff, faculty | Bulk save |
| 30 | GET | `/attendance/report` | admin, staff | `?batchId=&month=&year=` |
| | **Fees** | | | |
| 31 | GET | `/fees/due` | admin, staff | Due list |
| 32 | GET | `/payments` | admin, staff | History |
| 33 | GET | `/payments/:receipt` | admin, staff | Receipt detail |
| 34 | POST | `/payments` | admin, staff | Collect fee |
| 35 | POST | `/fees/reminders` | admin, staff | Send reminders |
| | **Faculty** | | | |
| 36 | GET | `/faculty` | admin | List |
| 37 | GET | `/faculty/:id` | admin | Profile |
| 38 | POST | `/faculty` | admin | Create |
| 39 | PATCH | `/faculty/:id` | admin | Update |
| 40 | DELETE | `/faculty/:id` | admin | Delete |
| 41 | POST | `/faculty/:id/attendance` | admin | Mark attendance |
| 42 | GET | `/faculty/:id/salary` | admin | Salary slip |
| | **Exams** | | | |
| 43 | GET | `/exams` | admin, faculty | List |
| 44 | GET | `/exams/:id` | admin, faculty | Detail |
| 45 | POST | `/exams` | admin, faculty | Create |
| 46 | PATCH | `/exams/:id` | admin, faculty | Update |
| 47 | DELETE | `/exams/:id` | admin | Delete |
| 48 | GET | `/exams/:id/marks` | admin, faculty | Get marks |
| 49 | PUT | `/exams/:id/marks` | admin, faculty | Save marks |
| 50 | GET | `/exams/:id/results` | admin, faculty, staff | Results |
| | **Certificates** | | | |
| 51 | GET | `/certificates` | admin | List |
| 52 | POST | `/certificates` | admin | Issue |
| 53 | GET | `/certificates/:certNo` | admin | Detail |
| | **Reports** | | | |
| 54 | GET | `/reports/students` | admin, staff | Student report |
| 55 | GET | `/reports/admissions` | admin, staff | Admissions |
| 56 | GET | `/reports/fees` | admin, staff | Fee collection |
| 57 | GET | `/reports/fees/due` | admin, staff | Due fees |
| 58 | GET | `/reports/attendance` | admin, staff | Attendance |
| 59 | GET | `/reports/faculty` | admin, staff | Faculty |
| 60 | GET | `/reports/:type/export` | admin, staff | CSV (`students`, `fees`, etc.) |
| | **Notifications** | | | |
| 61 | GET | `/notifications` | any | Inbox |
| 62 | PATCH | `/notifications/:id/read` | any | Mark one read |
| 63 | PATCH | `/notifications/read-all` | any | Mark all read |
| 64 | DELETE | `/notifications/:id` | any | Delete |
| | **Settings** | | | |
| 65 | GET | `/settings/institute` | admin | Institute profile |
| 66 | PATCH | `/settings/institute` | admin | Update (+ optional logo multipart) |
| 67 | GET | `/settings/receipt` | admin | Receipt template |
| 68 | PATCH | `/settings/receipt` | admin | Update receipt |
| 69 | GET | `/settings/certificate` | admin | Certificate template |
| 70 | PATCH | `/settings/certificate` | admin | Update certificate |

**Total: 70 endpoints**

---

## Request body examples

### Login
```json
POST /api/auth/login
{
  "email": "admin@triton.local",
  "password": "your-password"
}
```

### Create course
```json
POST /api/courses
{
  "id": "CRS-010",
  "name": "Python Basics",
  "duration": "3 Months",
  "fees": 15000,
  "description": "Optional",
  "status": "Active"
}
```

### Create student
```json
POST /api/students
{
  "id": "STU-099",
  "name": "Student Name",
  "courseId": "CRS-001",
  "batchId": "BAT-001",
  "admissionDate": "2025-01-15",
  "feesTotal": 25000,
  "feesPaid": 0,
  "status": "Active"
}
```

### Save attendance
```json
PUT /api/attendance
{
  "batchId": "BAT-001",
  "date": "2025-01-15",
  "records": [
    { "studentId": "STU-001", "status": "present" },
    { "studentId": "STU-002", "status": "absent" }
  ]
}
```

### Collect payment
```json
POST /api/payments
{
  "studentId": "STU-001",
  "amount": 5000,
  "mode": "UPI",
  "payDate": "2025-01-15",
  "remarks": "Installment 1"
}
```

### Issue certificate
```json
POST /api/certificates
{
  "studentId": "STU-007",
  "courseId": "CRS-003",
  "grade": "A",
  "issueDate": "2025-01-15",
  "authorisedBy": "Director"
}
```

---

## Query parameters

| Endpoint | Params |
|----------|--------|
| `GET /students` | `search`, `course`, `status`, `page`, `limit` |
| `GET /attendance` | `batchId` (required), `date` (required, `YYYY-MM-DD`) |
| `GET /attendance/report` | `batchId`, `month`, `year` |

---

## Front-end service mapping

Suggested files under `src/api/services/`:

| Service file | Endpoints |
|--------------|-----------|
| `auth.service.ts` | `/auth/*` |
| `dashboard.service.ts` | `/dashboard/*` |
| `courses.service.ts` | `/courses/*` |
| `batches.service.ts` | `/batches/*` |
| `students.service.ts` | `/students/*` |
| `attendance.service.ts` | `/attendance/*` |
| `fees.service.ts` | `/fees/*`, `/payments/*` |
| `faculty.service.ts` | `/faculty/*` |
| `exams.service.ts` | `/exams/*` |
| `certificates.service.ts` | `/certificates/*` |
| `reports.service.ts` | `/reports/*` |
| `notifications.service.ts` | `/notifications/*` |
| `settings.service.ts` | `/settings/*` |

Example (`src/api/client.ts` already exists):

```typescript
import { apiRequest } from './client';

export const coursesService = {
  list: () => apiRequest('/courses'),
  get: (id: string) => apiRequest(`/courses/${id}`),
  create: (body: unknown) =>
    apiRequest('/courses', { method: 'POST', body: JSON.stringify(body) }),
};
```

---

## HTTP status codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 400 | Validation error |
| 401 | Not logged in / bad token |
| 403 | Wrong role |
| 404 | Not found |
| 409 | Conflict |
| 500 | Server error |

---

## Files

| File | Purpose |
|------|---------|
| `backend/postman/School-CRM-API.postman_collection.json` | Import into Postman |
| `backend/postman/School-CRM-Local.postman_environment.json` | Local env variables |
| `docs/API.md` | Short contract summary |
| `docs/API_REFERENCE.md` | This file |
