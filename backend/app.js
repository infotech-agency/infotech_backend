// const express = require('express');
// const cors = require('cors');
// const Category = require('./models/Category');
// const sendResponse = require('./utils/sendResponse');
// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/settings', require('./routes/settings.routes'));
// app.use('/api/seo', require('./routes/seo.routes'));
// app.use('/api/pages', require('./routes/page.routes'));
// app.use('/api/services', require('./routes/service.routes'));
// app.use('/api/industries', require('./routes/industry.routes'));
// app.use('/api/blogs', require('./routes/blog.routes'));
// app.use('/api/projects', require('./routes/project.routes'));
// app.use('/api/case-studies', require('./routes/caseStudy.routes'));
// app.use('/api/team', require('./routes/team.routes'));
// app.use('/api/testimonials', require('./routes/testimonial.routes'));
// app.use('/api/careers', require('./routes/career.routes'));
// app.use('/api/job-applications', require('./routes/jobApplication.routes'));
// app.use('/api/contacts', require('./routes/contact.routes'));
// app.use('/api/proposals', require('./routes/proposal.routes'));
// app.use('/api/newsletter', require('./routes/newsletter.routes'));
// app.use('/api/faqs', require('./routes/faq.routes'));
// app.use('/api/clients', require('./routes/client.routes'));
// app.use('/api/awards', require('./routes/award.routes'));
// app.use('/api/technologies', require('./routes/technology.routes'));
// app.use('/api/counters', require('./routes/counter.routes'));
// app.use('/api/media', require('./routes/media.routes'));

// //categories
// app.use('/api/categories', require('./routes/category.routes'));
// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: 'Route not found' });
// });

// // const getServicesMenu = async (req, res) => {
// //   try {
// //     const categories = await Category.find({
// //       status: "published"
// //     }).sort({ order: 1 });

// //     console.log(categories);

// //     const data = await Promise.all(
// //       categories.map(async (cat) => {
// //         const services = await Service.find({
// //           category: cat._id,
// //           status: "published"
// //         }).select("title slug");

// //         console.log("data", data)
// //         return {
// //           _id: cat._id,
// //           name: cat.name,
// //           slug: cat.slug,
// //           services
// //         };
// //       })
// //     );

// //     // sendResponse(res, 200, true, "Menu fetched", data);
// //   } catch (err) {
// //     // sendResponse(res, 500, false, err.message);
// //     console.log(err)
// //   }
// // };

// // getServicesMenu();

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
// });

// module.exports = app;


const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Category = require('./models/Category');
const sendResponse = require('./utils/sendResponse');
const requireAuth = require('../backend/middlewares/requireAuth');
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN, // e.g. http://localhost:5173
    credentials: true, // required so the browser sends/receives the auth cookie
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth (login/logout/me) — public
app.use('/api/auth', require('./routes/auth.routes'));

// Routes
app.use('/api/settings', require('./routes/settings.routes'));
app.use('/api/seo', require('./routes/seo.routes'));
app.use('/api/pages', require('./routes/page.routes'));
app.use('/api/services', require('./routes/service.routes'));
app.use('/api/industries', require('./routes/industry.routes'));
app.use('/api/blogs', require('./routes/blog.routes'));
app.use('/api/projects', require('./routes/project.routes'));
app.use('/api/case-studies', require('./routes/caseStudy.routes'));
app.use('/api/team', require('./routes/team.routes'));
app.use('/api/testimonials', require('./routes/testimonial.routes'));
app.use('/api/careers', require('./routes/career.routes'));
app.use('/api/job-applications', require('./routes/jobApplication.routes'));
app.use('/api/contacts', require('./routes/contact.routes'));
app.use('/api/proposals', require('./routes/proposal.routes'));
app.use('/api/newsletter', require('./routes/newsletter.routes'));
app.use('/api/faqs', require('./routes/faq.routes'));
app.use('/api/clients', require('./routes/client.routes'));
app.use('/api/awards', require('./routes/award.routes'));
app.use('/api/technologies', require('./routes/technology.routes'));
app.use('/api/counters', require('./routes/counter.routes'));
app.use('/api/media', require('./routes/media.routes'));

//categories
app.use('/api/categories', require('./routes/category.routes'));

// Example: protect an entire router with requireAuth (apply where you need admin-only writes)
// app.use('/api/settings', requireAuth, require('./routes/settings.routes'));

// const getServicesMenu = async (req, res) => {
//   try {
//     const categories = await Category.find({
//       status: "published"
//     }).sort({ order: 1 });

//     console.log(categories);

//     const data = await Promise.all(
//       categories.map(async (cat) => {
//         const services = await Service.find({
//           category: cat._id,
//           status: "published"
//         }).select("title slug");

//         console.log("data", data)
//         return {
//           _id: cat._id,
//           name: cat.name,
//           slug: cat.slug,
//           services
//         };
//       })
//     );

//     // sendResponse(res, 200, true, "Menu fetched", data);
//   } catch (err) {
//     // sendResponse(res, 500, false, err.message);
//     console.log(err)
//   }
// };

// getServicesMenu();

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

module.exports = app;