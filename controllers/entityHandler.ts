import { Model, PopulateOptions, Schema } from "mongoose";
import { catchAsync } from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { ProtectedRequest } from "./auth/types";
import AppError from "../utils/AppError";
import { QueryAPI } from "../utils/QueryAPI";

export default class EntityHandler<T> {
  public constructor(public model: Model<T>) {}

  public deleteOne() {
    return catchAsync(
      async (
        req: Request | ProtectedRequest,
        res: Response,
        next: NextFunction
      ) => {
        const doc = await this.model.findById(req.params.id);
        if (!doc)
          return next(new AppError("Document doesnt exist with that id", 404));

        await this.model.findByIdAndDelete(req.params.id);

        res.status(204).json({
          status: "success",
        });
      }
    );
  }

  public updateOne() {
    return catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
        const updatedData = req?.body;
        const documentId = req.params?.id;
        const doc = await this.model.findByIdAndUpdate(
          documentId,
          updatedData,
          { new: true, runValidators: true }
        );
        if (!doc)
          return next(new AppError("Document doesnt exist with that id", 404));
        res.status(200).json({
          status: "success",
          data: doc,
        });
      }
    );
  }

  public createOne() {
    return catchAsync(async (req: Request, res: Response) => {
      const documentData = req?.body;
      const doc = await this.model.create(documentData);
      res.status(201).json({
        status: "success",
        data: doc,
      });
    });
  }

  public getOne(popOptions?: PopulateOptions) {
    return catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        if (!id)
          return next(new AppError("Please provide the document id", 400));
        let query = this.model.findById(id);
        if (popOptions) query = query.populate(popOptions);
        const doc = await query;
        if (!doc)
          return next(new AppError("Document doesnt exist with that id", 404));
        res.status(200).json({
          status: "success",
          data: doc,
        });
      }
    );
  }

  public getAll(resourceSchema: Schema) {
    return catchAsync(async (req: Request, res: Response) => {
      // The next three lines is to allow for nested reviews endpoint
      const { id } = req.params;
      let filter = {};
      if (id) filter = { tour: req.params.id };
      // Extracting all query (filters,sort,projection,...)
      const queryStrings = req.query;
      // Filtering the filter props only by Including only the schema props
      const queryObj = { ...queryStrings };
      const docsQuery = new QueryAPI(
        queryObj,
        resourceSchema,
        this.model.find(filter) as any
      )
        .filter()
        .sort()
        .select()
        .paginate().query;
      // const docs = await docsQuery.explain();
      const docs = await docsQuery;
      // return the results
      res.status(200).json({
        status: "success",
        results: docs.length,
        data: docs,
      });
    });
  }
}
