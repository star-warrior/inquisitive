import { Router } from "express";
import { z } from "zod";
import {
  getResourcesByNotebookId,
  updateResourceStatus,
  deleteResource,
} from "../controllers/resource.controller.js";

const router = Router();

const uuidSchema = z.string().uuid();
const statusSchema = z.enum(["todo", "in_progress", "completed", "skipped"]);

// GET route for getting all the resources based on notebookId
router.get("/:notebookId", async (req, res) => {
  const { notebookId } = req.params;
  const validNotebookId = uuidSchema.safeParse(notebookId);

  if (!validNotebookId.success) {
    res
      .status(400)
      .json({ success: false, message: "Invalid notebookId provided" });
    return;
  }

  try {
    const resources = await getResourcesByNotebookId(validNotebookId.data);
    res.status(200).json({ success: true, data: resources });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error: " + (error?.message || error),
    });
  }
});

// PATCH route that modifies the status of a resource
router.patch("/update/:resourceId", async (req, res) => {
  const { resourceId } = req.params;
  const { status } = req.body;

  const validResourceId = uuidSchema.safeParse(resourceId);
  if (!validResourceId.success) {
    res
      .status(400)
      .json({ success: false, message: "Invalid resourceId provided" });
    return;
  }

  const validStatus = statusSchema.safeParse(status);
  if (!validStatus.success) {
    res.status(400).json({
      success: false,
      message:
        "Invalid status provided. Must be one of: todo, in_progress, completed, skipped",
    });
    return;
  }

  try {
    const updatedResource = await updateResourceStatus(
      validResourceId.data,
      validStatus.data,
    );

    if (!updatedResource) {
      res.status(404).json({ success: false, message: "Resource not found" });
      return;
    }

    res.status(200).json({ success: true, data: updatedResource });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error: " + (error?.message || error),
    });
  }
});

// DELETE route that deletes a resource
router.delete("/:resourceId", async (req, res) => {
  const { resourceId } = req.params;
  const validResourceId = uuidSchema.safeParse(resourceId);

  if (!validResourceId.success) {
    res
      .status(400)
      .json({ success: false, message: "Invalid resourceId provided" });
    return;
  }

  try {
    const deletedResource = await deleteResource(validResourceId.data);

    if (!deletedResource) {
      res.status(404).json({ success: false, message: "Resource not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Resource deleted successfully",
      data: deletedResource,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error: " + (error?.message || error),
    });
  }
});

export default router;
