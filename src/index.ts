import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import zod from "zod";
import { User } from "./db";

const router: Router = Router();
const app: express.Application = express();
app.use(express.json())
app.use("/api/v1", router);


const signupBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})
//signup route
router.post("/signup", async (req: Request, res: Response): Promise<any> => {
    const payload = signupBody.safeParse(req.body);

    if (!payload.success) {
        return res.status(411).json({
            msg: "Invalid Inputs"
        })
    }


    const existingUser = await User.findOne({
        username: payload.data.username
    })

    if (existingUser) {
        return res.status(403).json({
            msg: "user Already Exist!!"
        })
    } else {
        try {
            const user = await User.create({
                username: payload.data.username,
                password: payload.data.password
            })
            return res.json({
                msg: "User created successfully"
            });
        } catch (error) {
            return res.status(500).json({
                msg: "Errror while Creatng User"
            });
        }
    }

})

router.post("/api/v1/signin", (req, res) => {

})

router.post("/api/v1/content", (req, res) => {

})

router.get("/api/v1/content", (req, res) => {

})
router.delete("/api/v1/content", (req, res) => {

})
router.post("/api/v1/brain/share", (req, res) => {

})

router.get("/api/v1/brain/:shareLink", (req, res) => {

})

app.listen(3000, () => {
    console.log("Server is listening");
})
