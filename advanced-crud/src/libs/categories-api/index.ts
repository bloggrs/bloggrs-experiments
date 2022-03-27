// if (global.docs_collector) docs_collector.generalAddYAML(__dirname + "/docs.yaml")

import express, { Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";

import * as yup from "yup";

import { createCategory, findByPkOr404 } from "./categories-dal";

const app = express();

app.get("/categories/:category_id",[
    validateRequest(
        yup.object().shape({
            params: yup.object().shape({
                category_id: yup.string().required().test(val => !isNaN(Number(val)))
            })
        })
    )
], async (req: Request,res: Response) => {
    const { query: options } = req
    const { category_id } = req.params;
    const category = await findByPkOr404(Number(category_id), options);
    return res.json({
        code: 200,
        message: "success",
        data: category
    })
})

app.post("/categories", validateRequest(
    yup.object().shape({
        requestBody: yup.object().shape({
            title: yup.string().required(),
            slug: yup.string().required(),
            deletedAt: yup.string(),
            createdAt: yup.string(),
            updatedAt: yup.string(),
        })
    })
), async (req: Request, res: Response) => {
    const { body: data } = req;
    const category = await createCategory(data);
    return res.json({
        code: 201,
        message: "success",
        data: category
    })
})

export default app;

// const express = require("express");
// const app = module.exports = express();

// const { allowCrossDomain, validateRequest, jwtRequired, passUserFromJWT, adminRequired } = require("../../middlewares");

// const { findAll, createReferral, updateReferral, deleteReferral, findByPkOr404 } = require("./referral-dal");
// const { ErrorHandler } = require("../../utils/error");

// const yup = require("yup");
// const { param_id, id } = require("../utils/validations");

// app.use(allowCrossDomain)

// const ReferralFields = {
//     type: yup.string().oneOf(["BLOG"]),
//     BlogId: id,
//     UserId: id
// }
// const ReferralFieldKeys = Object.keys(ReferralFields)

// app.get("/referral", [
//     jwtRequired, passUserFromJWT,
//     validateRequest(yup.object().shape({
//         query: yup.object().shape({
//             page: yup.number().integer().positive().default(1),
//             pageSize: yup.number().integer().positive().default(10),
//             status: yup.string(),
//             query: yup.string()
//         })
//     }))
// ], async (req,res) => {
//     let referrals = await findAll(req.query); 
//     return res.json({
//         message: "success",
//         code: 200,
//         data: { referrals }
//     })
// })

// app.get("/referral/:referral_id", [
//     validateRequest(yup.object().shape({
//         params: yup.object().shape({
//             referral_id: param_id.required()
//         })
//     }))
// ], async (req,res) => {
//     const referral = await findByPkOr404(req.params.referral_id);
//     return res.json({
//         code: 200,
//         message: "sucess",
//         data: { referral }
//     })
// })


// const CreateReferralFields = {};
// ReferralFieldKeys.map(key => CreateReferralFields[key] = ReferralFields[key].required());
// app.post("/referral",[
//     // jwtRequired, passUserFromJWT, adminRequired,
//     validateRequest(yup.object().shape({
//         requestBody: yup.object().shape(CreateReferralFields)
//     }))
// ], async (req,res) => {
//     let referral = await createReferral(req.body);
//     return res.json({
//         code: 200,
//         message: "success",
//         data: { referral }
//     })
// })

// app.patch("/referral/:referral_id", [
//     jwtRequired, passUserFromJWT, adminRequired,
//     validateRequest(yup.object().shape({
//         requestBody: yup.object().shape(ReferralFields),
//         params: yup.object().shape({
//             referral_id: param_id.required()
//         })
//     }))
// ], async (req,res) => {
//     let referral = await updateReferral({
//         pk: req.params.referral_id,
//         data: req.body
//     });
//     return res.json({
//         code: 200,
//         message: "success",
//         data: { referral }
//     })
// })

// app.delete("/referral/:referral_id", [
//     jwtRequired, passUserFromJWT, adminRequired,
//     validateRequest(yup.object().shape({
//         params: yup.object().shape({
//             referral_id: param_id.required()
//         })
//     }))
// ], async (req,res) => {
//     await deleteReferral(req.params.referral_id)
//     return res.json({
//         code: 204,
//         message: "success"
//     })
// })
