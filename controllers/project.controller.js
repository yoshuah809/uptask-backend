import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";

const getProjects = async (req, res) => {
  const projects = await Project.find({
    $or: [{ members: { $in: req.user } }, { creator: { $in: req.user } }], // find also orders where the user is a member collaborator
  }).select("-tasks");

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

  const project = await Project.findById(id)
    .populate("tasks")
    .populate("members", "username email");

  if (!project) {
    const error = new Error("Not Found");
    return res.status(404).json({ message: error.message });
  }

  if (
    project.creator.toString() !== req.user._id.toString() &&
    !project.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    )
  ) {
    const error = new Error("Not Found-2");
    return res.status(401).json({ message: error.message });
  }
  //get project tasks

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

const searchMember = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email }).select("username email");

  if (!user) {
    const error = new Error("User not found");
    return res.status(404).json({ message: error.message });
  }
  res.json(user);
};
const addMember = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    const error = new Error("Project not found");
    return res.status(404).json({ message: error.message });
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(401).json({ message: error.message });
  }
  const { email } = req.body;

  const user = await User.findOne({ email: email }).select("username email");

  if (!user) {
    const error = new Error("User not found");
    return res.status(404).json({ message: error.message });
  }
  //check the contributor is not project admin
  if (project.creator.toString() === user._id.toString()) {
    const error = new Error("Creator can not be contributor");
    return res.status(404).json({ message: error.message });
  }
  //Verify that is not already a contributor
  if (project.members.includes(user._id)) {
    const error = new Error("User is already a Contributor to this project");
    return res.status(404).json({ message: error.message });
  }

  //If pass all verification we add it to the project
  project.members.push(user._id);
  await project.save();
  res.json({ message: "User Added successfully" });
};

const deleteMember = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    const error = new Error("Project not found");
    return res.status(404).json({ message: error.message });
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(401).json({ message: error.message });
  }

  // If all is good we delete
  project.members.pull(req.body.id);
  console.log(project);
  //return;
  await project.save();
  res.json({ message: "User Deleted successfully" });
};

const getTasks = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  if (!project) {
    const error = new Error("Project Not Found");
    return res.status(404).json({ message: error.message });
  }
  // if (project.creator.toString() !== req.user._id.toString()) {
  //   const error = new Error("Not Found");
  //   return res.status(401).json({ message: error.message });
  // }
  const tasks = await Task.find()
    .where("project")
    .equals(id)
    .populate("project", "name");
  res.json(tasks);
};

export default {
  getProject,
  newProject,
  getProjects,
  editProject,
  deleteProject,
  addMember,
  deleteMember,
  getTasks,
  searchMember,
};
