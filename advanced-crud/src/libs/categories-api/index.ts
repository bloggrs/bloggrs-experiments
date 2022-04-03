// if (global.docs_collector) docs_collector.generalAddYAML(__dirname + "/docs.yaml")

import express, { Application, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";

import * as yup from "yup";

import { createCategory, deleteCategory, findAll, findByPkOr404, updateCategory } from "./categories-dal";
import { cache_hgs } from "../../redisClient";

const { param_id } = require("../../utils/validations")

const app: Application = express();

const PATHNAME_PREFIX: string = "/categories"

app.get(PATHNAME_PREFIX + "/:category_id", [
    validateRequest(
        yup.object().shape({
            params: yup.object().shape({
                category_id: yup.string().required().test(val => !isNaN(Number(val)))
            }),
            query: yup.object().shape({ 
                expand: yup.array().of(yup.string().required())
            })
        })
    )
], async (req: Request,res: Response) => {
    const { query: options } = req
    const { category_id } = req.params;

    const endpoint = PATHNAME_PREFIX + category_id
    const args = [ Number(category_id), options ]
    const category = await cache_hgs({
        endpoint, args,
        fallback: findByPkOr404,
        expiresAt: new Date(
            new Date().getTime() + 3 * (60 * 1000)
        ) // 3 hours
    })

    return res.status(200).json({
        code: 200,
        message: "success",
        data: category,
        response_metadata: { }
    })
})

app.get(PATHNAME_PREFIX, [
    validateRequest(
        yup.object().shape({
            query: yup.object().shape({
                cursor: yup.string(),
                expand: yup.array().of(yup.string().required())
            })
        })
    )
], async (req: Request, res: Response) => {
    const { query: options } = req;
    const [ categories, response_metadata ] = await findAll(options);
    return res.status(200).json({
        code: 200,
        message: "success",
        data: categories,
        response_metadata,
        options
    })
})

app.post(PATHNAME_PREFIX, validateRequest(
    yup.object().shape({
        requestBody: yup.object().shape({
            title: yup.string().required(),
            slug: yup.string().required(),
        }),
        query: yup.object().shape({
            expand: yup.array().of(yup.string().required())
        })
    })
), async (req: Request, res: Response) => {
    const { body: data, query: options } = req;
    const category = await createCategory(data, options);
    return res.status(201).json({
        code: 201,
        message: "success",
        data: category,
        response_metadata: { }
    })
})

app.patch(PATHNAME_PREFIX + "/:category_id", validateRequest(
    yup.object().shape({
        params: yup.object().shape({
            category_id: param_id.required()
        }),
        requestBody: yup.object().shape({
            title: yup.string(),
            slug: yup.string()
        }),
        query: yup.object().shape({
            expand: yup.array().of(yup.string().required())
        })
    })
), async (req: Request, res: Response) => {
    const { body: data, query: options } = req;
    const { category_id: pk } = req.params;
    const category = await updateCategory(Number(pk), data, options)
    return res.status(200).json({
        code: 200,
        message: "success",
        data: category,
        response_metadata: { }
    })
})

app.delete(PATHNAME_PREFIX + "/:category_id", validateRequest(
    yup.object().shape({
        params: yup.object().shape({
            category_id: param_id.required()
        })
    })
), async (req: Request, res: Response) => {
    const { category_id: pk } = req.params;
    deleteCategory(Number(pk));
    return res.status(202).json({
        code: 202,
        message: "success",
    })
})

export default app;