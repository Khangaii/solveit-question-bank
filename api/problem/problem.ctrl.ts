import { Request, Response } from "express";
import * as path from "path";
import * as fs from "fs";
import Problem from "../../model/problem";

// 목록조회
// http://localhost:3000/problem?limit=3
const list = async (req: Request, res: Response) => {
    req.query.limit = req.query.limit || "24";
    const limit = parseInt(req.query.limit as string, 10);

    if (Number.isNaN(limit)) {
        return res.status(400).json({ message: "limit가 숫자가 아닙니다." });
    }

    try {
        const result = await Problem.find()
        .sort({ _id: -1 })
        .limit(limit);
        
        res.status(200).render("problem/list", { result });
    } catch(e) {
        console.error;
        res.status(500).json({ message: "목록조회 시 오류가 발생했습니다." });
    }
}

// 상세조회
// http://localhost:3000/problem/1
const detail = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const result = await Problem.findById(id);

        if (!result) {
            return res.status(404).json({ message: "해당하는 데이터가 없습니다." });
        }

        if(req.url.endsWith("edit")) {
            return res.status(200).render("problem/update", { result });
        } else {
            return res.status(200).render("problem/detail", { result });
        }
    } catch(e) {
        console.error(e);
        res.status(500).json({ message: "상세조회 시 오류가 발생했습니다." });
    }
}

// 등록
// http://localhost:3000/problem (POST, form data)
const create = async (req: Request, res: Response) => {
    const { title, description, answer, solution, subject, tag, createdBy } = req.body;

    if (!title || !solution || !subject) {
        return res.status(400).json({ message: "필수 입력값이 누락되었습니다." });
    }

    try {
        const file = req.file;

        if(!file) {
            return res.status(400).json({ message: "파일이 업로드되지 않았습니다." });
        }

        const originalFileName = file.originalname;
        const fileExtension = path.extname(originalFileName).slice(1);

        const problem = new Problem({ title, description, answer, solution, subject, tag, fileName: originalFileName, fileExtension, createdBy });

        const fileName = `problem-${problem.id}.${fileExtension}`;

        const destination = "assets/img/problems";
        fs.renameSync(`public/${destination}/${originalFileName}`, `public/${destination}/${fileName}`);

        const result = await problem.save();

        res.status(201).json({ url: `/problem/${result.id}` });
    } catch(e) {
        console.error(e);
        res.status(500).json({ message: "등록 시 오류가 발생했습니다." });
    }
}

// 수정
// http://localhost:3000/problem/1
const update = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { title, description, answer, solution, subject, tag, createdBy } = req.body;

    try {
        const file = req.file;
        let result;

        if(file) {
            const problem = await Problem.findById(id);

            if (!problem) {
                return res.status(404).json({ message: "해당하는 데이터가 없습니다." });
            }

            fs.unlinkSync(`public/${problem.filePath}`);

            const originalFileName = file.originalname;
            const fileExtension = path.extname(originalFileName).slice(1);

            const fileName = `problem-${id}.${fileExtension}`;
            const destination = "/assets/img/problems";
            const filePath = `${destination}/${fileName}`;

            fs.renameSync(`public${destination}/${originalFileName}`, `public${filePath}`);

            result = await Problem.findByIdAndUpdate(
                id,
                { title, description, answer, solution, subject, tag, fileName: originalFileName, fileExtension, filePath, createdBy },
                { new: true }
            );
        } else {
            result = await Problem.findByIdAndUpdate(
                id,
                { title, description, answer, solution, subject, tag, createdBy },
                { new: true }
            );
        }

        if (!result) {
            return res.status(404).json({ message: "해당하는 데이터가 없습니다." });
        }

        res.status(201).json({ url: `/problem/${result.id}` });
    } catch(e) {
        console.error(e);
        res.status(500).json({ message: "수정 시 오류가 발생했습니다." });
    }
}

// 삭제
// http://localhost:3000/problem/1
const remove = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const result = await Problem.findByIdAndRemove(id);

        if (!result) {
            return res.status(404).json({ message: "해당하는 데이터가 없습니다." });
        }

        fs.unlink(`public${result.filePath}`, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("파일 삭제 성공");
            }
        });

        res.status(200).json({ result });
    } catch(e) {
        console.error(e);
        res.status(500).json({ message: "삭제 시 오류가 발생했습니다." });
    }
}

export { list, detail, create, update, remove };