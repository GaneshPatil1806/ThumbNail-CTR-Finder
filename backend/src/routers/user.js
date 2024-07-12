"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const client_s3_1 = require("@aws-sdk/client-s3");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const middleware_1 = require("../middleware");
const s3_presigned_post_1 = require("@aws-sdk/s3-presigned-post");
// import { createTaskInput } from "../types";
// import { Connection, PublicKey, Transaction } from "@solana/web3.js";
// import nacl from "tweetnacl";
// const connection = new Connection(process.env.RPC_URL ?? "");
// const PARENT_WALLET_ADDRESS = "2KeovpYvrgpziaDsq8nbNMP4mc48VNBVXb5arbqrg9Cq";
const DEFAULT_TITLE = "Select the most clickable thumbnail";
const s3Client = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: (_a = process.env.ACCESS_KEY_ID) !== null && _a !== void 0 ? _a : "",
        secretAccessKey: (_b = process.env.ACCESS_SECRET) !== null && _b !== void 0 ? _b : "",
    },
    region: "eu-north-1"
});
const router = (0, express_1.Router)();
const prismaClient = new client_1.PrismaClient();
// prismaClient.$transaction(
//     async (prisma) => {
//       // Code running in a transaction...
//     },
//     {
//       maxWait: 5000, // default: 2000
//       timeout: 10000, // default: 5000
//     }
// )
// router.get("/task", authMiddleware, async (req, res) => {
//     // @ts-ignore
//     const taskId: string = req.query.taskId;
//     // @ts-ignore
//     const userId: string = req.userId;
//     const taskDetails = await prismaClient.task.findFirst({
//         where: {
//             user_id: Number(userId),
//             id: Number(taskId)
//         },
//         include: {
//             options: true
//         }
//     })
//     if (!taskDetails) {
//         return res.status(411).json({
//             message: "You dont have access to this task"
//         })
//     }
//     // Todo: Can u make this faster?
//     const responses = await prismaClient.submission.findMany({
//         where: {
//             task_id: Number(taskId)
//         },
//         include: {
//             option: true
//         }
//     });
//     const result: Record<string, {
//         count: number;
//         option: {
//             imageUrl: string
//         }
//     }> = {};
//     taskDetails.options.forEach(option => {
//         result[option.id] = {
//             count: 0,
//             option: {
//                 imageUrl: option.image_url
//             }
//         }
//     })
//     responses.forEach(r => {
//         result[r.option_id].count++;
//     });
//     res.json({
//         result,
//         taskDetails
//     })
// })
// router.post("/task", authMiddleware, async (req, res) => {
//     //@ts-ignore
//     const userId = req.userId
//     // validate the inputs from the user;
//     const body = req.body;
//     const parseData = createTaskInput.safeParse(body);
//     const user = await prismaClient.user.findFirst({
//         where: {
//             id: userId
//         }
//     })
//     if (!parseData.success) {
//         return res.status(411).json({
//             message: "You've sent the wrong inputs"
//         })
//     }
//     const transaction = await connection.getTransaction(parseData.data.signature, {
//         maxSupportedTransactionVersion: 1
//     });
//     console.log(transaction);
//     if ((transaction?.meta?.postBalances[1] ?? 0) - (transaction?.meta?.preBalances[1] ?? 0) !== 100000000) {
//         return res.status(411).json({
//             message: "Transaction signature/amount incorrect"
//         })
//     }
//     if (transaction?.transaction.message.getAccountKeys().get(1)?.toString() !== PARENT_WALLET_ADDRESS) {
//         return res.status(411).json({
//             message: "Transaction sent to wrong address"
//         })
//     }
//     if (transaction?.transaction.message.getAccountKeys().get(0)?.toString() !== user?.address) {
//         return res.status(411).json({
//             message: "Transaction sent to wrong address"
//         })
//     }
//     // was this money paid by this user address or a different address?
//     // parse the signature here to ensure the person has paid 0.1 SOL
//     // const transaction = Transaction.from(parseData.data.signature);
//     let response = await prismaClient.$transaction(async tx => {
//         const response = await tx.task.create({
//             data: {
//                 title: parseData.data.title ?? DEFAULT_TITLE,
//                 amount: 0.1 * TOTAL_DECIMALS,
//                 //TODO: Signature should be unique in the table else people can reuse a signature
//                 signature: parseData.data.signature,
//                 user_id: userId
//             }
//         });
//         await tx.option.createMany({
//             data: parseData.data.options.map(x => ({
//                 image_url: x.imageUrl,
//                 task_id: response.id
//             }))
//         })
//         return response;
//     })
//     res.json({
//         id: response.id
//     })
// })
router.get("/presignedUrl", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.userId;
    const { url, fields } = yield (0, s3_presigned_post_1.createPresignedPost)(s3Client, {
        Bucket: 'project2-thumbneilctr',
        Key: `fiver/${userId}/${Math.random()}/image.jpg`,
        Conditions: [
            ['content-length-range', 0, 5 * 1024 * 1024] // 5 MB max
        ],
        Expires: 3600
    });
    // const command = new PutObjectCommand({
    //     Bucket: 'project2-thumbneilctr',
    //     Key: `fiver/${userId}/${Math.random()}/image.jpg`,
    //     ContentType: "img/jpg"
    // })
    // const preSignedUrl = await getSignedUrl(s3Client,command,{
    //     expiresIn: 3600
    // })
    // res.json({
    //     preSignedUrl
    // })
    console.log({ url, fields });
    res.json({
        preSignedUrl: url,
        fields
    });
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { publicKey, signature } = req.body;
    // const message = new TextEncoder().encode("Sign into mechanical turks");
    // const result = nacl.sign.detached.verify(
    //     message,
    //     new Uint8Array(signature.data),
    //     new PublicKey(publicKey).toBytes(),
    // );
    // if (!result) {
    //     return res.status(411).json({
    //         message: "Incorrect signature"
    //     })
    // }
    const publicKey = "0x95fa625399153E4B28C43c6f0cdE76568A2bDDb9";
    const existingUser = yield prismaClient.user.findFirst({
        where: {
            address: publicKey
        }
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            userId: existingUser.id
        }, config_1.JWT_SECRET);
        res.json({
            token
        });
    }
    else {
        const user = yield prismaClient.user.create({
            data: {
                address: publicKey,
            }
        });
        const token = jsonwebtoken_1.default.sign({
            userId: user.id
        }, config_1.JWT_SECRET);
        res.json({
            token
        });
    }
}));
exports.default = router;
