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
const types_1 = require("../types");
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
router.get("/task", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const taskId = req.query.taskId;
    // @ts-ignore
    const userId = req.userId;
    const taskDetails = yield prismaClient.task.findFirst({
        where: {
            user_id: Number(userId),
            id: Number(taskId)
        },
        include: {
            options: true
        }
    });
    if (!taskDetails) {
        return res.status(411).json({
            message: "You dont have access to this task"
        });
    }
    // Todo: Can u make this faster?
    const responses = yield prismaClient.submission.findMany({
        where: {
            task_id: Number(taskId)
        },
        include: {
            option: true
        }
    });
    const result = {};
    taskDetails.options.forEach(option => {
        result[option.id] = {
            count: 0,
            option: {
                imageUrl: option.image_url
            }
        };
    });
    responses.forEach(r => {
        result[r.option_id].count++;
    });
    res.json({
        result,
        taskDetails
    });
}));
router.post("/task", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.userId;
    const body = req.body;
    // Validate the inputs from the user;
    const parseData = types_1.createTaskInput.safeParse(body);
    // console.log(parseData)
    if (!parseData.success) {
        return res.status(411).json({
            message: "You've sent the wrong inputs"
        });
    }
    let response = yield prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const response = yield tx.task.create({
            data: {
                title: (_c = parseData.data.title) !== null && _c !== void 0 ? _c : "DEFAULT_TITLE",
                amount: 0.1 * 100000000, // Adjust TOTAL_DECIMALS as needed
                // TODO: Signature should be unique in the table else people can reuse a signature
                signature: parseData.data.signature,
                user_id: userId
            }
        });
        yield tx.option.createMany({
            data: parseData.data.options.map(x => ({
                image_url: x.imageUrl,
                task_id: response.id
            }))
        });
        return response;
    }));
    res.json({
        id: response.id
    });
}));
router.get("/presignedUrl", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.userId;
    const { url, fields } = yield (0, s3_presigned_post_1.createPresignedPost)(s3Client, {
        Bucket: 'project2-thumbneilctr',
        Key: `fiver/${userId}/${Math.random()}/image.png`,
        Conditions: [
            ['content-length-range', 0, 5 * 1024 * 1024] // 5 MB max
        ],
        Fields: {
            'Content-Type': 'image/png'
        },
        Expires: 3600
    });
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
