import { Router, Request, Response } from "express";
import { z } from "zod";
import {
  getAllNoteBooks,
  createNoteBook,
  deleteNoteBook,
} from "../controllers/noteBook.controller.js";
import { countUserNotebooks } from "../services/notebook.service.js";
import {
  InvalidTopicError,
  ModelExhaustedError,
  NoSearchResultsError,
  AIServiceError,
} from "../services/aiSearch.service.js";
import { aiLimiter } from "../config/rateLimiter.js";

const router = Router();

const useruuidSchema = z.string();

router.get("/getAll", async (req: Request, res: Response) => {
  const useruuid = req?.header("useruuid");
  if (!useruuid) {
    res.status(500).json("No Id of the user provided");
    return;
  }

  const validUseruuid = useruuidSchema.safeParse(useruuid);

  if (!validUseruuid.success) {
    res.status(500).json("Invalid useruuid provided");
    return;
  }

  try {
    const response = await getAllNoteBooks(validUseruuid.data);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json("Internal server error" + error);
    return;
  }
});

router.post("/create", aiLimiter, async (req: Request, res: Response) => {
  const useruuid = req?.header("useruuid");
  if (!useruuid) {
    res
      .status(400)
      .json({ success: false, message: "No Id of the user provided" });
    return;
  }

  const validUseruuid = useruuidSchema.safeParse(useruuid);

  if (!validUseruuid.success) {
    res
      .status(400)
      .json({ success: false, message: "Invalid useruuid provided" });
    return;
  }

  try {
    const notebookCount = await countUserNotebooks(validUseruuid.data);
    if (notebookCount >= 5) {
      res.status(403).json({
        success: false,
        errorType: "FREE_TIER_LIMIT",
        message: "Free tier only allows a maximum of 5 notebooks. Upgrade to create more.",
      });
      return;
    }

    const response = await createNoteBook(req.body, validUseruuid.data);
    res.status(200).json({ success: true, data: response });
    return;
  } catch (error: any) {
    if (error instanceof InvalidTopicError) {
      res.status(400).json({
        success: false,
        errorType: "INVALID_TOPIC",
        reason: error.reason,
        message: error.message,
      });
      return;
    }
    if (error instanceof ModelExhaustedError) {
      res.status(503).json({
        success: false,
        errorType: "MODEL_EXHAUSTED",
        message:
          "Our AI systems are experiencing heavy traffic and models are currently exhausted. Please try again in a few moments.",
      });
      return;
    }
    if (error instanceof NoSearchResultsError) {
      res.status(422).json({
        success: false,
        errorType: "NO_SEARCH_RESULTS",
        message:
          "No relevant learning materials or tutorials could be found for this topic. Please try a different or more specific topic.",
      });
      return;
    }
    if (error instanceof AIServiceError) {
      res.status(502).json({
        success: false,
        errorType: "AI_SERVICE_ERROR",
        message:
          error.message || "An issue occurred while parsing the AI response.",
      });
      return;
    }

    res.status(500).json({
      success: false,
      errorType: "INTERNAL_SERVER_ERROR",
      message:
        error?.message ||
        "An internal server error occurred while creating the notebook.",
    });
    return;
  }
});

router.delete("/:notebookId", async (req: Request, res: Response) => {
  const useruuid = req?.header("useruuid");
  if (!useruuid) {
    res
      .status(400)
      .json({ success: false, message: "No Id of the user provided" });
    return;
  }

  const validUseruuid = useruuidSchema.safeParse(useruuid);
  if (!validUseruuid.success) {
    res
      .status(400)
      .json({ success: false, message: "Invalid useruuid provided" });
    return;
  }

  const { notebookId } = req.params;
  const validNotebookId = z.string().uuid().safeParse(notebookId);
  if (!validNotebookId.success) {
    res
      .status(400)
      .json({ success: false, message: "Invalid notebookId provided" });
    return;
  }

  try {
    const deletedNotebook = await deleteNoteBook(
      validNotebookId.data,
      validUseruuid.data,
    );

    if (!deletedNotebook) {
      res
        .status(404)
        .json({
          success: false,
          message: "Notebook not found or unauthorized to delete",
        });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Notebook deleted successfully",
      data: deletedNotebook,
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      errorType: "INTERNAL_SERVER_ERROR",
      message:
        error?.message ||
        "An internal server error occurred while deleting the notebook.",
    });
    return;
  }
});

export default router;
