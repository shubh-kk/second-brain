import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt"
import zod, { string } from "zod";
import { Content, Link, User } from "./db";
import { JWT_SECRET } from "./config";
import userMiddleware from "./middleware";
import { random } from "./utils";
import cors from "cors";

const router: Router = Router();
const app: express.Application = express();

app.use(express.json())
// CORS configuration - must be before any routes
app.use(cors({
    origin: "http://localhost:5173"
}));
app.use("/api/v1", router);


const saltRounds = 5;
const signupBody = zod.object({
    username: zod.string().min(3),
    password: zod.string().min(6)
})
//signup route
router.post("/signup", async (req: Request, res: Response): Promise<any> => {
    const response = signupBody.safeParse(req.body);

    if (!response.success) {
        return res.status(411).json({
            msg: "Invalid Inputs"
        })
    }
    const existingUser = await User.findOne({
        username: response.data.username
    })

    if (existingUser) {
        return res.status(403).json({
            msg: "user Already Exist!!"
        })
    } else {
        try {
            const hashed_password = await bcrypt.hash(response.data.password, saltRounds)
            const user = await User.create({
                username: response.data.username,
                password: hashed_password
            })
            return res.json({
                msg: "User created successfully"
            });
        } catch (error) {
            return res.status(500).json({
                msg: "Error while Creating User"
            });
        }
    }

})

const loginBody = zod.object({
    username: zod.string().min(3),
    password: zod.string().min(6)
})
//signin route
router.post("/login", async (req: Request, res: Response): Promise<any> => {
    const response = loginBody.safeParse(req.body);

    if (!response.success) {
        return res.status(411).json({
            msg: "Invalid Inputs"
        })
    } else {
        try {
            const dbUser = await User.findOne({
                username: response.data.username
            })

            if (dbUser) {
                const isCorrectPassword = await bcrypt.compare(response.data.password, dbUser.password);

                if (!isCorrectPassword) {
                    return res.json({
                        msg: "Invalid Password"
                    })
                }
                const token = jwt.sign({ id: dbUser._id }, JWT_SECRET);

                return res.json({
                    msg: "Signin Successfull",
                    token
                })
            } else {
                return res.status(403).json({
                    msg: "Invalid Username"
                })
            }
        } catch (error) {
            res.json({
                msg: "Invalid Credentils!!"
            })
        }
    }
})


const contentBody = zod.object({
    title: zod.string(),
    link: zod.string(),
    type: zod.string(),
    tags: zod.array(
        zod.object({
            title: zod.string()
        })
    ).optional()
});
//add/create content
router.post("/content", userMiddleware, async (req, res): Promise<any> => {
    const payload = contentBody.safeParse(req.body);

    if (!payload.success) {
        res.status(400).json({
            msg: "Invalid Inputs",
            errors: payload.error.errors
        });
        return;
    }

    try {
        const content = await Content.create({
            title: payload.data.title,
            link: payload.data.link,
            type: payload.data.type,
            userId: req.userId,
            tags: payload.data.tags ?? []
        });

        return res.status(201).json({
            msg: "Content Added Successfully",
            content
        });
    } catch (error) {
        console.error("Content creation error:", error); // Add logging
        return res.status(500).json({
            msg: "Error occurred while creating content"
        });
    }
})
//get content
router.get("/content", userMiddleware, async (req, res): Promise<void> => {
    const userId = req.userId;

    try {
        const content = await Content.find({
            userId: userId
        }).populate("userId", "username")

        res.json({
            content
        })
        return;
    } catch (error) {
        res.status(411).json({
            msg: "Error Occurred"
        })
    }
})
//delete content
router.delete("/content", userMiddleware, async (req, res): Promise<void> => {

    try {
        const deleted = await Content.deleteOne({
            _id: req.body.contentId,
            userId: req.userId
        })

        if (deleted.deletedCount > 0) {
            res.json({
                msg: "Content Deleted"
            })
            return;
        } else {
            res.status(411).json({
                msg: "No Content Present/Already Deleted"
            })
            return;
        }
    } catch (error) {
        res.status(403).json({
            msg: "Trying to delete a doc you dont own"
        })
    }
})

const linkBody = zod.object({
    share: zod.boolean()
})
//create and remove shareable link
router.post("/brain/share", userMiddleware, async (req, res): Promise<void> => {
    const userId = req.userId;
    const payload = linkBody.safeParse(req.body);

    //incorrect inputs
    if (!payload.success) {
        res.status(411).json({
            msg: "Incorrect inputs"
        })
        return;
    }

    try {
        //if the share true
        if (payload.data.share) {
            const existingLink = await Link.findOne({
                userId
            })

            if (existingLink) {
                res.json({
                    link: existingLink.hash
                })
                return;
            }

            const hash = random(10); //creates random string of len 10
            await Link.create({
                hash,
                userId
            })

            res.json({
                link: hash
            })
            return;
        } else {  //if the share is false
            //TODO: has to check if link already there then only remove
            await Link.deleteOne({
                userId
            })
            res.json({
                msg: "Link removed"
            })
            return;
        }
    } catch (error) {
        res.status(411).json({
            msg: "Error Occurred",
            error
        })
    }
})

//get anothers content link
router.get("/brain/:shareLink", async (req, res): Promise<void> => {
    const hash = req.params.shareLink;

    try {
        const link = await Link.findOne({
            hash
        })
        if (!link) {
            res.status(411).json({
                message: "shared link is invalid or sharing is disabled"
            })
            return;
        }
        const content = await Content.find({
            userId: link.userId
        })

        const user = await User.findOne({
            _id: link.userId
        })

        if (!user) {
            res.status(411).json({
                message: "user not found, error should ideally not happen"
            })
            return;
        }

        res.json({
            username: user.username,
            content: content
        })
    } catch (error) {
        res.status(404).json({
            msg: "Error Occured",
            error
        })
    }

})

// Add this new endpoint to verify token
router.get("/me", userMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            res.status(404).json({ msg: "User not found" });
            return;
        }
        res.json({ user });
        return;
    } catch (error) {
        res.status(500).json({ msg: "Error verifying authentication" });
        return;
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})
