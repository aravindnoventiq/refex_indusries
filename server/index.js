require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const { sequelize } = require("./models");
const status = require("./helpers/response");
const session = require("express-session");
const passport = require("passport");
const axios = require('axios')
const downloadBSEExcel = require('./bseDownloader');
const readExcelFile = require('./readExcel');

const { exec } = require('child_process');
const cron = require('node-cron');


const app = express();



// COMMON HEADERS (IMPORTANT)

function runRefexRenewDailyJob() {
  exec('node stockRefexRenewBse.js --today', (err, stdout, stderr) => {
    if (err) {
      console.error('Error:', err.message);
      return;
    }
    console.log('REFEXRENEW daily job completed successfully');
  });
}



cron.schedule('30 19 * * 1-5', runRefexRenewDailyJob);

app.get('/api/refex-stock', async (req, res) => {

  await downloadBSEExcel();
  const data = readExcelFile();
  res.json({
    success: true,
    records: data
  });
});

// CORS must be applied before any other middleware
// More permissive CORS for development
app.use((req, res, next) => {
  // Log all incoming requests for debugging
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} from origin: ${req.headers.origin || 'no-origin'}`);
  
  // Set CORS headers for all requests
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Pragma');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling preflight request for:', req.url);
    return res.status(200).end();
  }
  
  next();
});

// Additional CORS middleware as backup
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control', 'Pragma'],
  optionsSuccessStatus: 200
}));

// Middleware to parse incoming JSON data ==================================
app.use(express.json({  }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));







// Routes
app.use("/auth", require("./routes/auth"));
app.use("/cms", require("./routes/cms"));
app.use("/api/cms/home", require("./routes/home_cms"));
app.use("/api/cms/about", require("./routes/about_cms"));
app.use("/api/cms/capabilities", require("./routes/capabilities_cms"));
app.use("/api/cms/ash-utilization", require("./routes/ash_utilization_cms"));
app.use("/api/cms/green-mobility", require("./routes/green_mobility_cms"));
app.use("/api/cms/venwind-refex", require("./routes/venwind_refex_cms"));
app.use("/api/cms/refrigerant-gas", require("./routes/refrigerant_gas_cms"));
app.use("/api/cms/esg", require("./routes/esg_cms"));
app.use("/api/cms/sustainability", require("./routes/sustainability_cms"));
app.use("/api/cms/products", require("./routes/products_cms"));
app.use("/api/cms/newsroom", require("./routes/newsroom_cms"));
app.use("/api/cms/contact", require("./routes/contact_cms"));
app.use("/api/cms/header", require("./routes/header_cms"));
app.use("/api/cms/footer", require("./routes/footer_cms"));
app.use("/api/cms/investors", require("./routes/investors_cms"));
app.use("/api/cms/careers", require("./routes/careers_cms"));
app.use("/api/cms/legal", require("./routes/legal_cms"));
app.use("/api/stock", require("./routes/stock"));
app.use("/api/geo", require("./routes/geo"));
app.use("/api", require("./routes/contact"));
app.use("/api/careers", require("./routes/careers"));






app.get('/api/historical', (req, res) => {
  try {
     console.log('req.query', req.query);
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const search = req.query.search || '';
      const startDate = req.query.start_date || '';
      const endDate = req.query.end_date || '';
      const exchange = (req.query.exchange || 'NSE').toUpperCase();
      
      // Select data file based on exchange
      let dataFile = 'refex_data.json'; // Default NSE data
      if (exchange === 'BSE') {
          dataFile = 'refex_bse_data.json';
      }
      
      // Read JSON file
      let allData = [];
      try {
          const fileData = fs.readFileSync(dataFile, 'utf8');
          allData = JSON.parse(fileData);
      } catch (fileError) {
          // If BSE file doesn't exist, try to read from Excel downloads
          if (exchange === 'BSE') {
              try {
                  const readExcelFile = require('./readExcel');
                  const excelData = readExcelFile();
                  if (excelData && excelData.length > 0) {
                      // Transform Excel data to match our format
                      allData = excelData.map(item => ({
                          date: item.Date || item.date || '',
                          open: item.Open || item['Open Price'] || item.open || 0,
                          high: item.High || item['High Price'] || item.high || 0,
                          low: item.Low || item['Low Price'] || item.low || 0,
                          close: item.Close || item['Close Price'] || item.close || 0,
                          volume: item.Volume || item['No. of Shares'] || item.volume || 0,
                          tradeValue: item['Turnover (Rs.)'] || item.tradeValue || item.Turnover || 0,
                          noOfTrades: item['No. of Trades'] || item.noOfTrades || item.Trades || 0,
                          exchange: 'BSE'
                      }));
                  }
              } catch (excelError) {
                  console.error('Error reading BSE Excel data:', excelError.message);
              }
          }
          
          if (allData.length === 0) {
              return res.status(404).json({ 
                  success: false, 
                  error: 'No data available for ${exchange}',
                  message: '${exchange} data file not found. Please ensure ${dataFile} exists.'
              });
          }
      }
      
      // Add exchange info to each record
      allData = allData.map(item => ({ ...item, exchange: exchange }));
      
      // Filter by date range if provided
      if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          
          allData = allData.filter(item => {
              if (!item.date) return false;
              const itemDate = new Date(item.date);
              return itemDate >= start && itemDate <= end;
          });
      }
      
      // Filter by search term if provided
      if (search) {
          const searchLower = search.toLowerCase();
          allData = allData.filter(item => {
              const date = (item.date || item.timestamp || '').toLowerCase();
              const symbol = (item.symbol || '').toLowerCase();
              return date.includes(searchLower) || symbol.includes(searchLower);
          });
      }
      
      // Sort by date descending (newest first)
      allData.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Calculate pagination
      const totalRecords = allData.length;
      const totalPages = Math.ceil(totalRecords / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = allData.slice(startIndex, endIndex);
      
      res.json({
          success: true,
          exchange: exchange,
          data: paginatedData,
          pagination: {
              currentPage: page,
              totalPages: totalPages,
              totalRecords: totalRecords,
              limit: limit,
              hasNextPage: page < totalPages,
              hasPrevPage: page > 1
          }
      });
  } catch (error) {
      res.status(500).json({ 
          success: false, 
          error: error.message,
          message: 'Data file not found. Please run: npm start'
      });
  }
});

app.get('/api/refexrenew-historical', (req, res) => {
  try {
     console.log('req.query', req.query);
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const search = req.query.search || '';
      const startDate = req.query.start_date || '';
      const endDate = req.query.end_date || '';
      const exchange = (req.query.exchange || 'NSE').toUpperCase();
      
      // Select data file based on exchange
      let dataFile = 'refexrenew_bse_data.json'; // Default NSE data
      // if (exchange === 'BSE') {
      //     dataFile = 'refexrenew_bse_data.json';
      // }
      
      // Read JSON file
      let allData = [];
      try {
          const fileData = fs.readFileSync(dataFile, 'utf8');
          allData = JSON.parse(fileData);
      } catch (fileError) {
          // If BSE file doesn't exist, try to read from Excel downloads
          if (exchange === 'BSE') {
              try {
                  const readExcelFile = require('./readExcel');
                  const excelData = readExcelFile();
                  if (excelData && excelData.length > 0) {
                      // Transform Excel data to match our format
                      allData = excelData.map(item => ({
                          date: item.Date || item.date || '',
                          open: item.Open || item['Open Price'] || item.open || 0,
                          high: item.High || item['High Price'] || item.high || 0,
                          low: item.Low || item['Low Price'] || item.low || 0,
                          close: item.Close || item['Close Price'] || item.close || 0,
                          volume: item.Volume || item['No. of Shares'] || item.volume || 0,
                          tradeValue: item['Turnover (Rs.)'] || item.tradeValue || item.Turnover || 0,
                          noOfTrades: item['No. of Trades'] || item.noOfTrades || item.Trades || 0,
                          exchange: 'BSE'
                      }));
                  }
              } catch (excelError) {
                  console.error('Error reading BSE Excel data:', excelError.message);
              }
          }
          
          if (allData.length === 0) {
              return res.status(404).json({ 
                  success: false, 
                  error: 'No data available for ${exchange}',
                  message: '${exchange} data file not found. Please ensure ${dataFile} exists.'
              });
          }
      }
      
      // Add exchange info to each record
      allData = allData.map(item => ({ ...item, exchange: exchange }));
      
      // Filter by date range if provided
      if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          
          allData = allData.filter(item => {
              if (!item.date) return false;
              const itemDate = new Date(item.date);
              return itemDate >= start && itemDate <= end;
          });
      }
      
      // Filter by search term if provided
      if (search) {
          const searchLower = search.toLowerCase();
          allData = allData.filter(item => {
              const date = (item.date || item.timestamp || '').toLowerCase();
              const symbol = (item.symbol || '').toLowerCase();
              return date.includes(searchLower) || symbol.includes(searchLower);
          });
      }
      
      // Sort by date descending (newest first)
      allData.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Calculate pagination
      const totalRecords = allData.length;
      const totalPages = Math.ceil(totalRecords / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = allData.slice(startIndex, endIndex);
      
      res.json({
          success: true,
          exchange: exchange,
          data: paginatedData,
          pagination: {
              currentPage: page,
              totalPages: totalPages,
              totalRecords: totalRecords,
              limit: limit,
              hasNextPage: page < totalPages,
              hasPrevPage: page > 1
          }
      });
  } catch (error) {
      res.status(500).json({ 
          success: false, 
          error: error.message,
          message: 'Data file not found. Please run: npm start'
      });
  }
});



app.get('/nse/quote', async (req, res) => {
  const symbol = req.query.symbol || 'REFEX';

  try {
    // Step 1: Create NSE session
    await client.get('https://www.nseindia.com', {
      headers: {
        ...commonHeaders,
        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });

    // Step 2: Call actual API
    const response = await client.get(
      `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
          'Referer': `https://www.nseindia.com/get-quotes/equity?symbol=${symbol}`,
          'Accept': 'application/json'
        }
      }
    );

    return res.json({
      status: true,
      data: response.data
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      error: err.message
    });
  }
});



// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running well",
    timestamp: new Date().toISOString()
  });
});

// CORS test endpoint
app.get("/api/cors-test", (req, res) => {
  res.json({
    success: true,
    message: "CORS is working!",
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Test POST endpoint for CORS
app.post("/api/cors-test", (req, res) => {
  res.json({
    success: true,
    message: "POST CORS is working!",
    body: req.body,
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// // simple route
// app.get("/", (req, res) => {
//   return res.json({
//     success: true,
//     message: "Backend is running well",
//   });
// });

// app.use("/auth", require("./src/routes/auth"));

// app.use(
//   "/api",
//   require("./src/routes/user"),
//   require("./src/routes/dashboard"),
//   require("./src/routes/sales_management/customer"),
//   require("./src/routes/sales_management/lead"),
//   require("./src/routes/sales_management/quotation"),
//   require("./src/routes/sales_management/nsop_quotation"),
//   require("./src/routes/sales_management/proforma_invoice"),
//   require("./src/routes/sales_management/brief_sheet"),
//   require("./src/routes/trip_management/masters/operator"),
//   require("./src/routes/trip_management/masters/airport"),
//   require("./src/routes/trip_management/masters/aircraft"),
//   require("./src/routes/trip_management/masters/aircraft_model"),
//   require("./src/routes/trip_management/masters/country"),
//   require("./src/routes/trip_management/masters/city"),
//     require("./src/routes/trip_management/masters/zone"),
//   require("./src/routes/trip_management/masters/designation"),
//   require("./src/routes/trip_management/masters/crew"),
//   require("./src/routes/sales_management/quotation_download")
// );

// Image upload endpoint - MUST be before the catch-all API route
const uploadImage = require('./middlewares/uploadImage');
app.post('/api/upload/image', uploadImage.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    // Return the file path relative to the server
    const imageUrl = `/uploads/images/${req.file.filename}`;
    res.json({ 
      success: true, 
      imageUrl: imageUrl,
      filename: req.file.filename 
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// PDF upload endpoint
const uploadPdf = require('./middlewares/uploadPdf');
app.post('/api/upload/pdf', uploadPdf.single('pdf'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file provided' });
    }
    
    // Return the file path relative to the server
    const pdfUrl = `/uploads/pdfs/${req.file.filename}`;
    res.json({ 
      success: true, 
      pdfUrl: pdfUrl,
      filename: req.file.filename 
    });
  } catch (error) {
    console.error('PDF upload error:', error);
    res.status(500).json({ error: 'Failed to upload PDF' });
  }
});

// PDF upload endpoint with subfolder support
const multer = require('multer');
app.post('/api/upload/pdf/:subfolder', (req, res) => {
  const subfolder = req.params.subfolder;
  const uploadDir = path.join(__dirname, 'uploads', 'pdfs', subfolder);
  
  // Ensure subfolder exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'pdf-' + uniqueSuffix + '.pdf');
    }
  });
  
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed'), false);
      }
    },
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
  }).single('pdf');
  
  upload(req, res, (err) => {
    if (err) {
      console.error('PDF upload error:', err);
      return res.status(400).json({ error: err.message || 'Failed to upload PDF' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file provided' });
    }
    
    const pdfUrl = `/uploads/pdfs/${subfolder}/${req.file.filename}`;
    res.json({ 
      success: true, 
      pdfUrl: pdfUrl,
      filename: req.file.filename 
    });
  });
});

// Audio upload endpoint
const uploadAudio = require('./middlewares/uploadAudio');
app.post('/api/upload/audio', uploadAudio, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }
    
    // Return the file path relative to the server
    const audioUrl = `/uploads/audio/${req.file.filename}`;
    res.json({ 
      success: true, 
      audioUrl: audioUrl,
      filename: req.file.filename 
    });
  } catch (error) {
    console.error('Audio upload error:', error);
    res.status(500).json({ error: 'Failed to upload audio' });
  }
});

// Serve uploaded files
const uploadsPath = path.join(__dirname, "./uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use("/uploads", express.static(uploadsPath, { fallthrough: true }));
// UAT often misses CMS files that still exist on production — fall back so images load.
const UPLOADS_FALLBACK_ORIGIN =
  process.env.UPLOADS_FALLBACK_ORIGIN || "https://refex.co.in";
app.use("/uploads", (req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const target = `${UPLOADS_FALLBACK_ORIGIN}/uploads${req.url}`;
  return res.redirect(302, target);
});
app.use(express.static(uploadsPath));

// Serve WordPress content files (wp-content/uploads)
// app.use('/wp-content', express.static(path.join(__dirname, 'wp-content')));

// Download PDF from URL and save to server (with optional subfolder)
app.post('/api/download-pdf-from-url/:subfolder?', async (req, res) => {
  try {
    const { url } = req.body;
    const subfolder = req.params.subfolder || '';
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log('Downloading PDF from URL:', url);
    if (subfolder) console.log('Subfolder:', subfolder);

    // Fetch the PDF from the URL
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      timeout: 60000, // 60 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // Check if response is a PDF
    const contentType = response.headers['content-type'];
    if (!contentType || (!contentType.includes('application/pdf') && !contentType.includes('octet-stream'))) {
      console.log('Content-Type:', contentType);
      // Still try to save if it looks like a PDF
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `pdf-${uniqueSuffix}.pdf`;
    
    // Ensure uploads/pdfs directory (with optional subfolder) exists
    const uploadsDir = subfolder 
      ? path.join(__dirname, 'uploads', 'pdfs', subfolder)
      : path.join(__dirname, 'uploads', 'pdfs');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Save the PDF to the uploads/pdfs folder
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, response.data);
    
    console.log('PDF saved to:', filePath);
    
    // Return the local path
    const pdfUrl = subfolder 
      ? `/uploads/pdfs/${subfolder}/${filename}`
      : `/uploads/pdfs/${filename}`;
    res.json({ 
      success: true, 
      pdfUrl: pdfUrl,
      filename: filename,
      originalUrl: url
    });
  } catch (error) {
    console.error('Error downloading PDF from URL:', error.message);
    res.status(500).json({ 
      error: 'Failed to download PDF from URL',
      details: error.message 
    });
  }
});

// Download proxy endpoint - downloads file from external URL and streams to client
app.post('/api/download-proxy', async (req, res) => {
  try {
    const { url, filename } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log('Download proxy request for:', url);
    
    // Fetch the file from the external URL
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Get content type from response or default to PDF
    const contentType = response.headers['content-type'] || 'application/pdf';
    const contentLength = response.headers['content-length'];
    
    // Set headers for file download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename || 'document.pdf'}"`);
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }

    // Pipe the response stream to the client
    response.data.pipe(res);
    
  } catch (error) {
    console.error('Download proxy error:', error.message);
    res.status(500).json({ error: 'Failed to download file', message: error.message });
  }
});

app.all("/api/*", (req, res) => {
  return status.responseStatus(res, 404, "Endpoint Not Found");
});

// Serve React frontend build (Adonis-style single-server setup)
// Workflow: cd client && npm run build  →  cd server && npm start
// Then open http://localhost:APP_PORT (default 3052) for site + API + uploads
const clientBuildPath = path.join(__dirname, "../client/out");
const distIndexPath = path.join(clientBuildPath, "index.html");

if (fs.existsSync(clientBuildPath) && fs.existsSync(distIndexPath)) {
  console.log("Serving frontend from:", clientBuildPath);

  app.use(
    express.static(clientBuildPath, {
      maxAge: "1d",
      etag: true,
      lastModified: true,
      index: false,
    }),
  );

  // Non-API routes → index.html (React Router). Skip backend mounts.
  app.get("*", (req, res, next) => {
    if (
      req.path.startsWith("/api/") ||
      req.path.startsWith("/auth") ||
      req.path.startsWith("/cms") ||
      req.path.startsWith("/uploads") ||
      req.path.startsWith("/nse")
    ) {
      return next();
    }

    if (/\.[a-z0-9]+$/i.test(req.path) && !/\.html?$/i.test(req.path)) {
      return res.status(404).send("Not found");
    }

    return res.sendFile(distIndexPath);
  });
} else {
  console.warn(
    "Client build folder not found at",
    clientBuildPath,
    "- API will work but frontend will not be served. Run 'npm run build' in the client folder.",
  );
  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Backend API server is running",
      note: "Build the client (cd client && npm run build) so this server can serve client/out",
    });
  });
}

