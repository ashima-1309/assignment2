var express = require('express');
const fs = require('fs');
var path = require('path');
var app = express();

const exphbs = require('express-handlebars');
const port = process.env.port || 3000;

var jData;
fs.readFile(path.join(__dirname, 'datasetB.json'), 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  jData = JSON.parse(data);
}

);

app.engine('.hbs', exphbs.engine({
  extname: '.hbs',
  helpers: {
    replaceZeroReviews: function (products) {
      return products.map((product) => {
        if (product.reviews === 0) {
          return { ...product, reviews: 'N/A' };
        }
        return product;
      })
    },
    eq: function (a, b) {
      return a === b;
    },
  },
}));
app.set("view engine", ".hbs");


////////////////////////////////////////////////////////////////

app.use(express.static(path.join(__dirname, 'public')));

// Middleware for loading the JSON data asynchronously
// app.use('/data', (req, res, next) => {
//   fs.readFile(jsonFilePath, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Error loading JSON data asynchronously:', err);
//       res.status(500).send('Internal Server Error');
//     } else {
//       const jsonData = JSON.parse(data);
//       res.locals.jsonData = jsonData;
//       next();
//     }
//   });
// });

app.get('/data', (req, res) => {
  const jsonData = res.locals.jsonData;
  res.render('data', { title: 'Data Page', jsonData }); // Send the entire JSON data
});

// Route to display the search form for product name
app.get('/data/search/prdName', (req, res) => {
  res.render('search', { title: 'Search Page' });
});

// Route to handle the search result 
app.get('/data/search/prdName/result', (req, res) => {
  const jsonData = res.locals.jsonData;
  const productNameToSearch = (req.query.productName || '').toLowerCase();

  const results = jsonData.filter(item => item.title.toLowerCase().includes(productNameToSearch));

  if (results.length > 0) {
    const displayResults = results.slice(0, 3);
    res.render('search-result', { title: 'Search Results', results: displayResults });
  } else {
    res.render('search-result', { title: 'Search Results', error: 'Product not found. Invalid Product Name.' });
  }
});

//step7
// Route to display all products info in HTML table
// Route to display all products info in HTML table
app.get('/allData', (req, res) => {

  if (!jData) {
    // console.error('Error loading JSON data:', err);
    res.status(500).send('Internal Server Error');
    return;
  }

  if (jData && jData.length > 0) {

    res.render('allData', { title: 'All Products Data', products: jData });
  } else {
    res.render('allData', { title: 'All Products Data', products: null });
  }
});



// Default route
app.get('/', (req, res) => {
  res.render('index', { title: 'Hello, My Name is Ashima and my Student ID is N01579119' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
