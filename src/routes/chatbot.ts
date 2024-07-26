import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

router.post("/", async (req, res) => {
    const { name, age, email } = req.body;
})

export = router;