# CMS Backend API

A complete Content Management System backend built with Node.js, Express.js, MongoDB, and Cloudinary.

---

## Folder Structure

```
backend/
├── config/
│   ├── db.js                  # MongoDB connection
│   └── cloudinary.js          # Cloudinary configuration
├── controllers/
│   ├── settings.controller.js
│   ├── seo.controller.js
│   ├── page.controller.js
│   ├── service.controller.js
│   ├── industry.controller.js
│   ├── blog.controller.js
│   ├── project.controller.js
│   ├── caseStudy.controller.js
│   ├── team.controller.js
│   ├── testimonial.controller.js
│   ├── career.controller.js
│   ├── jobApplication.controller.js
│   ├── contact.controller.js
│   ├── proposal.controller.js
│   ├── newsletter.controller.js
│   ├── faq.controller.js
│   ├── client.controller.js
│   ├── award.controller.js
│   ├── technology.controller.js
│   ├── counter.controller.js
│   └── media.controller.js
├── models/
│   ├── Settings.js
│   ├── Seo.js
│   ├── Page.js
│   ├── Service.js
│   ├── Industry.js
│   ├── Blog.js
│   ├── Project.js
│   ├── CaseStudy.js
│   ├── Team.js
│   ├── Testimonial.js
│   ├── Career.js
│   ├── JobApplication.js
│   ├── Contact.js
│   ├── Proposal.js
│   ├── Newsletter.js
│   ├── Faq.js
│   ├── Client.js
│   ├── Award.js
│   ├── Technology.js
│   ├── Counter.js
│   └── Media.js
├── routes/
│   ├── settings.routes.js
│   ├── seo.routes.js
│   ├── page.routes.js
│   ├── service.routes.js
│   ├── industry.routes.js
│   ├── blog.routes.js
│   ├── project.routes.js
│   ├── caseStudy.routes.js
│   ├── team.routes.js
│   ├── testimonial.routes.js
│   ├── career.routes.js
│   ├── jobApplication.routes.js
│   ├── contact.routes.js
│   ├── proposal.routes.js
│   ├── newsletter.routes.js
│   ├── faq.routes.js
│   ├── client.routes.js
│   ├── award.routes.js
│   ├── technology.routes.js
│   ├── counter.routes.js
│   └── media.routes.js
├── middlewares/
│   ├── upload.js              # Multer for images
│   └── uploadAny.js           # Multer for images + documents
├── utils/
│   ├── cloudinaryHelper.js    # Upload/delete helpers
│   ├── slugHelper.js          # Unique slug generation
│   └── sendResponse.js        # Consistent JSON responses
├── uploads/                   # Temp files (auto-created)
├── app.js                     # Express app setup
├── server.js                  # Entry point
├── package.json
├── .env.example
├── api.http                   # REST Client test file
└── README.md
```

---

## Installation

```bash
cd backend
npm install
```

---

## Environment Setup

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cms_db
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## MongoDB Setup

