import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/Product.js";

// @desc     Fetch all products
// @route    GET /api/products
// @access   Public
const getProducts = asyncHandler(async (req, res) => {
  // Paginate
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;

  const keyword =
    req.query.keyword !== "undefined"
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  // For search filtering

  // const products = await Product.find({
  //   name: { $regex: "ai", $options: "i" },
  // });

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc     Fetch single product
// @route    GET /api/products/:id
// @access   Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  // If no product
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Send product
  res.json(product);
});

// @desc     Create a product
// @route    POST /api/products
// @access   Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const products = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });

  const createdProduct = await products.save();

  if (!createdProduct) {
    res.status(400);
    throw new Error("Product cannot be created");
  }

  res.status(201).json(createdProduct);
});

// @desc     Update a product
// @route    put /api/products/:id
// @access   Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc     Delete single product
// @route    DELETE /api/products/:id
// @access   Private/Admin
const deleteProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  // If no product
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Send product
  res.json({ message: "Product removed" });
});

// @desc     Create review
// @route    POST /api/products/:id/reviews
// @access   Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  // Find product
  const product = await Product.findById(req.params.id);

  if (product) {
    // If Review already exists
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating = product.reviews.reduce(
      (acc, item) => item.rating + acc,
      0
    );

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }

  // // If no product
  // if (!product) {
  //   res.status(404);
  //   throw new Error("Product not found");
  // }
  // // Send product
  // res.json({ message: "Product removed" });
});

// @desc     Fetch top rated products
// @route    GET /api/products/top
// @access   Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  // If no product
  if (!products.length) {
    res.status(404);
    throw new Error("Products not found");
  }
  // Send product
  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProductById,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
