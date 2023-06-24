import { Router } from "express";
import * as multer from "multer";
import { list, detail, create, update, remove } from "./problem.ctrl";

// 파일 업로드를 위한 multer 설정
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "public/assets/img/problems");
    },
    filename(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

const router = Router();

// 라우팅 설정
router.get("/", list);
router.get("/new", (req, res) => {
  res.render("problem/create");
});
router.get("/:id", detail);
router.get("/:id/edit", detail);

router.post("/", upload.single('file'), create);
router.put("/:id", upload.single('file'), update);
router.delete("/:id", remove);

export default router;