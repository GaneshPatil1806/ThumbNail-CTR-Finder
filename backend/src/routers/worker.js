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
Object.defineProperty(exports, "__esModule", { value: true });
// // import nacl from "tweetnacl";
const client_1 = require("@prisma/client");
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
// import { getNextTask } from "../db";
// import { createSubmissionInput } from "../types";
// import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
// import { privateKey } from "../privateKey";
// import { decode } from "bs58";
// // const connection = new Connection(process.env.RPC_URL ?? "");
// const TOTAL_SUBMISSIONS = 100;
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
const router = (0, express_1.Router)();
// router.post("/payout", workerMiddleware, async (req, res) => {
//     // @ts-ignore
//     const userId: string = req.userId;
//     const worker = await prismaClient.worker.findFirst({
//         where: { id: Number(userId) }
//     })
//     if (!worker) {
//         return res.status(403).json({
//             message: "User not found"
//         })
//     }
//     const transaction = new Transaction().add(
//         SystemProgram.transfer({
//             fromPubkey: new PublicKey("2KeovpYvrgpziaDsq8nbNMP4mc48VNBVXb5arbqrg9Cq"),
//             toPubkey: new PublicKey(worker.address),
//             lamports: 1000_000_000 * worker.pending_amount / TOTAL_DECIMALS,
//         })
//     );
//     console.log(worker.address);
//     const keypair = Keypair.fromSecretKey(decode(privateKey));
//     // TODO: There's a double spending problem here
//     // The user can request the withdrawal multiple times
//     // Can u figure out a way to fix it?
//     let signature = "";
//     try {
//         signature = await sendAndConfirmTransaction(
//             connection,
//             transaction,
//             [keypair],
//         );
//      } catch(e) {
//         return res.json({
//             message: "Transaction failed"
//         })
//      }
//     console.log(signature)
//     // We should add a lock here
//     await prismaClient.$transaction(async tx => {
//         await tx.worker.update({
//             where: {
//                 id: Number(userId)
//             },
//             data: {
//                 pending_amount: {
//                     decrement: worker.pending_amount
//                 },
//                 locked_amount: {
//                     increment: worker.pending_amount
//                 }
//             }
//         })
//         await tx.payouts.create({
//             data: {
//                 user_id: Number(userId),
//                 amount: worker.pending_amount,
//                 status: "Processing",
//                 signature: signature
//             }
//         })
//     })
//     res.json({
//         message: "Processing payout",
//         amount: worker.pending_amount
//     })
// })
// router.get("/balance", workerMiddleware, async (req, res) => {
//     // @ts-ignore
//     const userId: string = req.userId;
//     const worker = await prismaClient.worker.findFirst({
//         where: {
//             id: Number(userId)
//         }
//     })
//     res.json({
//         pendingAmount: worker?.pending_amount,
//         lockedAmount: worker?.pending_amount,
//     })
// })
// router.post("/submission", workerMiddleware, async (req, res) => {
//     // @ts-ignore
//     const userId = req.userId;
//     const body = req.body;
//     const parsedBody = createSubmissionInput.safeParse(body);
//     if (parsedBody.success) {
//         const task = await getNextTask(Number(userId));
//         if (!task || task?.id !== Number(parsedBody.data.taskId)) {
//             return res.status(411).json({
//                 message: "Incorrect task id"
//             })
//         }
//         const amount = (Number(task.amount) / TOTAL_SUBMISSIONS).toString();
//         const submission = await prismaClient.$transaction(async tx => {
//             const submission = await tx.submission.create({
//                 data: {
//                     option_id: Number(parsedBody.data.selection),
//                     worker_id: userId,
//                     task_id: Number(parsedBody.data.taskId),
//                     amount: Number(amount)
//                 }
//             })
//             await tx.worker.update({
//                 where: {
//                     id: userId,
//                 },
//                 data: {
//                     pending_amount: {
//                         increment: Number(amount)
//                     }
//                 }
//             })
//             return submission;
//         })
//         const nextTask = await getNextTask(Number(userId));
//         res.json({
//             nextTask,
//             amount
//         })
//     } else {
//         res.status(411).json({
//             message: "Incorrect inputs"
//         })
//     }
// })
// router.get("/nextTask", workerMiddleware, async (req, res) => {
//     // @ts-ignore
//     const userId: string = req.userId;
//     const task = await getNextTask(Number(userId));
//     if (!task) {
//         res.status(411).json({   
//             message: "No more tasks left for you to review"
//         })
//     } else {
//         res.json({   
//             task
//         })
//     }
// })
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const publicKey = "0x95fa625399153E4B28C43c6f0cdE76568A2bDDb9";
    // const { publicKey, signature } = req.body;
    // const message = new TextEncoder().encode("Sign into mechanical turks as a worker");
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
    const existingUser = yield prismaClient.worker.findFirst({
        where: {
            address: publicKey
        }
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            userId: existingUser.id
        }, config_1.WORKER_JWT_SECRET);
        res.json({
            token,
            amount: existingUser.pending_amount / 0.1 * 100000000,
            address: publicKey
        });
    }
    else {
        const user = yield prismaClient.worker.create({
            data: {
                address: publicKey,
                pending_amount: 0,
                locked_amount: 0
            }
        });
        const token = jsonwebtoken_1.default.sign({
            userId: user.id
        }, config_1.WORKER_JWT_SECRET);
        res.json({
            token,
            amount: 0
        });
    }
}));
exports.default = router;
