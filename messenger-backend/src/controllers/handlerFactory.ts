import { Response, Request, NextFunction } from "express";
import { Document, Model, PopulateOption, PopulateOptions } from "mongoose";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import APIFeatures from "../utils/apiFeatures";

export const deleteOne = <T extends Document>(Model: Model<T>) => 
    catchAsync (
        async (req: Request, res: Response, next: NextFunction ) => {
            const doc = await Model.findByIdAndDelete(req.params.id);
            
            if(!doc){
               return next(new AppError('No document with that id', 404))
            }
            res.status(204).json({
                status: 'success',
                data: null
            })
        }
    );

export const updateOne = <T extends Document>(Model: Model<T>, resName: string) =>
    catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });
            if(!doc){
                return next(new AppError('No document with that ID', 404))
            }
            res.status(200).json({
                status: 'success',
                data: {
                    [resName ?? 'document']: doc
                }
            })
        }
    );

export const createOne = <T extends Document>(Model: Model<T>, resName: string) =>
    catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const doc = await Model.create(req.body);

            res.status(201).json({
                status: 'success',
                data: {
                    [resName ?? 'document']: doc
                }
            })
        }
    )

    export const getOne = <T extends Document>(
        Model: Model<T>,
        popOptions?: string | PopulateOptions | Array<string | PopulateOptions>,
        resName: string = 'document'
    ) =>
        catchAsync(async (req: Request, res: Response, next: NextFunction) => {
            let query = Model.findById(req.params.id);
    
            if (popOptions) {
                // Ręczne sprawdzenie i narzucenie odpowiednich typów
                if (Array.isArray(popOptions)) {
                    query = query.populate(popOptions as Array<string | PopulateOptions>);
                } else {
                    query = query.populate(popOptions as string);
                }
            }
    
            const doc = await query;
    
            if (!doc) {
                return next(new AppError('No document with that ID', 404));
            }
    
            res.status(200).json({
                status: 'success',
                data: {
                    [resName ?? 'document']: doc,
                },
            });
        });

export const getAll = <T extends Document>(Model: Model<T>, resName: string) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let filter = {};
        if(req.params.tourId) filter = {tour: req.params.tourId};

        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const doc = await features.query;

        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                [resName ?? 'document']: doc
            }
        })
    })