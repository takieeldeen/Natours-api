import { Request, Response } from "express";
import { QueryAPI } from "../../utils/QueryAPI";
import User, { userSchema } from "../../models/userModel";
import { catchAsync } from "../../utils/catchAsync";
import EntityHandler from "../entityHandler";

const userHandler = new EntityHandler(User);

export const getAllUsers = catchAsync(async function (
  req: Request,
  res: Response
) {
  const queryStrings = req?.query;
  const queryObj = { ...queryStrings };
  const usersQuery = new QueryAPI(queryObj, userSchema, User)
    .filter()
    .sort()
    .select()
    .paginate().query;
  const users = await usersQuery;

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

export function createUser(req: Request, res: Response) {
  res.status(500).json({
    status: "fail",
    message: "This route isnt yet implemented",
  });
}

export function useGetUser(req: Request, res: Response) {
  res.status(500).json({
    status: "fail",
    message: "This route isnt yet implemented",
  });
}

// export function updateUser(req: Request, res: Response) {
//   res.status(500).json({
//     status: "fail",
//     message: "This route isnt yet implemented",
//   });
// }

export const deleteUser = userHandler.deleteOne();
// DON'T Use This Route to Update Password
export const updateUser = userHandler.updateOne();
