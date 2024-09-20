const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 
const authRoutes=require('./routes/authRoutes')
const authenticate = require('./middleware/authMiddleware');
const errorHandler = require('./utils/errorHandler');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); 
app.use(cors()); // Enable CORS for your frontend
app.use(authenticate);
app.use(errorHandler);

// Error Handling Middleware (add this later)
// app.use(errorHandler); 

// Database Connection
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Routes (add these later)
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
// ...

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 