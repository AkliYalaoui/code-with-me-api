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
      userId: req.userId,
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
      message: "project created successfully",
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

    const isContributing = await Project.findOne(
      {
        _id: projectId,
        userId: req.userId,
      },
      { contributers: 1 }
    );

    if (
      isContributing.contributers.some((c) => c._id.toString() == contributerId)
    ) {
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

    if (!projectUpdated) {
      throw new Error();
    }

    res.status(200).json({
      status: 200,
      message: "Contributer added successfully",
      newContributer: contributer,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Contributer ID is wrong",
    });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const allProjects = await Project.find();
    const projects =  allProjects.filter(project =>{
      return project.userId.toString() === req.userId || project.contributers.some(contributer => contributer._id.toString() === req.userId)
    });

    res.status(200).json({
      status: 200,
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

    if (!html && !css && !js) {
      return res.status(400).json({
        status: 400,
        message: "Bad request, html css and js must one of them be included",
      });
    }

    if (!projectId) {
      return res.status(404).json({
        status: 404,
        message: "Project not found",
      });
    }


    const allProjects = await Project.find({_id: projectId});
    const project =  allProjects.filter(project =>{
      return project.userId.toString() === req.userId || project.contributers.some(contributer => contributer._id.toString() === req.userId)
    });

    if (project.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Project not found",
      });
    }

    const updatedProject = await Project.updateOne(
      { _id: projectId },
      {
        html: html ? html.trim() : "",
        css: css ? css.trim() : "",
        js: js ? js.trim() : "",
      }
    );

    if (!updatedProject) {
      throw new Error();
    }

    res.status(200).json({
      status: 200,
      message: "project saved successfully",
    });
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
        message:
          "something went wrong, Couldn't find the project you searching for",
      });
    }

    const allProjects = await Project.find({_id: projectId});
    const project =  allProjects.filter(project =>{
      return project.userId.toString() === req.userId || project.contributers.some(contributer => contributer._id.toString() === req.userId)
    });

    if (project.length === 0) {
      return res.status(404).json({
        status: 404,
        message:
          "something went wrong, Couldn't find the project you searching for",
      });
    }
    
    res.status(200).json({
      status: 200,
      message: "Project retreived successfully",
      project : project[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      message:
        "something went wrong, Couldn't find the project you searching for",
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