1. Install MongoDB locally or use [MongoDB Atlas](https://www.mongodb.com/atlas).
2. For local: start the MongoDB service (`mongod`).
3. For Atlas: get your connection string and paste into `MONGO_URI`.

Example Atlas URI:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cms_db?retryWrites=true&w=majority
```

---

## Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com).
2. Go to Dashboard → copy Cloud Name, API Key, API Secret.
3. Paste into your `.env` file.

---

## Run the Project

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server starts at: `http://localhost:5000`

---

## API Routes

All routes are prefixed with `/api`.

### Settings
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/settings | Get website settings |
| PUT | /api/settings | Update settings (supports logo, favicon upload) |

### SEO Settings
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/seo | Get global SEO settings |
| PUT | /api/seo | Update SEO settings |

### Pages
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/pages | Get all pages (search, pagination, sort) |
| GET | /api/pages/:id | Get page by ID |
| GET | /api/pages/slug/:slug | Get page by slug |
| POST | /api/pages | Create page |
| PUT | /api/pages/:id | Update page |
| DELETE | /api/pages/:id | Delete page |

### Services
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/services | Get all services |
| GET | /api/services/:id | Get service by ID |
| GET | /api/services/slug/:slug | Get service by slug |
| POST | /api/services | Create service |
| PUT | /api/services/:id | Update service |
| DELETE | /api/services/:id | Delete service |

### Industries
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/industries | Get all industries |
| GET | /api/industries/:id | Get industry by ID |
| GET | /api/industries/slug/:slug | Get industry by slug |
| POST | /api/industries | Create industry |
| PUT | /api/industries/:id | Update industry |
| DELETE | /api/industries/:id | Delete industry |

### Blogs
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/blogs | Get all blogs |
| GET | /api/blogs/:id | Get blog by ID |
| GET | /api/blogs/slug/:slug | Get blog by slug (increments views) |
| POST | /api/blogs | Create blog |
| PUT | /api/blogs/:id | Update blog |
| DELETE | /api/blogs/:id | Delete blog |

### Projects
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/projects | Get all projects |
| GET | /api/projects/:id | Get project by ID |
| GET | /api/projects/slug/:slug | Get project by slug |
| POST | /api/projects | Create project |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |

### Case Studies
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/case-studies | Get all case studies |
| GET | /api/case-studies/:id | Get case study by ID |
| GET | /api/case-studies/slug/:slug | Get case study by slug |
| POST | /api/case-studies | Create case study |
| PUT | /api/case-studies/:id | Update case study |
| DELETE | /api/case-studies/:id | Delete case study |

### Team
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/team | Get all team members |
| GET | /api/team/:id | Get team member by ID |
| POST | /api/team | Create team member |
| PUT | /api/team/:id | Update team member |
| DELETE | /api/team/:id | Delete team member |

### Testimonials
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/testimonials | Get all testimonials |
| GET | /api/testimonials/:id | Get testimonial by ID |
| POST | /api/testimonials | Create testimonial |
| PUT | /api/testimonials/:id | Update testimonial |
| DELETE | /api/testimonials/:id | Delete testimonial |

### Careers
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/careers | Get all jobs |
| GET | /api/careers/:id | Get job by ID |
| GET | /api/careers/slug/:slug | Get job by slug |
| POST | /api/careers | Create job |
| PUT | /api/careers/:id | Update job |
| DELETE | /api/careers/:id | Delete job |

### Job Applications
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/job-applications | Get all applications |
| GET | /api/job-applications/:id | Get application by ID |
| POST | /api/job-applications | Submit application (resume upload) |
| PATCH | /api/job-applications/:id/status | Update application status |
| DELETE | /api/job-applications/:id | Delete application |

### Contacts
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/contacts | Get all contact submissions |
| GET | /api/contacts/:id | Get contact by ID |
| POST | /api/contacts | Submit contact form |
| DELETE | /api/contacts/:id | Delete contact |

### Proposals
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/proposals | Get all proposals |
| GET | /api/proposals/:id | Get proposal by ID |
| POST | /api/proposals | Submit proposal form |
| DELETE | /api/proposals/:id | Delete proposal |

### Newsletter
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/newsletter | Get all subscribers |
| POST | /api/newsletter | Subscribe |
| DELETE | /api/newsletter/:id | Unsubscribe |

### FAQs
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/faqs | Get all FAQs |
| GET | /api/faqs/:id | Get FAQ by ID |
| POST | /api/faqs | Create FAQ |
| PUT | /api/faqs/:id | Update FAQ |
| DELETE | /api/faqs/:id | Delete FAQ |

### Clients (Logos)
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/clients | Get all client logos |
| GET | /api/clients/:id | Get client by ID |
| POST | /api/clients | Create client |
| PUT | /api/clients/:id | Update client |
| DELETE | /api/clients/:id | Delete client |

### Awards
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/awards | Get all awards |
| GET | /api/awards/:id | Get award by ID |
| POST | /api/awards | Create award |
| PUT | /api/awards/:id | Update award |
| DELETE | /api/awards/:id | Delete award |

### Technologies
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/technologies | Get all technologies |
| GET | /api/technologies/:id | Get technology by ID |
| POST | /api/technologies | Create technology |
| PUT | /api/technologies/:id | Update technology |
| DELETE | /api/technologies/:id | Delete technology |

### Counters
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/counters | Get all counters |
| GET | /api/counters/:id | Get counter by ID |
| POST | /api/counters | Create counter |
| PUT | /api/counters/:id | Update counter |
| DELETE | /api/counters/:id | Delete counter |

### Media Library
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/media | List all media (search, pagination) |
| POST | /api/media/upload | Upload images (up to 50 at once) |
| DELETE | /api/media/:id | Delete media |

---

## Query Parameters (available on GET all routes)

| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| search | string | Search by relevant fields |
| sortField | string | Field to sort by (default: createdAt) |
| sortOrder | string | `asc` or `desc` (default: desc) |
| status | string | Filter by status (published/draft/open/closed) |
| featured | boolean | Filter featured items (true/false) |
| category | string | Filter by category (blogs, faqs) |

---

## Image Upload

- All image uploads use `multipart/form-data`
- Images are uploaded to Cloudinary and the local temp file is deleted
- Old images are deleted from Cloudinary on update
- Supported formats: jpeg, jpg, png, gif, webp, svg
- Max file size: 10MB per image
- Resumes (PDFs/DOCs): 20MB max

---

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "Description of result",
  "data": {},
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```
