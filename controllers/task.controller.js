import Project from "../models/project.model.js";
import Task from "../models/task.model.js";

const addTask = async (req, res) => {
  const { project } = req.body;
  const projectExist = await Project.findById(project);
  if (!projectExist) {
    const error = new Error("Project " + project + "does not exist");
    return res.status(404).json({ message: error.message });
  }
  if (projectExist.creator.toString() !== req.user._id.toString()) {
    const error = new Error(
      "You does not have permissions to add a task to this project"
    );
    return res.status(403).json({ message: error.message });
  }
  try {
    const taskToSave = await Task.create(req.body);
    res.json(taskToSave).populate("project name");
  } catch (error) {
    console.log(error);
  }
};
const getTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate("project");

  if (!task) {
    const error = new Error("Task not found");
    return res.status(404).json({ message: error.message });
  }

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Actions is not Allowed");
    return res.status(403).json({ message: error.message });
  }
  res.json(task);
};
const updateTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate("project");

  if (!task) {
    const error = new Error("Task not found");
    return res.status(404).json({ message: error.message });
  }

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Actions is not Allowed");
    return res.status(403).json({ message: error.message });
  }

  task.name = req.body.name || task.name;
  task.description = req.body.description || task.description;
  task.priority = req.body.priority || task.priority;
  task.deliveryDate = req.body.deliveryDate || task.deliveryDate;

  try {
    const taskToSave = await task.save();
    res.json(taskToSave);
  } catch (error) {
    console.log(error);
  }
};
const deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate("project");

  if (!task) {
    const error = new Error("Task not found");
    return res.status(404).json({ message: error.message });
  }

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Actions is not Allowed");
    return res.status(403).json({ message: error.message });
  }

  try {
    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

const updateStatus = async (req, res) => {};

export default {
  addTask,
  getTask,
  updateTask,
  deleteTask,
  updateStatus,
};
