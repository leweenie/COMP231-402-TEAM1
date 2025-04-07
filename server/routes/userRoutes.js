const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers")


router.post("/", userController.createUser);

router.patch("/:id", userController.updateUser);

router.patch("/:id/add/:favouriteid", userController.addFavourite);

router.get("/:id/favourites", userController.getAllFavourites);

router.get("/:id", userController.getUserByID);

module.exports = router;