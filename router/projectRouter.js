const router = require("express").Router();
const ProjectController = require("../controllers/ProjectController.js");
const {protect} = require("../middleware/AuthMiddlware.js");


router.post("/create",protect,ProjectController.createProject);
router.put("/content/:projectId",protect,ProjectController.updateProjectContent);
router.post("/add/contributer/:projectId",protect,ProjectController.addContributer);
router.get("/user",protect,ProjectController.getAllProjects);
router.get("/download/:projectId",protect,ProjectController.downloadProject);
router.get("/:projectId",protect,ProjectController.getProjectById);

module.exports = router;