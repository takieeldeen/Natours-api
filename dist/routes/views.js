"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const views_1 = require("../controllers/views");
const auth_1 = require("../controllers/auth");
const viewsRouter = (0, express_1.Router)();
viewsRouter.use(auth_1.authController.protectView);
viewsRouter.route("/").get(views_1.viewsController.getOverviewPage);
viewsRouter
    .route("/me")
    .get(auth_1.authController.protectRoute, views_1.viewsController.getMyAccountPage);
viewsRouter.route("/tour/:tourSlug").get(views_1.viewsController.getTourPage);
viewsRouter.route("/login").get(views_1.viewsController.getLoginPage);
exports.default = viewsRouter;
//# sourceMappingURL=views.js.map