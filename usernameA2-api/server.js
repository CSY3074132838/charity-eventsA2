const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./event_db');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

db.testConnection().catch(err=>{console.error(err);process.exit(1);});

app.get('/api/events', async (req,res)=>{
  const data = await db.getEventsForHome();
  res.json({success:true, data});
});

app.get('/api/categories', async (req,res)=>{
  res.json({success:true, data:await db.getCategories()});
});

app.get('/api/events/search', async (req,res)=>{
  const {date, location, category} = req.query;
  const data = await db.searchEvents({date,location,category});
  res.json({success:true, data});
});

app.get('/api/events/:id', async (req,res)=>{
  const ev = await db.getEventById(req.params.id);
  if (!ev) return res.status(404).json({success:false,message:'Not found'});
  res.json({success:true, data:ev});
});

app.listen(PORT, ()=>console.log(`🚀 http://localhost:${PORT}`));
