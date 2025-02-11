import { Router } from "express";
import { viewsController } from "../controllers/views";
import { authController } from "../controllers/auth";

const viewsRouter = Router();

viewsRouter.use(authController.protectView);
viewsRouter.route("/").get(viewsController.getOverviewPage);
viewsRouter
  .route("/me")
  .get(authController.protectRoute, viewsController.getMyAccountPage);
viewsRouter.route("/tour/:tourSlug").get(viewsController.getTourPage);
viewsRouter.route("/login").get(viewsController.getLoginPage);

export default viewsRouter;