// set port / host (0.0.0.0 = reachable on LAN / tunnels, same idea as Vite host)
const PORT = process.env.APP_PORT || 3052;
const HOST = process.env.APP_HOST || "0.0.0.0";

// Schema changes: run `npm run db:migrate` (explicit CMS SQL). Do not alter on boot —
// production dumps hit MySQL "Too many keys" when Sequelize tries sync({ alter: true }).
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
    startServer();
  })
  .catch((err) => {
    console.error("Error connecting to database:", err.message);
    console.warn("Warning: Starting server without a working DB connection...");
    console.warn("Fix MySQL, then run: npm run db:migrate");
    startServer();
  });

function startServer() {
  const server = app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
    console.log(`Local:   http://localhost:${PORT}`);
    if (fs.existsSync(path.join(__dirname, "../client/out", "index.html"))) {
      console.log(`Frontend: served from client/out`);
    }
    
    // Auto-start cron jobs for daily stock data updates at 8:00 PM
    try {
      require('./cronJobs');
      console.log('✓ Stock data cron job active (auto-runs daily at 8:00 PM)');
    } catch (error) {
      console.error('Error initializing cron jobs:', error.message);
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${PORT} is already in use!`);
      console.error(`Please stop the existing server or use a different port.`);
      console.error(`\nTo find and kill the process using port ${PORT}:`);
      console.error(`  Windows: netstat -ano | findstr :${PORT}`);
      console.error(`  Then: taskkill /PID <PID> /F`);
      console.error(`  Linux/Mac: lsof -ti:${PORT} | xargs kill -9\n`);
      process.exit(1);
    } else {
      throw err;
    }
  });
}
