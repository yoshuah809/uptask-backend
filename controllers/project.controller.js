import Project from "../models/project.model.js";

const getProjects = async (req, res) => {
  const projects = await Project.find().where("creator").equals(req.user);
  res.status(200).json(projects);
};

const newProject = async (req, res) => {
  const project = new Project(req.body);
  project.creator = req.user._id;

  try {
    const projectToSave = await project.save();
    res.json(projectToSave);
  } catch (err) {
    console.error(err);
  }
};
const getProject = async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    const error = new Error("Not Found");
    return res.status(404).json({ message: error.message });
  }
  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Not Found-2");
    return res.status(401).json({ message: error.message });
  }
  res.json(project);
};
const editProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  if (!project) {
    const error = new Error("Not Found");
    return res.status(404).json({ message: error.message });
  }
  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Not Found");
    return res.status(401).json({ message: error.message });
  }

  project.name = req.body.name || project.name;
  project.description = req.body.description || project.description;
  project.deliveryDate = req.body.deliveryDate || project.deliveryDate;
  project.customer = req.body.customer || project.customer;

  try {
    const savedProject = await project.save();
    res.json(savedProject);
  } catch (error) {
    console.log(error);
  }
};
const deleteProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  if (!project) {
    const error = new Error("Not Found");
    return res.status(404).json({ message: error.message });
  }
  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Not Found");
    return res.status(401).json({ message: error.message });
  }
  try {
    await project.deleteOne(project);
    res.status(200).json({ message: "Project has been deleted" });
  } catch (error) {}
};

const addMember = async (req, res) => {};
const deleteMember = async (req, res) => {};
const getTasks = async (req, res) => {};

export default {
  getProject,
  newProject,
  getProjects,
  editProject,
  deleteProject,
  addMember,
  deleteMember,
  getTasks,
};
