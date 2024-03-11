const express = require("express");
// const { verify } = require("crypto");
const Func = require("../functions/functions");
const sequelize = require("../../config/db");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cache = require("../../config/node-cache");
const path = require("path");

// Controllers
const AdminControllers = require("../controller/adminController");
const CategoryControllers = require("../controller/categoryController");
const ItemControllers = require("../controller/categoryItemController");

// For Token
const verifyToken = async (req, res, next) => {
  const bearerHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    jwt?.verify(bearerToken, Func.Secret(), (err, authData) => {
      if (err) {
        res.json("err");
        console.log(err);
      } else {
        req.id = authData.id;
      }
    });
    next();
  } else {
    res.send("<center><h2>This link was not found! :(</h2></center>");
  }
};

// // Routes

// Admin Routes
router.get(
  "/admin/all",
  verifyToken,
  cache.get,
  AdminControllers.getAll,
  cache.set
);

router.get(
  "/admin/:id",
  verifyToken,
  cache.get,
  AdminControllers.getOne,
  cache.set
);

router.post("/admin/create", AdminControllers.create);
router.post("/admin/login", AdminControllers.login);
router.patch("/admin/update", verifyToken, AdminControllers.update);
router.delete("/admin/destroy", verifyToken, AdminControllers.Destroy);

// Category Routes
router.get("/category/all", cache.get, CategoryControllers.getAll, cache.set);

router.get("/category/:id", cache.get, CategoryControllers.getOne, cache.set);

router.post("/category/create", CategoryControllers.create);
router.patch("/category/update", CategoryControllers.update);
router.delete("/category/destroy/:id", CategoryControllers.Destroy);

// CategoryItem Routes
router.get("/item/all", cache.get, ItemControllers.getAll, cache.set);

router.get("/item/:id", cache.get, ItemControllers.getOne, cache.set);
router.get("/item/download/:id", ItemControllers.download);

router.post("/item/create", ItemControllers.create);
router.post("/item/upload/:id", ItemControllers.imgUpload);
router.patch("/item/update", ItemControllers.update);
router.delete("/item/destroy/:id", ItemControllers.Destroy);

module.exports = router;
