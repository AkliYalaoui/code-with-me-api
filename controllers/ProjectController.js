const Project = require("../models/Project.js");
const User = require("../models/User.js");

const createProject = async (req, res) => {
  try {
    const { title, description, html, css, js } = req.body;

    if (!title || title.trim() > 100) {
      return res.status(400).json({
        status: 400,
        message: "Title is required",
      });
    }
    if (!description || description.trim() > 1000) {
      return res.status(400).json({
        status: 400,
        message: "description is required",
      });
    }

    const project = await Project.create({
      userId : req.userId,  
      title: title.trim(),
      description: description.trim(),
      html: html ? html.trim() : "",
      css: css ? css.trim() : "",
      js: js ? js.trim() : "",
    });

    if (!project) {
      throw new Error();
    }

    res.status(201).json({
      status: 201,  
      message:"project created successfully",
      project
    });
  } catch (err) {
      console.log(err);
    res.status(500).json({
      status: 500,
      message: "something went wrong",
    });
  }
};

const addContributer = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const contributerId = req.body.contributerId;

    if (!projectId || !contributerId) {
      return res.status(404).json({
        status: 400,
        message: "Project not found",
      });
    }

    const contributer = await User.findById(contributerId, { password: 0 });

    if (!contributer) {
      return res.status(404).json({
        status: 404,
        message: "Contributer not found",
      });
    }
    
    const isContributing = await Project.findOne({ _id: projectId, userId: req.userId,"contributers._id":contributerId });
    
    if(!isContributing){
        return res.status(400).json({
            status: 400,
            message: "Contributer already added",
          });
    }

    const projectUpdated = await Project.updateOne(
      { _id: projectId, userId: req.userId },
      {
        $push: { contributers: contributer },
      }
    );
    console.log(projectUpdated);

    if (!projectUpdated) {
      throw new Error();
    }

    res.status(200).json({
      status: 200,
      message: "Contributer added successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "something went wrong",
    });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ userId: req.userId }, { "contributers._id": req.userId }],
    });
   res.status(200).json({
      message: "Projects retreived successfully",
      projects,
    });
  } catch (err) {
      console.log(err);
    res.status(500).json({
      status: 500,
      message: "something went wrong",
    });
  }
};

const updateProjectContent = async (req, res) => {
  try {
    const { html, css, js } = req.body;
    const projectId = req.params.projectId;

    if (!html || !css || !js) {
      res.status(400).json({
        status: 400,
        message: "Bad request, html css and js must all be included",
      });
    }

    if (!projectId) {
      return res.status(404).json({
        status: 404,
        message: "Project not found",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        status: 404,
        message: "Project not found",
      });
    }

    const updatedProject = await Project.updateOne(
      { _id: projectId },
      {
        html,
        css,
        js,
      }
    );

    if(!updatedProject){
        throw new Error();
    }

    res.status(200).json({
        message : "project saved successfully"
    })
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "something went wrong",
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    if (!projectId) {
      return res.status(404).json({
        status: 404,
        message: "Project not found",
      });
    }

    const project = await Project.find({
      _id: projectId,
      $or: [{ userId: req.userId }, { "contributers._id": req.userId }],
    });

    if (!project) {
      return res.status(404).json({
        status: 404,
        message: "Project not found",
      });
    }
    res.status(200).json({
      message: "Project retreived successfully",
      project,
    });
  } catch (err) {
      console.log(err);
    res.status(500).json({
      status: 500,
      message: "something went wrong",
    });
  }
};

module.exports = {
  getProjectById,
  createProject,
  addContributer,
  getAllProjects,
  updateProjectContent,
};
